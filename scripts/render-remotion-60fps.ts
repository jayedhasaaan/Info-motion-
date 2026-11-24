import path from 'node:path';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { BANGLADESH_X_TIMELINE, TOTAL_FILM_FRAMES } from '../src/remotion/timingMath';
import { FILM_FPS } from '../src/remotion/theme';

const execFileAsync = promisify(execFile);

const CHROMIUM_EXECUTABLE =
  '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell';

const ROOT_DIR = process.cwd();
const RENDER_DIR = path.join(ROOT_DIR, 'public', 'renders');
const VOICEOVER_WAV = path.join(RENDER_DIR, 'bangladesh-x-voiceover.wav');
const OUTPUT_MP4 = path.join(RENDER_DIR, 'bangladesh-x-demo.mp4');
const OUTPUT_META = path.join(RENDER_DIR, 'bangladesh-x-demo.json');

/**
 * Multi-Layer Pro-Editor Sound Design (48kHz Stereo Pure PCM):
 *  1. Stereo velvet transition whoosh + C5/E5 crystalline chime at all 11 scene cuts
 *  2. Crisp wooden UI pop/bloop (+0.35s after each beat entry when hero prop/callout lands)
 *  3. Heavy rubber-stamp / slam thud (80Hz->34Hz pitch drop + transient) at Scene 02 X-slash & Scene 03 MYTH stamp
 *  4. Harmonic cash/summit shimmer arpeggio at Scene 03 cash stacks, Scene 09 Taka fan, Scene 10 Month 3 summit
 *  5. Ultra-subtle -34dB warm documentary studio air bed so pauses never feel dead while Charon stays 100% foreground
 */
