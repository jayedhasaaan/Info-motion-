import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { GoogleGenAI } from '@google/genai';
import { buildFilmFrameSvg } from '../engine/continuousFilmRenderer';
import { normalizeBlueprintTimeline } from '../engine/motionMath';
import type { SceneBeat, VideoBlueprint } from '../types/engine';

const RESVG_FONT_CANDIDATES = [
  '/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf',
  '/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf',
  '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf',
  '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf',
  '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf',
  '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-SemiBold.ttf',
  '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf',
];

function getAvailableResvgFonts(): string[] {
  return RESVG_FONT_CANDIDATES.filter((fp) => fsSync.existsSync(fp));
}

export interface RenderMp4Options {
  blueprint: VideoBlueprint;
  outputMp4Path: string;
  voiceName?: string;
  voiceStyle?: string;
  fps?: number;
  width?: number;
  height?: number;
  includeVoiceover?: boolean;
  onProgress?: (stage: string, pct: number) => void;
}

export interface RenderMp4Result {
  outputMp4Path: string;
  durationSec: number;
  width: number;
  height: number;
  fps: number;
  fileSizeBytes: number;
  hasVoiceover: boolean;
  voiceName: string;
  syncedBlueprint: VideoBlueprint;
  renderedAt: string;
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseWavHeader(wavBuf: Buffer): {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  dataOffset: number;
  dataSize: number;
} {
  if (wavBuf.length < 44 || wavBuf.toString('ascii', 0, 4) !== 'RIFF') {
    // Raw 24kHz mono 16-bit PCM fallback
    return {
      sampleRate: 24000,
      channels: 1,
      bitsPerSample: 16,
      dataOffset: 0,
      dataSize: wavBuf.length,
    };
  }
  const channels = wavBuf.readUInt16LE(22) || 1;
  const sampleRate = wavBuf.readUInt32LE(24) || 24000;
  const bitsPerSample = wavBuf.readUInt16LE(34) || 16;

  // Walk RIFF chunks to find the exact "data" subchunk
  let offset = 12;
  while (offset + 8 <= wavBuf.length) {
    const chunkId = wavBuf.toString('ascii', offset, offset + 4);
    const chunkSize = wavBuf.readUInt32LE(offset + 4);
    if (chunkId === 'data') {
      return {
        sampleRate,
        channels,
        bitsPerSample,
        dataOffset: offset + 8,
        dataSize: Math.min(chunkSize, wavBuf.length - (offset + 8)),
      };
    }
    offset += 8 + chunkSize + (chunkSize % 2);
  }

  return {
    sampleRate,
    channels,
    bitsPerSample,
    dataOffset: 44,
    dataSize: Math.max(0, wavBuf.length - 44),
  };
}

function buildWavFromPcm(
  pcmData: Buffer,
  sampleRate = 24000,
  channels = 1,
  bitsPerSample = 16
): Buffer {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0, 4, 'ascii');
  header.writeUInt32LE(36 + pcmData.length, 4);
  header.write('WAVE', 8, 4, 'ascii');
  header.write('fmt ', 12, 4, 'ascii');
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36, 4, 'ascii');
  header.writeUInt32LE(pcmData.length, 40);
  return Buffer.concat([header, pcmData]);
}

async function synthesizeBeatWav(
  ai: GoogleGenAI,
  text: string,
  voiceName: string,
  voiceStyle: string
): Promise<Buffer> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const part =
        attempt === 0
          ? { text, speechMetadata: { style: voiceStyle } }
          : { text: `Speak in a ${voiceStyle} tone: ${text}` };

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [part],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error('Gemini TTS returned no inline audio data');
      }
      return Buffer.from(base64Audio, 'base64');
    } catch (err) {
      lastError = err;
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Failed to synthesize beat audio');
}

function computeNarrationWeight(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const pauses = (text.match(/[.,;!?—:]/g) || []).length;
  return Math.max(4, words + pauses * 1.4);
}

async function synthesizeGroupWavWithRetry(
  ai: GoogleGenAI,
  text: string,
  voiceName: string,
  voiceStyle: string,
  onProgress?: (stage: string, pct: number) => void,
  basePct = 10
): Promise<Buffer> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await synthesizeBeatWav(ai, text, voiceName, voiceStyle);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const retryMatch = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
      const waitSec = retryMatch ? Math.min(65, Math.ceil(Number(retryMatch[1])) + 2) : 15;
      if (/429|RESOURCE_EXHAUSTED|quota/i.test(msg) && attempt < 2) {
        onProgress?.(`Waiting ${waitSec}s for TTS rate limit window...`, basePct);
        await new Promise((r) => setTimeout(r, waitSec * 1000));
        continue;
      }
      if (attempt < 1) {
        await new Promise((r) => setTimeout(r, 1200));
        continue;
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Failed to synthesize voiceover group');
}

