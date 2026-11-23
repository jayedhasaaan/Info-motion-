import type {
  HardwareBudget,
  KokoroQuantization,
  SceneBeat,
  VideoFormatId,
  WhisperModelTier,
  WordTimestamp,
} from '../types/engine';

/**
 * Clamped linear interpolation (inspired by Remotion's mandatory clamp invariant).
 */
export function clampInterpolate(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): number {
  if (inputMax === inputMin) return outputMax;
  const raw = (value - inputMin) / (inputMax - inputMin);
  const clamped = Math.max(0, Math.min(1, raw));
  return outputMin + clamped * (outputMax - outputMin);
}

/**
 * After Effects Speed Graph approximation:
 * Steep fast-in velocity peak followed by a long exponential luxury deceleration tail.
 * Mirrors cubic-bezier(0.16, 1, 0.3, 1).
 */
export function aeSpeedGraphEase(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  if (x === 0 || x === 1) return x;
  return 1 - Math.pow(2, -10 * x);
}

/**
 * Asymmetric snappy exit curve (~10 frames in AE/Remotion best practices).
 * Accelerates cleanly out without sluggish trailing frames.
 */
export function aeSnappyExit(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * x;
}

/**
 * Deterministic underdamped spring curve for luxury weighted object settle.
 */
export function springCurve(
  elapsedSec: number,
  stiffness = 140,
  damping = 16,
  mass = 1
): number {
  if (elapsedSec <= 0) return 0;
  const omega0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const env = Math.exp(-zeta * omega0 * elapsedSec);
    const val = 1 - env * (Math.cos(omegaD * elapsedSec) + ((zeta * omega0) / omegaD) * Math.sin(omegaD * elapsedSec));
    return Math.abs(1 - val) < 0.001 && elapsedSec > 0.6 ? 1 : val;
  }
  const env = Math.exp(-omega0 * elapsedSec);
  return 1 - env * (1 + omega0 * elapsedSec);
}

/**
 * Illustrator Trim Paths progression (0..1) with optional staggered layer delay.
 */
export function trimPathProgress(
  localTimeSec: number,
  delaySec = 0,
  durationSec = 0.85
): number {
  const t = clampInterpolate(localTimeSec, delaySec, delaySec + durationSec, 0, 1);
  return aeSpeedGraphEase(t);
}

/**
 * 3-5 frame follow-through layer stagger converted cleanly for any FPS.
 */
export function staggerDelay(layerIndex: number, framesPerStep = 4, fps = 60): number {
  return (Math.max(0, layerIndex) * framesPerStep) / fps;
}

/**
 * Gentle idle micro-motion so resting Illustrator vectors stay alive (>2s rule).
 */
export function idleBreath(timeSec: number, amplitude = 4, frequencyHz = 0.42, phase = 0): number {
  return Math.sin(timeSec * Math.PI * 2 * frequencyHz + phase) * amplitude;
}

const EMPHASIS_PATTERN = /(\$|%|million|billion|thousand|zero|compound|inflation|wealth|debt|trap|hidden|silent|free|doubled|half|never|always|years|\d+)/i;

/**
 * Deterministic audio-first word-level alignment simulator matching WhisperX forced alignment
 * structure. Preserves exact scene boundaries and injects natural punctuation pause weights.
 */