async function buildMasterAudioWithSfx(
  voiceoverPath: string,
  cutTimestampsSec: number[],
  totalDurationSec: number,
  outputAudioPath: string
): Promise<void> {
  const sampleRate = 48000;
  const totalSamples = Math.ceil((totalDurationSec + 0.5) * sampleRate);
  const sfxLeft = new Float32Array(totalSamples);
  const sfxRight = new Float32Array(totalSamples);

  // Subtle deterministic PRNG for velvet whoosh & transient textures
  let rng = 133791;
  const nextRand = () => {
    rng = (rng * 1664525 + 1013904223) >>> 0;
    return (rng / 0xffffffff) * 2 - 1;
  };

  // Layer 5: Ultra-subtle warm documentary harmonic air pad (-34dB beneath voice)
  for (let i = 0; i < totalSamples; i++) {
    const tSec = i / sampleRate;
    const fadeIn = Math.min(1, tSec / 1.8);
    const fadeOut = Math.min(1, Math.max(0, (totalDurationSec - tSec) / 2.2));
    const breath = 0.78 + 0.22 * Math.sin(2 * Math.PI * 0.08 * tSec);
    const padL =
      (Math.sin(2 * Math.PI * 130.81 * tSec) * 0.45 +
        Math.sin(2 * Math.PI * 196.0 * tSec + 0.4) * 0.32 +
        Math.sin(2 * Math.PI * 261.63 * tSec + 1.1) * 0.23) *
      0.018 *
      breath *
      fadeIn *
      fadeOut;
    const padR =
      (Math.sin(2 * Math.PI * 130.81 * tSec + 0.25) * 0.45 +
        Math.sin(2 * Math.PI * 196.0 * tSec + 0.9) * 0.32 +
        Math.sin(2 * Math.PI * 329.63 * tSec + 0.2) * 0.23) *
      0.018 *
      breath *
      fadeIn *
      fadeOut;
    sfxLeft[i] += padL;
    sfxRight[i] += padR;
  }

  // Layer 1: Stereo transition whoosh + crystalline chime on all 11 cuts
  for (let c = 0; c < cutTimestampsSec.length; c++) {
    const cutSec = cutTimestampsSec[c];
    const startIdx = Math.max(0, Math.floor((cutSec - 0.16) * sampleRate));
    const len = Math.floor(0.42 * sampleRate);

    let lpL = 0;
    let lpR = 0;
    const chimeFreq = c % 2 === 0 ? 523.25 : 659.25; // C5 / E5 harmonic shimmer

    for (let i = 0; i < len; i++) {
      const idx = startIdx + i;
      if (idx >= totalSamples) break;
      const t = i / len;
      const env = Math.sin(Math.PI * t) ** 1.8;

      const alpha = 0.03 + 0.09 * Math.sin(Math.PI * t);
      lpL += alpha * (nextRand() - lpL);
      lpR += alpha * (nextRand() - lpR);

      const chimeEnv = Math.exp(-t * 8.5) * (t < 0.05 ? t / 0.05 : 1);
      const chime =
        (Math.sin(2 * Math.PI * chimeFreq * (i / sampleRate)) * 0.65 +
          Math.sin(2 * Math.PI * chimeFreq * 1.5 * (i / sampleRate)) * 0.35) *
        chimeEnv *
        0.045;

      const whooshGain = 0.068 * env;
      const pan = c % 2 === 0 ? 0.3 + 0.4 * t : 0.7 - 0.4 * t;
      sfxLeft[idx] += lpL * whooshGain * (1 - pan * 0.4) + chime;
      sfxRight[idx] += lpR * whooshGain * (0.6 + pan * 0.4) + chime;
    }
  }

  // Layer 2: Crisp wooden pop/bloop (+0.35s into each beat as hero prop/callout lands)
  const beatStartsSec = [0, ...cutTimestampsSec];
  for (let b = 0; b < beatStartsSec.length; b++) {
    const popSec = beatStartsSec[b] + 0.35;
    const startIdx = Math.max(0, Math.floor(popSec * sampleRate));
    const len = Math.floor(0.095 * sampleRate);
    let phase = 0;
    for (let i = 0; i < len; i++) {
      const idx = startIdx + i;
      if (idx >= totalSamples) break;
      const t = i / len;
      const freq = 310 + 460 * Math.exp(-t * 14);
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin(Math.PI * Math.min(1, t * 5)) * Math.exp(-t * 11);
      const val = Math.sin(phase) * env * 0.062;
      sfxLeft[idx] += val * 0.96;
      sfxRight[idx] += val * 1.04;
    }
  }

  // Layer 3: Heavy rubber-stamp / slam thuds (Scene 02 red X @ 16.73s, Scene 03 MYTH @ 29.35s)
  const slamTimestampsSec = [
    (beatStartsSec[1] ?? 12.15) + 275 / FILM_FPS,
    (beatStartsSec[2] ?? 25.85) + 210 / FILM_FPS,
  ];
  for (const slamSec of slamTimestampsSec) {
    const startIdx = Math.max(0, Math.floor(slamSec * sampleRate));
    const len = Math.floor(0.28 * sampleRate);
    let phase = 0;
    let clickLp = 0;
    for (let i = 0; i < len; i++) {
      const idx = startIdx + i;
      if (idx >= totalSamples) break;
      const t = i / len;
      const freq = 34 + 62 * Math.exp(-t * 12);
      phase += (2 * Math.PI * freq) / sampleRate;
      const bodyEnv = Math.exp(-t * 8.5) * Math.min(1, i / 120);
      const clickEnv = Math.exp(-t * 42);
      clickLp += 0.25 * (nextRand() - clickLp);
      const val = Math.sin(phase) * bodyEnv * 0.14 + clickLp * clickEnv * 0.09;
      sfxLeft[idx] += val;
      sfxRight[idx] += val;
    }
  }

  // Layer 4: Harmonic cash / summit shimmers (Scene 03 stacks, Scene 08 vault, Scene 09 Taka fan, Scene 10 summit)
  const shimmerTimestampsSec = [
    (beatStartsSec[2] ?? 25.85) + 490 / FILM_FPS,
    (beatStartsSec[7] ?? 89.2) + 440 / FILM_FPS,
    (beatStartsSec[8] ?? 102.35) + 420 / FILM_FPS,
    (beatStartsSec[9] ?? 116.0) + 465 / FILM_FPS,
  ];
  const shimmerNotes = [587.33, 739.99, 880.0, 1174.66]; // D5 - F#5 - A5 - D6 warm major sparkle
  for (const shimSec of shimmerTimestampsSec) {
    for (let n = 0; n < shimmerNotes.length; n++) {
      const noteStart = Math.max(0, Math.floor((shimSec + n * 0.055) * sampleRate));
      const len = Math.floor(0.32 * sampleRate);
      const freq = shimmerNotes[n];
      for (let i = 0; i < len; i++) {
        const idx = noteStart + i;
        if (idx >= totalSamples) break;
        const t = i / len;
        const env = Math.min(1, i / 160) * Math.exp(-t * 7.2);
        const val =
          (Math.sin(2 * Math.PI * freq * (i / sampleRate)) * 0.7 +
            Math.sin(2 * Math.PI * freq * 2 * (i / sampleRate)) * 0.3) *
          env *
          0.036;
        const pan = 0.32 + n * 0.12;
        sfxLeft[idx] += val * (1 - pan * 0.35);
        sfxRight[idx] += val * (0.65 + pan * 0.35);
      }
    }
  }

  // Write SFX track as temporary 16-bit PCM WAV
  const tmpSfxWav = path.join(RENDER_DIR, '.tmp-transition-sfx.wav');
  const dataBytes = totalSamples * 4; // stereo 16-bit
  const buf = Buffer.alloc(44 + dataBytes);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(2, 22); // stereo
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataBytes, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const l = Math.max(-1, Math.min(1, sfxLeft[i]));
    const r = Math.max(-1, Math.min(1, sfxRight[i]));
    buf.writeInt16LE(Math.round(l * 32767), offset);
    buf.writeInt16LE(Math.round(r * 32767), offset + 2);
    offset += 4;
  }
  await fs.writeFile(tmpSfxWav, buf);

  // Mix preserved voiceover (1.0x crisp) + pro-editor multi-layer SFX (0.48x) without clipping
  await execFileAsync('ffmpeg', [
    '-y',
    '-i',
    voiceoverPath,
    '-i',
    tmpSfxWav,
    '-filter_complex',
    '[0:a]volume=1.0[vo];[1:a]volume=0.48[sfx];[vo][sfx]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[out]',
    '-map',
    '[out]',
    '-ar',
    '48000',
    '-ac',
    '2',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    outputAudioPath,
  ]);

  await fs.unlink(tmpSfxWav).catch(() => {});
}