export async function synthesizeMasterVoiceover(
  blueprint: VideoBlueprint,
  wavOutPath: string,
  voiceName = 'Charon',
  voiceStyle = 'Measured, calm, authoritative documentary narrator with clear pacing and warm human cadence',
  onProgress?: (stage: string, pct: number) => void
): Promise<{
  wavPath: string | null;
  syncedBlueprint: VideoBlueprint;
  hasVoiceover: boolean;
}> {
  const ai = getGeminiClient();
  if (!ai) {
    return { wavPath: null, syncedBlueprint: blueprint, hasVoiceover: false };
  }

  const scenes = blueprint.scenes;
  // Batch into at most 2 TTS calls (<=6 beats per call) to stay cleanly inside Gemini TTS free-tier RPM limits
  // while maintaining natural documentary cadence and exact midpoint timing lock.
  const groupCount = scenes.length > 6 ? 2 : 1;
  const groupSize = Math.ceil(scenes.length / groupCount);
  const groups: SceneBeat[][] = [];
  for (let i = 0; i < scenes.length; i += groupSize) {
    groups.push(scenes.slice(i, i + groupSize));
  }

  let sampleRate = 24000;
  let channels = 1;
  let bitsPerSample = 16;
  const pcmSegments: Buffer[] = [];
  const updatedScenes: SceneBeat[] = [];
  const GROUP_TAIL_SEC = 0.55;

  for (let gIdx = 0; gIdx < groups.length; gIdx++) {
    const group = groups[gIdx];
    const basePct = Math.round(((gIdx) / groups.length) * 32) + 4;
    onProgress?.(
      `Synthesizing documentary voiceover (Part ${gIdx + 1}/${groups.length})...`,
      basePct
    );

    const joinedText = group
      .map((s) => s.narration.trim())
      .filter(Boolean)
      .join(' ... ');

    const wavBuf = await synthesizeGroupWavWithRetry(
      ai,
      joinedText,
      voiceName,
      voiceStyle,
      onProgress,
      basePct
    );

    const info = parseWavHeader(wavBuf);
    sampleRate = info.sampleRate;
    channels = info.channels;
    bitsPerSample = info.bitsPerSample;
    const bytesPerSec = sampleRate * channels * (bitsPerSample / 8);
    const rawPcm = wavBuf.subarray(info.dataOffset, info.dataOffset + info.dataSize);
    const tailBytes = Math.round(GROUP_TAIL_SEC * bytesPerSec);
    const alignedTailBytes = tailBytes - (tailBytes % (channels * (bitsPerSample / 8)));
    const silence = Buffer.alloc(alignedTailBytes);
    pcmSegments.push(rawPcm, silence);

    const groupTotalSec = (rawPcm.length + alignedTailBytes) / bytesPerSec;
    const weights = group.map((s) => computeNarrationWeight(s.narration));
    const totalWeight = weights.reduce((a, b) => a + b, 0) || group.length;

    group.forEach((scene, idx) => {
      const shareSec = groupTotalSec * (weights[idx] / totalWeight);
      updatedScenes.push({
        ...scene,
        durationSec: Number(Math.max(2.5, shareSec).toFixed(3)),
      });
    });

    onProgress?.(
      `Voiceover Part ${gIdx + 1}/${groups.length} synced (${groupTotalSec.toFixed(1)}s)`,
      Math.round(((gIdx + 1) / groups.length) * 35)
    );
  }

  const masterPcm = Buffer.concat(pcmSegments);
  const masterWav = buildWavFromPcm(masterPcm, sampleRate, channels, bitsPerSample);
  await fs.mkdir(path.dirname(wavOutPath), { recursive: true });
  await fs.writeFile(wavOutPath, masterWav);

  const { scenes: normalized, totalDurationSec } = normalizeBlueprintTimeline(updatedScenes);
  return {
    wavPath: wavOutPath,
    syncedBlueprint: {
      ...blueprint,
      scenes: normalized,
      totalPreviewSec: totalDurationSec,
    },
    hasVoiceover: true,
  };
}

