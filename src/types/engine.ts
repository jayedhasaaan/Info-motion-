export type PaletteMode = 'light' | 'dark' | 'mix';
export type VideoFormatId = 'reel-1m' | 'youtube-2m' | 'youtube-10m' | 'deepdive-30m';
export type AspectRatio = '9:16' | '16:9';
export type SubtitleMode = 'off' | 'luxury-reel';
export type KokoroQuantization = 'int8' | 'fp16' | 'fp32';
export type WhisperModelTier = 'base.en' | 'small.en';
export type ClipFramingMode = 'ema-single' | 'podcast-split' | 'motion-split';
export type HardwareProfile = 'laptop-16gb-cpu' | 'apple-silicon' | 'nvidia-cuda';
export type SyncMode = 'audio-first-per-beat' | 'bring-your-own-audio';

export type VisualObjectId =
  | 'sovereign-coins'
  | 'compound-staircase'
  | 'eroding-banknote'
  | 'watch-escapement'
  | 'credit-trap-ledger'
  | 'vault-dial'
  | 'asset-balance-scale'
  | 'statement-scanner'
  | 'property-blueprint'
  | 'split-ledger-compare';

export type CameraMove = 'push-in' | 'pull-back' | 'pan-right' | 'whip-cut' | 'settle';
export type TransitionType = 'match-cut' | 'ledger-wipe' | 'velvet-dissolve' | 'whip-pan';
export type SfxCue = 'coin-chime' | 'ledger-tick' | 'velvet-whoosh' | 'vault-lock' | 'tension-pulse';
export type EmotionTone = 'grounded-mentor' | 'sharp-investigative' | 'urgent-warning' | 'calm-authority';

/**
 * Universal Procedural Vector Scene Graph primitives.
 * Allows the AI director to depict ANY object, environment, physical metaphor,
 * diagram, UI frame, map, or kinetic typography on ANY topic — never capped to charts.
 */
export type VectorPrimitiveKind = 'path' | 'rect' | 'circle' | 'ellipse' | 'polygon' | 'line' | 'text';
export type VectorColorToken =
  | 'ink'
  | 'muted'
  | 'accent'
  | 'accent-light'
  | 'emerald'
  | 'crimson'
  | 'surface'
  | 'surface-alt'
  | 'bg'
  | 'none';

export type LayerEntranceAnim =
  | 'trim-path'
  | 'spring-pop'
  | 'slide-up'
  | 'slide-left'
  | 'slide-right'
  | 'scale-bloom'
  | 'drop-gravity'
  | 'fade';

export type LayerIdleAnim = 'none' | 'float' | 'pulse' | 'rotate-slow' | 'sway' | 'drip' | 'tick';

export type ContinuityBridgeType =
  | 'zoom-through'
  | 'pan-follow'
  | 'path-extension'
  | 'morph-handoff'
  | 'match-cut-spin'
  | 'vertical-dolly';

export interface SceneVectorLayer {
  id: string;
  label: string;
  kind: VectorPrimitiveKind;
  depth: 'bg' | 'mid' | 'fg';
  /** Coordinates live in a normalized 1000 x 1000 local stage space */
  d?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rx?: number;
  ry?: number;
  cx?: number;
  cy?: number;
  r?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  points?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: 'editorial' | 'sans' | 'mono';
  fontWeight?: number;
  textAnchor?: 'start' | 'middle' | 'end';
  fill?: VectorColorToken | string;
  stroke?: VectorColorToken | string;
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
  rotation?: number;
  entrance: LayerEntranceAnim;
  idle?: LayerIdleAnim;
  delaySec: number;
  durationSec: number;
}

export interface ContinuityBridge {
  type: ContinuityBridgeType;
  /** Explicit human-readable explanation of how the previous shot physically flows into this shot */
  carryDescription: string;
  /** Vector path or anchor connecting Beat N-1 to Beat N in continuous world space */
  bridgeColor?: VectorColorToken;
}

export interface WordTimestamp {
  word: string;
  startSec: number;
  endSec: number;
  emphasis?: boolean;
}