export function alignSceneWords(
  narration: string,
  sceneStartSec: number,
  durationSec: number
): WordTimestamp[] {
  const tokens = narration
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) return [];

  const weights = tokens.map((token) => {
    const cleanLen = Math.max(2, token.replace(/[^a-zA-Z0-9$%]/g, '').length);
    let pauseBonus = 0;
    if (/[.!?]$/.test(token)) pauseBonus = 3.2;
    else if (/[,;:—–-]$/.test(token)) pauseBonus = 1.6;
    return Math.pow(cleanLen, 0.72) + pauseBonus;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const leadIn = Math.min(0.18, durationSec * 0.04);
  const tailOut = Math.min(0.22, durationSec * 0.05);
  const usable = Math.max(0.4, durationSec - leadIn - tailOut);

  let cursor = sceneStartSec + leadIn;
  return tokens.map((word, idx) => {
    const slice = (weights[idx] / totalWeight) * usable;
    const startSec = Number(cursor.toFixed(3));
    const endSec = Number((cursor + slice).toFixed(3));
    cursor += slice;
    return {
      word,
      startSec,
      endSec,
      emphasis: EMPHASIS_PATTERN.test(word),
    };
  });
}

/**
 * Recomputes cumulative scene start times and aligned words across a blueprint timeline.
 */
export function normalizeBlueprintTimeline(scenes: SceneBeat[]): {
  scenes: SceneBeat[];
  totalDurationSec: number;
} {
  let cursor = 0;
  const normalized = scenes.map((scene) => {
    const safeDuration = Math.max(2.5, Number(scene.durationSec) || 5.5);
    const startSec = Number(cursor.toFixed(3));
    const words = alignSceneWords(scene.narration, startSec, safeDuration);
    cursor += safeDuration;
    return {
      ...scene,
      durationSec: safeDuration,
      startSec,
      words,
    };
  });
  return { scenes: normalized, totalDurationSec: Number(cursor.toFixed(3)) };
}

/**
 * Detects local viral peaks inside a 100-segment YouTube Most Replayed heatmap array.
 * Mirrors scipy.signal.find_peaks(scores, height=threshold, distance=minDistance).
 */
export function detectHeatmapPeaks(
  heatmap: number[],
  videoDurationSec: number,
  threshold = 0.62,
  minDistanceSegments = 6
): Array<{ segmentIndex: number; timeSec: number; intensity: number }> {
  if (!heatmap.length || videoDurationSec <= 0) return [];

  const candidates: Array<{ segmentIndex: number; timeSec: number; intensity: number }> = [];
  for (let i = 1; i < heatmap.length - 1; i++) {
    const val = heatmap[i];
    if (val >= threshold && val >= heatmap[i - 1] && val > heatmap[i + 1]) {
      candidates.push({
        segmentIndex: i,
        timeSec: Number(((i / heatmap.length) * videoDurationSec).toFixed(2)),
        intensity: Number(val.toFixed(3)),
      });
    }
  }

  // Sort by peak intensity descending and enforce minimum segment distance
  candidates.sort((a, b) => b.intensity - a.intensity);
  const selected: Array<{ segmentIndex: number; timeSec: number; intensity: number }> = [];
  for (const cand of candidates) {
    const tooClose = selected.some(
      (existing) => Math.abs(existing.segmentIndex - cand.segmentIndex) < minDistanceSegments
    );
    if (!tooClose) selected.push(cand);
  }

  return selected.sort((a, b) => a.segmentIndex - b.segmentIndex);
}

/**
 * Exponential Moving Average (EMA) smoother for MediaPipe active-speaker 9:16 crop windows.
 * Prevents frame-to-frame camera jitter while tracking speaker movement smoothly.
 */
export function emaSmoothCropX(
  rawCenters: number[],
  frameWidth: number,
  cropWidth: number,
  alpha = 0.14
): number[] {
  if (rawCenters.length === 0) return [];
  const maxStart = Math.max(0, frameWidth - cropWidth);
  const clampStart = (center: number) =>
    Math.round(Math.max(0, Math.min(center - cropWidth / 2, maxStart)));

  const smoothed: number[] = [];
  let current = clampStart(rawCenters[0]);
  smoothed.push(current);

  for (let i = 1; i < rawCenters.length; i++) {
    const target = clampStart(rawCenters[i]);
    current = current + alpha * (target - current);
    smoothed.push(Math.round(Math.max(0, Math.min(current, maxStart))));
  }
  return smoothed;
}

/**
 * Formats seconds to ASS timestamp format H:MM:SS.cs (centiseconds).
 */
export function formatAssTimestamp(seconds: number): string {
  const safe = Math.max(0, seconds);
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = Math.floor(safe % 60);
  const cs = Math.floor((safe - Math.floor(safe)) * 100);
  return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

/**
 * Compiles word-level timestamps into a luxury Reel Advanced SubStation Alpha (.ASS)
 * karaoke file for hardware-speed FFmpeg libass burning.
 */
export function buildAssSubtitleFile(
  words: WordTimestamp[],
  palette: 'light' | 'dark',
  wordsPerLine = 4
): string {
  // ASS uses &HAABBGGRR (reversed BGR!)
  const primaryColor = palette === 'dark' ? '&H00EAF1F4' : '&H00151713';
  const accentGold = palette === 'dark' ? '&H006AAFD4' : '&H00377CA6';
  const outlineColor = palette === 'dark' ? '&H800D100F' : '&H50F6F4EF';

  const header = [
    '[Script Info]',
    'Title: Sovereign Motion Luxury Reel Captions',
    'ScriptType: v4.00+',
    'PlayResX: 1080',
    'PlayResY: 1920',
    'ScaledBorderAndShadow: yes',
    '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    `Style: LuxuryReel,Plus Jakarta Sans,64,${primaryColor},${accentGold},${outlineColor},&H64000000,-1,0,0,0,100,100,1.5,0,1,3,2,2,90,90,260,1`,
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
  ];

  const events: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    const chunk = words.slice(i, i + wordsPerLine);
    if (!chunk.length) continue;
    const lineStart = chunk[0].startSec;
    const lineEnd = chunk[chunk.length - 1].endSec;

    const karaokeText = chunk
      .map((w) => {
        const durCs = Math.max(8, Math.round((w.endSec - w.startSec) * 100));
        if (w.emphasis) {
          return `{\\kf${durCs}\\c${accentGold}}${w.word}{\\c${primaryColor}}`;
        }
        return `{\\kf${durCs}}${w.word}`;
      })
      .join(' ');

    events.push(
      `Dialogue: 0,${formatAssTimestamp(lineStart)},${formatAssTimestamp(lineEnd)},LuxuryReel,,0,0,0,,{\\fad(90,90)}${karaokeText}`
    );
  }

  return [...header, ...events].join('\n');
}

/**
 * Calculates accurate local disk space (MB) and flat peak RAM (GB) for a 16GB laptop.
 */
export function calculateHardwareBudget(params: {
  quantization: KokoroQuantization;
  whisperModel: WhisperModelTier;
  format: VideoFormatId;
  chunkSeconds: number;
  includeClipperStack: boolean;
}): HardwareBudget {
  const kokoroDiskMb =
    params.quantization === 'int8' ? 92 : params.quantization === 'fp16' ? 163 : 326;
  const voiceTensorsMb = 27; // Kokoro v1.0 voice style embeddings pack
  const whisperDiskMb = params.whisperModel === 'base.en' ? 145 : 465;
  const ffmpegDiskMb = 85;
  const clipperDepsDiskMb = params.includeClipperStack ? 165 : 0; // yt-dlp + MediaPipe face/pose + OpenCV headless

  const totalDiskMb =
    kokoroDiskMb + voiceTensorsMb + whisperDiskMb + ffmpegDiskMb + clipperDepsDiskMb;

  const targetMinutes =
    params.format === 'reel-1m'
      ? 1
      : params.format === 'youtube-2m'
        ? 2
        : params.format === 'youtube-10m'
          ? 10
          : 30;
  const totalSec = targetMinutes * 60;
  const safeChunk = Math.max(15, Math.min(120, params.chunkSeconds));
  const chunkCount = Math.ceil(totalSec / safeChunk);

  // Sequential chunk rendering keeps RAM flat regardless of 1m vs 30m length!
  const baseCanvasWorkerGb = 0.65;
  const chunkBufferGb = (safeChunk / 60) * 0.32;
  const audioStageGb = params.quantization === 'fp32' ? 0.45 : 0.25;
  const peakRenderRamGb = Number((baseCanvasWorkerGb + chunkBufferGb + audioStageGb).toFixed(2));

  // Standard Remotion Chromium concurrency=4 memory scaling estimate for comparison
  const remotionEquivalentRamGb = Number(
    (2.8 + targetMinutes * 0.42).toFixed(1)
  );

  // Realistic CPU/integrated-GPU sequential chunk render estimate on a 16GB laptop
  const estimatedLocalRenderMinutes = Number(
    (targetMinutes * 0.48 + (params.whisperModel === 'small.en' ? 0.35 : 0.15)).toFixed(1)
  );

  return {
    kokoroDiskMb,
    voiceTensorsMb,
    whisperDiskMb,
    clipperDepsDiskMb,
    ffmpegDiskMb,
    totalDiskMb,
    peakRenderRamGb,
    remotionEquivalentRamGb,
    chunkCount,
    estimatedLocalRenderMinutes,
    safeFor16GbRam: peakRenderRamGb < 3.5,
  };
}

export function formatTimecode(sec: number): string {
  const safe = Math.max(0, sec);
  const mins = Math.floor(safe / 60);
  const rem = Math.floor(safe % 60);
  const tenths = Math.floor((safe - Math.floor(safe)) * 10);
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}.${tenths}`;
}