export async function renderBlueprintToMp4(options: RenderMp4Options): Promise<RenderMp4Result> {
  const {
    blueprint,
    outputMp4Path,
    voiceName = 'Charon',
    voiceStyle = 'Measured, calm, authoritative documentary narrator with clear pacing and warm human cadence',
    fps = 30,
    includeVoiceover = true,
    onProgress,
  } = options;

  const isVertical = blueprint.aspectRatio === '9:16';
  const width = options.width ?? (isVertical ? 720 : 1280);
  const height = options.height ?? (isVertical ? 1280 : 720);

  await fs.mkdir(path.dirname(outputMp4Path), { recursive: true });

  let syncedBlueprint = blueprint;
  let wavPath: string | null = null;
  let hasVoiceover = false;

  if (includeVoiceover) {
    const tmpWavPath = outputMp4Path.replace(/\.mp4$/i, '.voiceover.wav');
    const voiceRes = await synthesizeMasterVoiceover(
      blueprint,
      tmpWavPath,
      voiceName,
      voiceStyle,
      onProgress
    );
    syncedBlueprint = voiceRes.syncedBlueprint;
    wavPath = voiceRes.wavPath;
    hasVoiceover = voiceRes.hasVoiceover;
  }

  const totalDurationSec = Math.max(4, syncedBlueprint.totalPreviewSec);
  const totalFrames = Math.ceil(totalDurationSec * fps);

  const fontFiles = getAvailableResvgFonts();
  const resvgOptions = {
    fitTo: { mode: 'width' as const, value: width },
    font: {
      fontFiles,
      loadSystemFonts: fontFiles.length === 0,
      defaultFontFamily: 'Noto Sans',
      serifFamily: 'Noto Serif',
      sansSerifFamily: 'Noto Sans',
      monospaceFamily: 'JetBrains Mono',
    },
  };

  const ffmpegArgs: string[] = [
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
  ];

  if (wavPath) {
    ffmpegArgs.push('-i', wavPath);
  }

  ffmpegArgs.push(
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-crf',
    '21',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart'
  );

  if (wavPath) {
    ffmpegArgs.push(
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
      '-shortest'
    );
  } else {
    ffmpegArgs.push('-an');
  }

  const tmpMp4Path = `${outputMp4Path}.tmp.mp4`;
  ffmpegArgs.push(tmpMp4Path);

  const ffmpeg = spawn('ffmpeg', ffmpegArgs, {
    stdio: ['pipe', 'ignore', 'pipe'],
  });

  let stderrLog = '';
  ffmpeg.stderr.on('data', (chunk: Buffer) => {
    stderrLog += chunk.toString('utf8');
    if (stderrLog.length > 8000) {
      stderrLog = stderrLog.slice(-8000);
    }
  });

  const ffmpegDone = new Promise<void>((resolve, reject) => {
    ffmpeg.on('error', reject);
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderrLog.slice(-500)}`));
    });
  });

  try {
    for (let f = 0; f < totalFrames; f++) {
      const t = Math.min(totalDurationSec - 0.001, f / fps);
      const { svg } = buildFilmFrameSvg(syncedBlueprint, t, width, height);
      const resvg = new Resvg(svg, resvgOptions);
      const rendered = resvg.render();
      const pixels = Buffer.from(
        rendered.pixels.buffer,
        rendered.pixels.byteOffset,
        rendered.pixels.byteLength
      );

      if (!ffmpeg.stdin.write(pixels)) {
        await once(ffmpeg.stdin, 'drain');
      }

      if (f % 90 === 0 || f === totalFrames - 1) {
        const pct = 35 + Math.round(((f + 1) / totalFrames) * 65);
        onProgress?.(`Rendering frames ${f + 1}/${totalFrames} (${width}x${height} @ ${fps}fps)`, pct);
      }
    }
    ffmpeg.stdin.end();
    await ffmpegDone;
    await fs.rename(tmpMp4Path, outputMp4Path);
  } catch (err) {
    ffmpeg.kill('SIGKILL');
    await fs.unlink(tmpMp4Path).catch(() => {});
    throw err;
  } finally {
    // Clean up temporary WAV once muxed cleanly into the MP4
    if (wavPath) {
      await fs.unlink(wavPath).catch(() => {});
    }
  }

  const stat = await fs.stat(outputMp4Path);
  return {
    outputMp4Path,
    durationSec: Number(totalDurationSec.toFixed(2)),
    width,
    height,
    fps,
    fileSizeBytes: stat.size,
    hasVoiceover,
    voiceName,
    syncedBlueprint,
    renderedAt: new Date().toISOString(),
  };
}