export interface SceneBeat {
  id: string;
  chapter: string;
  headline: string;
  sublabel: string;
  narration: string;
  durationSec: number;
  startSec: number;
  /** Human-readable visual direction describing the bespoke artwork depicting the narration 100% */
  visualConcept: string;
  /** Continuous spatial world coordinates for unbroken film camera motion */
  worldX: number;
  worldY: number;
  cameraZoom: number;
  cameraRotate: number;
  continuity: ContinuityBridge;
  /** Procedural Illustrator-grade vector layers depicting literally anything the script says */
  layers: SceneVectorLayer[];
  /** Legacy fallback id kept only for Viral Clipper overlay compatibility */
  visualObject: VisualObjectId;
  metricStart: string;
  metricEnd: string;
  metricUnit?: string;
  cameraMove: CameraMove;
  transition: TransitionType;
  palettePolarity: 'light' | 'dark';
  sfxCue: SfxCue;
  emotion: EmotionTone;
  words: WordTimestamp[];
}

export interface ScriptFormulaSummary {
  hookStrategy: string;
  openLoop: string;
  continuitySpine: string;
  pacingRule: string;
  payoffLine: string;
}

export interface AeCraftOptions {
  trimPaths: boolean;
  trackMattes: boolean;
  motionBlur: boolean;
  fiveLayerStack: boolean;
  layerStagger: boolean;
}

export interface VideoBlueprint {
  id: string;
  title: string;
  topic: string;
  hook: string;
  format: VideoFormatId;
  aspectRatio: AspectRatio;
  paletteMode: PaletteMode;
  subtitlesEnabled: boolean;
  fps: number;
  targetMinutes: number;
  totalPreviewSec: number;
  aeCraft: AeCraftOptions;
  formula: ScriptFormulaSummary;
  revisionCount: number;
  approved: boolean;
  scenes: SceneBeat[];
}

export interface KokoroVoiceActor {
  id: string;
  name: string;
  accent: 'US English' | 'UK English';
  gender: 'Female' | 'Male';
  grade: string;
  character: string;
  bestFor: string;
  geminiPreviewVoice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  geminiStylePrompt: string;
}

export interface SkillConfig {
  repoName: string;
  authorHandle: string;
  targetModel: string;
  defaultPalette: PaletteMode;
  defaultSubtitles: SubtitleMode;
  kokoroQuantization: KokoroQuantization;
  primaryVoiceId: string;
  secondaryVoiceId: string;
  voiceBlendRatio: number;
  speechSpeed: number;
  emotionCadence: EmotionTone;
  whisperModel: WhisperModelTier;
  chunkSeconds: number;
  clipFramingDefault: ClipFramingMode;
  removeDeadAir: boolean;
  deadAirThresholdDb: number;
  injectMotionOverlays: boolean;
  enable3DCloudFlythrough: boolean;
  enableSpeedRampBlur: boolean;
  enable3DExtrudedProps: boolean;
  enableWordLockedType: boolean;
  enableTactileFinish: boolean;
  hardwareProfile: HardwareProfile;
  syncMode: SyncMode;
}

export interface ViralMoment {
  id: string;
  title: string;
  hookLine: string;
  startSec: number;
  endSec: number;
  heatmapIntensity: number;
  hookScore: number;
  retentionScore: number;
  payoffScore: number;
  deadAirSavedSec: number;
  transcriptExcerpt: string;
  whyItHits: string;
  framingMode: ClipFramingMode;
  overlayObject: VisualObjectId;
  overlayHeadline: string;
  overlayMetric: string;
  captionsEnabled: boolean;
  palettePolarity: 'light' | 'dark';
}

export interface ViralClipProject {
  id: string;
  sourceTitle: string;
  sourceChannel: string;
  sourceUrl: string;
  sourceDurationSec: number;
  heatmap: number[];
  moments: ViralMoment[];
}

export interface HardwareBudget {
  kokoroDiskMb: number;
  voiceTensorsMb: number;
  whisperDiskMb: number;
  clipperDepsDiskMb: number;
  ffmpegDiskMb: number;
  totalDiskMb: number;
  peakRenderRamGb: number;
  remotionEquivalentRamGb: number;
  chunkCount: number;
  estimatedLocalRenderMinutes: number;
  safeFor16GbRam: boolean;
}

export interface SkillRepoFile {
  path: string;
  category: 'Core' | 'Reference' | 'Script' | 'Template';
  language: 'markdown' | 'python' | 'javascript' | 'typescript' | 'json';
  summary: string;
  content: string;
}