async function main() {
  const args = process.argv.slice(2);
  const previewStills = args.includes('--preview-stills');
  const testFramesIdx = args.indexOf('--test-frames');
  const testFrames = testFramesIdx !== -1 ? Number(args[testFramesIdx + 1]) || 30 : null;
  const concurrencyIdx = args.indexOf('--concurrency');
  const concurrency = concurrencyIdx !== -1 ? Math.min(4, Number(args[concurrencyIdx + 1]) || 4) : 4;

  const chunkIdxArg = args.indexOf('--chunk');
  const chunkSpec = chunkIdxArg !== -1 ? args[chunkIdxArg + 1] : null;
  const finalizeIdxArg = args.indexOf('--finalize');
  const finalizeTotal = finalizeIdxArg !== -1 ? Number(args[finalizeIdxArg + 1]) || 0 : 0;

  if (finalizeTotal > 0) {
    const tmpAudioMix = path.join(RENDER_DIR, '.tmp-master-audio.m4a');
    const tmpConcatList = path.join(RENDER_DIR, '.tmp-chunks.txt');
    const tmpFinalMp4 = path.join(RENDER_DIR, '.tmp-bangladesh-x-demo-60fps.mp4');

    const chunkPaths: string[] = [];
    for (let i = 1; i <= finalizeTotal; i++) {
      const p = path.join(RENDER_DIR, `.tmp-chunk-${i}-of-${finalizeTotal}.mp4`);
      await fs.access(p);
      chunkPaths.push(p);
    }

    await fs.writeFile(
      tmpConcatList,
      chunkPaths.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n') + '\n'
    );

    console.log(`[remotion-60fps] Building master audio (preserved voiceover + subtle transition SFX)...`);
    await buildMasterAudioWithSfx(
      VOICEOVER_WAV,
      BANGLADESH_X_TIMELINE.transitionCutSec,
      TOTAL_FILM_FRAMES / FILM_FPS,
      tmpAudioMix
    );

    console.log(`[remotion-60fps] Concatenating ${finalizeTotal} 60fps chunks + web-streaming H.264 optimize + muxing audio...`);
    await execFileAsync('ffmpeg', [
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      tmpConcatList,
      '-i',
      tmpAudioMix,
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '21',
      '-pix_fmt',
      'yuv420p',
      '-r',
      String(FILM_FPS),
      '-c:a',
      'copy',
      '-shortest',
      '-movflags',
      '+faststart',
      tmpFinalMp4,
    ]);

    await fs.rename(tmpFinalMp4, OUTPUT_MP4);
    await fs.unlink(tmpConcatList).catch(() => {});
    await fs.unlink(tmpAudioMix).catch(() => {});
    for (const p of chunkPaths) {
      await fs.unlink(p).catch(() => {});
    }
    await fs.unlink(path.join(RENDER_DIR, '.tmp-remotion-60fps-video.mp4')).catch(() => {});

    const stat = await fs.stat(OUTPUT_MP4);
    const metadata = {
      slug: 'bangladesh-x-demo',
      videoUrl: '/renders/bangladesh-x-demo.mp4',
      title: 'How to Make Real Internet Money from Bangladesh Using X (90-Day Plan)',
      engine: 'Infographics Show Broadcast v6.0 · Remotion 60fps · Lineless Split-Shaded',
      fps: FILM_FPS,
      width: 1280,
      height: 720,
      frames: TOTAL_FILM_FRAMES,
      beatCount: 12,
      durationSec: Number((TOTAL_FILM_FRAMES / FILM_FPS).toFixed(2)),
      fileSizeBytes: stat.size,
      hasVoiceover: true,
      voiceName: 'Charon (Preserved Voiceover + Transition SFX)',
      renderedAt: new Date().toISOString(),
    };

    await fs.writeFile(OUTPUT_META, JSON.stringify(metadata, null, 2));
    console.log(
      `[remotion-60fps] FINALIZED! ${OUTPUT_MP4} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`
    );
    return;
  }

  const t0 = Date.now();
  console.log(`[remotion-60fps] Bundling src/remotion/index.ts...`);
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT_DIR, 'src', 'remotion', 'index.ts'),
    onProgress: (pct) => {
      if (pct === 100) console.log(`[remotion-60fps] Bundle ready in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    },
  });

  const composition = await selectComposition({
    serveUrl,
    id: 'BangladeshXFilm',
    browserExecutable: CHROMIUM_EXECUTABLE,
    inputProps: {
      paletteMode: 'mix',
      subtitlesEnabled: true,
    },
  });

  console.log(
    `[remotion-60fps] Composition ${composition.id}: ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(2)}s)`
  );

  if (chunkSpec) {
    const [rawIdx, rawTotal] = chunkSpec.split('/').map(Number);
    if (!rawIdx || !rawTotal || rawIdx < 1 || rawIdx > rawTotal) {
      throw new Error(`Invalid --chunk spec "${chunkSpec}". Expected e.g. 1/3.`);
    }
    const perChunk = Math.ceil(TOTAL_FILM_FRAMES / rawTotal);
    const startFrame = (rawIdx - 1) * perChunk;
    const endFrame = Math.min(TOTAL_FILM_FRAMES - 1, rawIdx * perChunk - 1);
    const sliceFrames = endFrame - startFrame + 1;
    const chunkOut = path.join(RENDER_DIR, `.tmp-chunk-${rawIdx}-of-${rawTotal}.mp4`);

    let lastLoggedPct = -1;
    const renderStart = Date.now();
    console.log(
      `[remotion-60fps] Rendering chunk ${rawIdx}/${rawTotal}: frames ${startFrame}..${endFrame} (${sliceFrames} frames @ 60fps, concurrency=${concurrency})...`
    );

    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      pixelFormat: 'yuv420p',
      crf: 20,
      imageFormat: 'jpeg',
      jpegQuality: 86,
      x264Preset: 'ultrafast',
      concurrency,
      browserExecutable: CHROMIUM_EXECUTABLE,
      outputLocation: chunkOut,
      frameRange: [startFrame, endFrame],
      inputProps: { paletteMode: 'mix', subtitlesEnabled: true },
      onProgress: ({ progress, renderedFrames, encodedFrames }) => {
        const pct = Math.floor(progress * 100);
        if (pct >= lastLoggedPct + 20 || pct === 100) {
          lastLoggedPct = pct;
          const elapsed = ((Date.now() - renderStart) / 1000).toFixed(1);
          console.log(
            `[remotion-60fps] Chunk ${rawIdx}/${rawTotal} ${pct}% | rendered=${renderedFrames}/${sliceFrames} encoded=${encodedFrames} (${elapsed}s)`
          );
        }
      },
    });

    const stat = await fs.stat(chunkOut);
    console.log(
      `[remotion-60fps] Chunk ${rawIdx}/${rawTotal} DONE in ${((Date.now() - renderStart) / 1000).toFixed(1)}s (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`
    );
    return;
  }

  if (previewStills) {
    const stills = [
      { name: 'qa-scene01-dhaka-desk.png', frame: 210 },
      { name: 'qa-scene03-piggy-vs-cash.png', frame: 2140 },
      { name: 'qa-scene05-storefront.png', frame: 3560 },
      { name: 'qa-scene09-plane-bank.png', frame: 6620 },
    ];
    for (const s of stills) {
      const outPath = path.join(RENDER_DIR, s.name);
      await renderStill({
        composition,
        serveUrl,
        output: outPath,
        frame: s.frame,
        browserExecutable: CHROMIUM_EXECUTABLE,
        inputProps: { paletteMode: 'mix', subtitlesEnabled: true },
      });
      console.log(`[remotion-60fps] Saved QA still: ${s.name} (frame ${s.frame})`);
    }
    return;
  }

  if (testFrames) {
    const benchOut = path.join(RENDER_DIR, '.tmp-bench-60fps.mp4');
    const tb = Date.now();
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      pixelFormat: 'yuv420p',
      crf: 20,
      imageFormat: 'jpeg',
      jpegQuality: 86,
      x264Preset: 'ultrafast',
      concurrency,
      browserExecutable: CHROMIUM_EXECUTABLE,
      outputLocation: benchOut,
      frameRange: [0, testFrames - 1],
      inputProps: { paletteMode: 'mix', subtitlesEnabled: true },
    });

    const elapsedSec = (Date.now() - tb) / 1000;
    const fpsSpeed = testFrames / Math.max(0.01, elapsedSec);
    const estFullSec = TOTAL_FILM_FRAMES / fpsSpeed;
    console.log(
      `[remotion-60fps] Benchmark: ${testFrames} frames in ${elapsedSec.toFixed(2)}s (${fpsSpeed.toFixed(1)} frames/s) -> Est full ${TOTAL_FILM_FRAMES} frames: ${(estFullSec / 60).toFixed(1)} min`
    );
    await fs.unlink(benchOut).catch(() => {});
    return;
  }

  // Full 60fps production render
  const tmpVideoOnly = path.join(RENDER_DIR, '.tmp-remotion-60fps-video.mp4');
  const tmpAudioMix = path.join(RENDER_DIR, '.tmp-master-audio.m4a');
  const tmpFinalMp4 = path.join(RENDER_DIR, '.tmp-bangladesh-x-demo-60fps.mp4');

  console.log(`[remotion-60fps] Building master audio (preserved voiceover + subtle transition SFX)...`);
  await buildMasterAudioWithSfx(
    VOICEOVER_WAV,
    BANGLADESH_X_TIMELINE.transitionCutSec,
    TOTAL_FILM_FRAMES / FILM_FPS,
    tmpAudioMix
  );

  let lastLoggedPct = -1;
  const renderStart = Date.now();
  console.log(`[remotion-60fps] Rendering ${TOTAL_FILM_FRAMES} frames @ 60fps (concurrency=${concurrency})...`);

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    pixelFormat: 'yuv420p',
    crf: 20,
    imageFormat: 'jpeg',
    jpegQuality: 86,
    x264Preset: 'ultrafast',
    concurrency,
    browserExecutable: CHROMIUM_EXECUTABLE,
    outputLocation: tmpVideoOnly,
    inputProps: { paletteMode: 'mix', subtitlesEnabled: true },
    onProgress: ({ progress, renderedFrames, encodedFrames }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= lastLoggedPct + 10 || pct === 100) {
        lastLoggedPct = pct;
        const elapsed = ((Date.now() - renderStart) / 1000).toFixed(1);
        console.log(
          `[remotion-60fps] ${pct}% | rendered=${renderedFrames}/${TOTAL_FILM_FRAMES} encoded=${encodedFrames} (${elapsed}s)`
        );
      }
    },
  });

  console.log(`[remotion-60fps] Muxing 60fps H.264 stream + voiceover/SFX audio with +faststart...`);
  await execFileAsync('ffmpeg', [
    '-y',
    '-i',
    tmpVideoOnly,
    '-i',
    tmpAudioMix,
    '-c:v',
    'copy',
    '-c:a',
    'copy',
    '-shortest',
    '-movflags',
    '+faststart',
    tmpFinalMp4,
  ]);

  // Atomic replace
  await fs.rename(tmpFinalMp4, OUTPUT_MP4);
  await fs.unlink(tmpVideoOnly).catch(() => {});
  await fs.unlink(tmpAudioMix).catch(() => {});

  const stat = await fs.stat(OUTPUT_MP4);
  const metadata = {
    slug: 'bangladesh-x-demo',
    videoUrl: '/renders/bangladesh-x-demo.mp4',
    title: 'How to Make Real Internet Money from Bangladesh Using X (90-Day Plan)',
    engine: 'Infographics Show Broadcast v6.0 · Remotion 60fps · Lineless Split-Shaded',
    fps: FILM_FPS,
    width: 1280,
    height: 720,
    frames: TOTAL_FILM_FRAMES,
    beatCount: 12,
    durationSec: Number((TOTAL_FILM_FRAMES / FILM_FPS).toFixed(2)),
    fileSizeBytes: stat.size,
    hasVoiceover: true,
    voiceName: 'Charon (Preserved Voiceover + Transition SFX)',
    renderedAt: new Date().toISOString(),
  };

  await fs.writeFile(OUTPUT_META, JSON.stringify(metadata, null, 2));
  console.log(
    `[remotion-60fps] DONE! ${OUTPUT_MP4} (${(stat.size / (1024 * 1024)).toFixed(2)} MB) in ${((Date.now() - t0) / 1000).toFixed(1)}s`
  );
}

main().catch((err) => {
  console.error('[remotion-60fps] FAILED:', err);
  process.exit(1);
});
