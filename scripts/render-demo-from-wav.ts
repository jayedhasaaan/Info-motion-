import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { createInitialBlueprint } from '../src/data/presets';
import { buildFilmFrameSvg } from '../src/engine/continuousFilmRenderer';
import { normalizeBlueprintTimeline } from '../src/engine/motionMath';
import type { VideoBlueprint } from '../src/types/engine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONT_FILES = [
  '/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf',
  '/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf',
  '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf',
  '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf',
  '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf',
  '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-SemiBold.ttf',
  '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf',
].filter((f) => fsSync.existsSync(f));

function narrationWeight(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const pauses = (text.match(/[.,;!?—:]/g) || []).length;
  return Math.max(4, words + pauses * 1.4);
}

function getWavDurationSec(wavPath: string): number {
  const buf = fsSync.readFileSync(wavPath);
  const sampleRate = buf.readUInt32LE(24) || 24000;
  const channels = buf.readUInt16LE(22) || 1;
  const bits = buf.readUInt16LE(34) || 16;
  const bytesPerSec = sampleRate * channels * (bits / 8);
  return Math.max(10, (buf.length - 44) / bytesPerSec);
}

function buildSyncedBlueprint(totalDurationSec: number): VideoBlueprint {
  const bp = createInitialBlueprint();
  const weights = bp.scenes.map((s) => narrationWeight(s.narration));
  const sum = weights.reduce((a, b) => a + b, 0);
  const scaled = bp.scenes.map((s, idx) => ({
    ...s,
    durationSec: Number((totalDurationSec * (weights[idx] / sum)).toFixed(3)),
  }));
  const { scenes, totalDurationSec: normDur } = normalizeBlueprintTimeline(scaled);
  return { ...bp, scenes, totalPreviewSec: normDur };
}

async function renderChunk(
  blueprint: VideoBlueprint,
  startFrame: number,
  endFrame: number,
  fps: number,
  width: number,
  height: number,
  chunkOutPath: string
): Promise<void> {
  const resvgOpts = {
    fitTo: { mode: 'width' as const, value: width },
    font: {
      fontFiles: FONT_FILES,
      loadSystemFonts: false,
      defaultFontFamily: 'Noto Sans',
      serifFamily: 'Noto Serif',
      sansSerifFamily: 'Noto Sans',
      monospaceFamily: 'JetBrains Mono',
    },
  };

  const ffmpeg = spawn(
    'ffmpeg',
    [
      '-y',
      '-f',
      'rawvideo',
      '-pixel_format',
      'rgba',
      '-video_size',
      `${width}x${height}`,
      '-framerate',
      String(fps),
      '-i',
      'pipe:0',
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '20',
      '-pix_fmt',
      'yuv420p',
      '-an',
      chunkOutPath,
    ],
    { stdio: ['pipe', 'ignore', 'pipe'] }
  );

  let errBuf = '';
  ffmpeg.stderr.on('data', (c: Buffer) => {
    errBuf = (errBuf + c.toString('utf8')).slice(-4000);
  });

  const done = new Promise<void>((resolve, reject) => {
    ffmpeg.on('error', reject);
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`chunk ffmpeg failed (${code}): ${errBuf.slice(-400)}`));
    });
  });

  for (let f = startFrame; f < endFrame; f++) {
    const t = Math.min(blueprint.totalPreviewSec - 0.001, f / fps);
    const { svg } = buildFilmFrameSvg(blueprint, t, width, height);
    const rendered = new Resvg(svg, resvgOpts).render();
    const pixels = Buffer.from(
      rendered.pixels.buffer,
      rendered.pixels.byteOffset,
      rendered.pixels.byteLength
    );
    if (!ffmpeg.stdin.write(pixels)) {
      await once(ffmpeg.stdin, 'drain');
    }
  }
  ffmpeg.stdin.end();
  await done;
}

async function runMaster() {
  const rendersDir = path.resolve(__dirname, '../public/renders');
  const wavPath = path.join(rendersDir, 'bangladesh-x-demo.voiceover.wav');
  const finalMp4 = path.join(rendersDir, 'bangladesh-x-demo.mp4');
  const tmpMp4 = path.join(rendersDir, 'bangladesh-x-demo.tmp.mp4');
  const metaPath = path.join(rendersDir, 'bangladesh-x-demo.json');

  const durationSec = getWavDurationSec(wavPath);
  const fps = 24;
  const width = 1280;
  const height = 720;
  const totalFrames = Math.ceil(durationSec * fps);
  const workers = Math.min(4, Math.max(2, os.cpus().length));
  const chunkFrames = Math.ceil(totalFrames / workers);

  console.log(
    `Master parallel render: ${width}x${height}@${fps}fps, ${durationSec.toFixed(2)}s (${totalFrames} frames) across ${workers} workers`
  );
  const t0 = Date.now();

  const chunkPaths: string[] = [];
  const childPromises: Array<Promise<void>> = [];

  for (let w = 0; w < workers; w++) {
    const startFrame = w * chunkFrames;
    const endFrame = Math.min(totalFrames, (w + 1) * chunkFrames);
    if (startFrame >= endFrame) break;
    const chunkPath = path.join(rendersDir, `_chunk_${w}.mp4`);
    chunkPaths.push(chunkPath);

    childPromises.push(
      new Promise<void>((resolve, reject) => {
        const child = spawn(
          'npx',
          ['tsx', __filename, '--worker', String(startFrame), String(endFrame), String(durationSec), chunkPath],
          { stdio: 'inherit' }
        );
        child.on('error', reject);
        child.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Worker ${w} exited with code ${code}`));
        });
      })
    );
  }

  await Promise.all(childPromises);
  console.log(`All ${chunkPaths.length} video chunks rendered in ${((Date.now() - t0) / 1000).toFixed(1)}s. Muxing voiceover...`);

  const concatListPath = path.join(rendersDir, '_concat_list.txt');
  await fs.writeFile(
    concatListPath,
    chunkPaths.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n'),
    'utf8'
  );

  await new Promise<void>((resolve, reject) => {
    const mux = spawn(
      'ffmpeg',
      [
        '-y',
        '-f',
        'concat',
        '-safe',
        '0',
        '-i',
        concatListPath,
        '-i',
        wavPath,
        '-c:v',
        'copy',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-ar',
        '48000',
        '-ac',
        '2',
        '-af',
        'loudnorm=I=-15:TP=-1.5:LRA=11',
        '-movflags',
        '+faststart',
        '-shortest',
        tmpMp4,
      ],
      { stdio: ['ignore', 'ignore', 'inherit'] }
    );
    mux.on('error', reject);
    mux.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Final mux failed with code ${code}`));
    });
  });

  await fs.rename(tmpMp4, finalMp4);
  for (const p of [...chunkPaths, concatListPath]) {
    await fs.unlink(p).catch(() => {});
  }

  const stat = await fs.stat(finalMp4);
  const bp = buildSyncedBlueprint(durationSec);
  const meta = {
    videoUrl: '/renders/bangladesh-x-demo.mp4',
    title: bp.title,
    durationSec: Number(durationSec.toFixed(2)),
    width,
    height,
    fps,
    fileSizeBytes: stat.size,
    hasVoiceover: true,
    voiceName: 'Charon',
    renderedAt: new Date().toISOString(),
    beatCount: bp.scenes.length,
  };
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8');
  console.log(
    `COMPLETE in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${finalMp4} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`
  );
}

async function main() {
  if (process.argv[2] === '--worker') {
    const startFrame = Number(process.argv[3]);
    const endFrame = Number(process.argv[4]);
    const durationSec = Number(process.argv[5]);
    const outPath = process.argv[6];
    const bp = buildSyncedBlueprint(durationSec);
    await renderChunk(bp, startFrame, endFrame, 24, 1280, 720, outPath);
    console.log(`Worker finished frames ${startFrame}..${endFrame}`);
    return;
  }
  await runMaster();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
