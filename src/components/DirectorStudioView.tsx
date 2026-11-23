import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  Film,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Player, type PlayerRef } from '@remotion/player';
import { KOKORO_VOICES, TOPIC_STARTERS } from '../data/presets';
import { buildBeatThumbnailSvg, buildFilmFrameSvg } from '../engine/continuousFilmRenderer';
import {
  INFOGRAPHICS_WORLD_PALETTES,
  auditBlueprintForInfographicsStyle,
} from '../engine/infographicsStyleBible';
import { formatTimecode, normalizeBlueprintTimeline } from '../engine/motionMath';
import { playLuxurySfx } from '../engine/sfxEngine';
import { BangladeshXFilm } from '../remotion/BangladeshXFilm';
import { FILM_FPS } from '../remotion/theme';
import { BANGLADESH_X_TIMELINE, TOTAL_FILM_FRAMES } from '../remotion/timingMath';
import type {
  PaletteMode,
  SkillConfig,
  VideoBlueprint,
  VideoFormatId,
} from '../types/engine';

interface RenderedVideoMeta {
  videoUrl: string;
  title: string;
  durationSec: number;
  width: number;
  height: number;
  fps: number;
  fileSizeBytes: number;
  hasVoiceover: boolean;
  voiceName: string;
  renderedAt: string;
  beatCount: number;
  engine?: string;
}

export type StudioStep = 'brief' | 'review' | 'preview';

interface DirectorStudioViewProps {
  step: StudioStep;
  onStepChange: (step: StudioStep) => void;
  blueprint: VideoBlueprint;
  config: SkillConfig;
  onUpdateBlueprint: (next: VideoBlueprint) => void;
  onExportZip: () => void;
  onNotify: (msg: string) => void;
}

const QUICK_CRITIQUES = [
  'Make the opening 3 seconds open inside a sharper physical environment hook',
  'Replace any abstract visual with bold real-world architecture and machinery',
  'Alternate warm daylight worlds with deep coastal dusk for stronger visual contrast',
  'Make every beat transition use a distinct AE whip-pan, iris reveal, or zoom-through',
];

const TRANSITION_LABELS = [
  'Zoom-Through',
  'AE Whip Pan',
  'Diagonal Sweep',
  'Inked Iris',
  'Shutter Wipe',
  'Liquid Wave',
  'Diagonal Sweep',
  'Vault Iris',
  'Whip Pan Up',
  'Shutter Wipe',
  'Sunrise Wave',
  'Finale Hold',
];

export function DirectorStudioView({
  step,
  onStepChange,
  blueprint,
  config,
  onUpdateBlueprint,
  onExportZip,
  onNotify,
}: DirectorStudioViewProps) {
  const [topicInput, setTopicInput] = useState(blueprint.topic);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  const [critiqueInput, setCritiqueInput] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const [reviseError, setReviseError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [sfxMuted, setSfxMuted] = useState(true);
  const [displayTime, setDisplayTime] = useState(0);
  const [activeBeatIdx, setActiveBeatIdx] = useState(0);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const [previewMode, setPreviewMode] = useState<'mp4' | 'interactive'>('mp4');
  const [renderedVideo, setRenderedVideo] = useState<RenderedVideoMeta | null>(null);
  const [renderStatus, setRenderStatus] = useState<'idle' | 'rendering' | 'error'>('idle');
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [videoCacheBust, setVideoCacheBust] = useState(0);

  const stageHostRef = useRef<HTMLDivElement | null>(null);
  const remotionPlayerRef = useRef<PlayerRef | null>(null);
  const playheadRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const blueprintRef = useRef<VideoBlueprint>(blueprint);
  const sfxMutedRef = useRef<boolean>(sfxMuted);
  const lastBeatIdxRef = useRef<number>(0);
  const dirtyRef = useRef<boolean>(true);
  const pollTimerRef = useRef<number | null>(null);

  const isRemotionFlagship =
    blueprint.id === 'bangladesh-x-demo' ||
    blueprint.title.toLowerCase().includes('bangladesh');

  useEffect(() => {
    let active = true;
    fetch('/api/demo-video')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.available && data.videoUrl) {
          setRenderedVideo(data as RenderedVideoMeta);
          setPreviewMode('mp4');
        } else {
          setPreviewMode('interactive');
        }
      })
      .catch(() => {
        if (active) setPreviewMode('interactive');
      });
    return () => {
      active = false;
      if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
    };
  }, []);

  useEffect(() => {
    blueprintRef.current = blueprint;
    dirtyRef.current = true;
  }, [blueprint]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    dirtyRef.current = true;
  }, [isPlaying]);

  useEffect(() => {
    sfxMutedRef.current = sfxMuted;
  }, [sfxMuted]);

  const frameDims =
    blueprint.aspectRatio === '9:16'
      ? { width: 540, height: 960 }
      : { width: 960, height: 540 };

  // Smooth continuous SVG fallback ONLY for custom non-Remotion topics when Interactive Stage is mounted
  useEffect(() => {
    if (step !== 'preview' || previewMode !== 'interactive' || isRemotionFlagship) return;
    dirtyRef.current = true;
    let rafId = 0;
    let lastTs = performance.now();
    let lastDrawTs = 0;
    let uiAccum = 0;

    const renderNow = (t: number) => {
      const bp = blueprintRef.current;
      const dims =
        bp.aspectRatio === '9:16'
          ? { width: 540, height: 960 }
          : { width: 960, height: 540 };
      const { svg, camera } = buildFilmFrameSvg(bp, t, dims.width, dims.height);
      if (stageHostRef.current) {
        stageHostRef.current.innerHTML = svg;
      }
      if (camera.activeSceneIndex !== lastBeatIdxRef.current) {
        lastBeatIdxRef.current = camera.activeSceneIndex;
        setActiveBeatIdx(camera.activeSceneIndex);
        if (isPlayingRef.current) {
          playLuxurySfx(camera.activeScene.sfxCue, sfxMutedRef.current);
        }
      }
    };

    renderNow(playheadRef.current);

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (document.hidden) return;
      if (now - lastDrawTs < 32 && !dirtyRef.current) return;

      const dt = Math.min(0.06, (now - lastTs) / 1000);
      lastTs = now;

      if (!isPlayingRef.current && !dirtyRef.current) return;
      lastDrawTs = now;
      dirtyRef.current = false;

      const bp = blueprintRef.current;
      if (isPlayingRef.current) {
        playheadRef.current += dt;
        if (playheadRef.current >= bp.totalPreviewSec) {
          playheadRef.current = 0;
        }
      }

      renderNow(playheadRef.current);

      uiAccum += dt;
      if (uiAccum >= 0.14) {
        uiAccum = 0;
        setDisplayTime(playheadRef.current);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [step, previewMode, isRemotionFlagship]);

  const handleFormatChange = (format: VideoFormatId) => {
    const aspectRatio = format === 'reel-1m' ? '9:16' : '16:9';
    const targetMinutes =
      format === 'deepdive-30m'
        ? 30
        : format === 'youtube-10m'
          ? 10
          : format === 'youtube-2m'
            ? 2
            : 1;
    onUpdateBlueprint({ ...blueprint, format, aspectRatio, targetMinutes });
  };

  const handlePaletteChange = (paletteMode: PaletteMode) => {
    onUpdateBlueprint({ ...blueprint, paletteMode });
  };

  const handleDraftTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = topicInput.trim();
    if (!cleaned) {
      setDraftError('Describe your video topic first so the Director can draft the script.');
      return;
    }

    setIsDrafting(true);
    setDraftError(null);
    try {
      const res = await fetch('/api/draft-treatment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: cleaned,
          format: blueprint.format,
          paletteMode: blueprint.paletteMode,
          subtitlesEnabled: blueprint.subtitlesEnabled,
          emotionCadence: config.emotionCadence,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not draft treatment.');
      }

      const { scenes, totalDurationSec } = normalizeBlueprintTimeline(data.scenes);
      onUpdateBlueprint({
        ...blueprint,
        id: `bp-${Date.now()}`,
        title: data.title || cleaned,
        topic: cleaned,
        hook: data.hook || '',
        format: data.format || blueprint.format,
        aspectRatio: data.aspectRatio || blueprint.aspectRatio,
        targetMinutes: data.targetMinutes || blueprint.targetMinutes,
        paletteMode: data.paletteMode || blueprint.paletteMode,
        formula: data.formula || blueprint.formula,
        totalPreviewSec: totalDurationSec,
        revisionCount: 0,
        approved: false,
        scenes,
      });
      playheadRef.current = 0;
      setDisplayTime(0);
      setActiveBeatIdx(0);
      onStepChange('review');
      onNotify('Master Script & Real-World Scenario Direction ready for your review');
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : 'Unexpected drafting error.');
    } finally {
      setIsDrafting(false);
    }
  };

  const handleReviseTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = critiqueInput.trim();
    if (!cleaned) {
      setReviseError('Write what you want changed in the script or visuals before revising.');
      return;
    }

    setIsRevising(true);
    setReviseError(null);
    try {
      const res = await fetch('/api/revise-treatment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentBlueprint: blueprint,
          feedback: cleaned,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not revise treatment.');
      }

      const { scenes, totalDurationSec } = normalizeBlueprintTimeline(data.scenes);
      onUpdateBlueprint({
        ...blueprint,
        title: data.title || blueprint.title,
        hook: data.hook || blueprint.hook,
        paletteMode: data.paletteMode || blueprint.paletteMode,
        formula: data.formula || blueprint.formula,
        totalPreviewSec: totalDurationSec,
        revisionCount: blueprint.revisionCount + 1,
        approved: false,
        scenes,
      });
      setCritiqueInput('');
      onNotify(`Applied revision #${blueprint.revisionCount + 1} to script & real-world scenes`);
    } catch (err) {
      setReviseError(err instanceof Error ? err.message : 'Unexpected revision error.');
    } finally {
      setIsRevising(false);
    }
  };

  const handleInlineNarrationEdit = (beatIndex: number, nextNarration: string) => {
    const updated = blueprint.scenes.map((s, idx) =>
      idx === beatIndex ? { ...s, narration: nextNarration } : s
    );
    const { scenes, totalDurationSec } = normalizeBlueprintTimeline(updated);
    onUpdateBlueprint({ ...blueprint, scenes, totalPreviewSec: totalDurationSec, approved: false });
  };

  const handleInlinePolarityToggle = (beatIndex: number, polarity: 'light' | 'dark') => {
    const updated = blueprint.scenes.map((s, idx) =>
      idx === beatIndex ? { ...s, palettePolarity: polarity } : s
    );
    onUpdateBlueprint({ ...blueprint, scenes: updated });
  };

  const handleApproveTreatment = () => {
    onUpdateBlueprint({ ...blueprint, approved: true });
    playheadRef.current = 0;
    setDisplayTime(0);
    setActiveBeatIdx(0);
    setIsPlaying(true);
    onStepChange('preview');
    onNotify('Direction approved — opening 60fps screening room');
  };

  const handleSeek = (nextSec: number) => {
    playheadRef.current = Math.max(0, Math.min(blueprint.totalPreviewSec, nextSec));
    dirtyRef.current = true;
    setDisplayTime(playheadRef.current);
  };

  const handleCopyCommand = async (id: string, cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(id);
      onNotify('Copied Antigravity command');
      window.setTimeout(() => setCopiedCmd((prev) => (prev === id ? null : prev)), 1800);
    } catch {
      onNotify('Clipboard unavailable in this browser');
    }
  };

  const handleRenderTestMp4 = async () => {
    if (renderStatus === 'rendering') return;
    if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);

    setRenderStatus('rendering');
    setRenderError(null);
    setRenderProgress(3);
    setRenderStage('Starting voiceover & 60fps HD render...');
    setPreviewMode('mp4');

    const selectedVoice =
      KOKORO_VOICES.find((v) => v.id === config.primaryVoiceId) ?? KOKORO_VOICES[1];

    try {
      const startRes = await fetch('/api/render-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint,
          voiceName: selectedVoice.geminiPreviewVoice,
          voiceStyle: selectedVoice.geminiStylePrompt,
          fps: 60,
          quality: '720p',
          includeVoiceover: true,
        }),
      });
      const startData = await startRes.json();
      if (!startRes.ok || !startData.jobId) {
        throw new Error(startData.error || 'Could not start MP4 render.');
      }

      const jobId: string = startData.jobId;
      const poll = async () => {
        try {
          const pollRes = await fetch(`/api/render-jobs/${encodeURIComponent(jobId)}`);
          const job = await pollRes.json();
          if (!pollRes.ok) {
            throw new Error(job.error || 'Lost connection to render job.');
          }

          if (job.status === 'done' && job.meta) {
            setRenderStatus('idle');
            setRenderProgress(100);
            setRenderStage('MP4 ready');
            setRenderedVideo(job.meta as RenderedVideoMeta);
            setVideoCacheBust(Date.now());
            if (job.syncedBlueprint) {
              onUpdateBlueprint(job.syncedBlueprint as VideoBlueprint);
            }
            onNotify('60fps MP4 rendered with synchronized voiceover — press Play to watch');
            return;
          }

          if (job.status === 'error') {
            throw new Error(job.error || 'MP4 rendering failed.');
          }

          setRenderProgress(typeof job.progress === 'number' ? job.progress : 15);
          setRenderStage(String(job.stage || 'Rendering frames...'));
          pollTimerRef.current = window.setTimeout(poll, 1400);
        } catch (err) {
          setRenderStatus('error');
          setRenderError(err instanceof Error ? err.message : 'Render polling failed.');
        }
      };

      pollTimerRef.current = window.setTimeout(poll, 1000);
    } catch (err) {
      setRenderStatus('error');
      setRenderError(err instanceof Error ? err.message : 'Unexpected render error.');
    }
  };

  // =========================================================================
  // STEP 1 · DIRECTOR'S BRIEF
  // =========================================================================
  if (step === 'brief') {
    const colorWorldPreview = Object.values(INFOGRAPHICS_WORLD_PALETTES).slice(0, 6);
    return (
      <section aria-label="Video Brief" className="max-w-4xl mx-auto py-4 sm:py-6 space-y-8">
        <div>
          <p className="text-xs font-medium text-[#D97706] dark:text-[#F5B82E] mb-2">
            Step 01 of 03 · Infographics Show Ultra Director Brief
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-tight max-w-2xl">
            Direct 60fps real-world animated scenarios on any topic.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#526075] dark:text-[#8B9BB4] max-w-2xl leading-relaxed">
            Trained 100% on elevated Infographics Show flat-vector environments (zero box templates,
            zero human frames) with 6 After Effects smooth transitions and a 12-domain creative
            imagination playbook.
          </p>
        </div>

        <form
          onSubmit={handleDraftTreatment}
          className="rounded-xl bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] p-6 sm:p-8 space-y-6"
        >
          <div>
            <label
              htmlFor="video-topic-input"
              className="block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-2"
            >
              What real-world story or system should this film illustrate?
            </label>
            <textarea
              id="video-topic-input"
              rows={3}
              value={topicInput}
              onChange={(e) => {
                setTopicInput(e.target.value);
                if (draftError) setDraftError(null);
              }}
              placeholder="Example: How one blocked canal froze $9.6 billion of global shipping in six days..."
              className="w-full rounded-lg border border-[#DCE3EE] dark:border-[#222E42] bg-[#F7F9FC] dark:bg-[#0B0F17] px-4 py-3 text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#7B8AA3] focus:outline-none focus:border-[#D97706] dark:focus:border-[#F5B82E] resize-none"
            />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="text-[#526075] dark:text-[#8B9BB4]">Try any domain:</span>
              {TOPIC_STARTERS.map((starter) => (
                <button
                  key={starter.category}
                  type="button"
                  onClick={() => {
                    setTopicInput(starter.prompt);
                    setDraftError(null);
                  }}
                  className="text-[#D97706] dark:text-[#F5B82E] hover:underline whitespace-nowrap cursor-pointer"
                >
                  {starter.category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-[#DCE3EE] dark:border-[#1E293B]">
            <div>
              <span className="block text-xs font-medium text-[#526075] dark:text-[#8B9BB4] mb-2">
                Length & Aspect
              </span>
              <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-[#EEF2F7] dark:bg-[#0B0F17]">
                {(
                  [
                    { id: 'reel-1m', label: '1m' },
                    { id: 'youtube-2m', label: '2m' },
                    { id: 'youtube-10m', label: '10m' },
                    { id: 'deepdive-30m', label: '30m' },
                  ] as const
                ).map((item) => {
                  const active = blueprint.format === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleFormatChange(item.id)}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                          : 'text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-[#526075] dark:text-[#8B9BB4] font-mono-tabular">
                {blueprint.aspectRatio === '9:16'
                  ? '9:16 Vertical Reel · 60fps'
                  : `16:9 Landscape (${blueprint.targetMinutes}m) · 60fps`}
              </p>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#526075] dark:text-[#8B9BB4] mb-2">
                Color World Polarity
              </span>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#EEF2F7] dark:bg-[#0B0F17]">
                {(
                  [
                    { id: 'light', label: 'Day' },
                    { id: 'dark', label: 'Dusk' },
                    { id: 'mix', label: 'Mix' },
                  ] as const
                ).map((item) => {
                  const active = blueprint.paletteMode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handlePaletteChange(item.id)}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                          : 'text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-[#526075] dark:text-[#8B9BB4]">
                {blueprint.paletteMode === 'light'
                  ? 'Sunlit Cobalt & Warm Studio'
                  : blueprint.paletteMode === 'dark'
                    ? 'Twilight & Coastal Dusk Worlds'
                    : 'Dynamic 12-World Contrast'}
              </p>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#526075] dark:text-[#8B9BB4] mb-2">
                Kinetic Subtitles
              </span>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#EEF2F7] dark:bg-[#0B0F17]">
                <button
                  type="button"
                  onClick={() => onUpdateBlueprint({ ...blueprint, subtitlesEnabled: true })}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    blueprint.subtitlesEnabled
                      ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                      : 'text-[#526075] dark:text-[#8B9BB4]'
                  }`}
                >
                  On
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBlueprint({ ...blueprint, subtitlesEnabled: false })}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    !blueprint.subtitlesEnabled
                      ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                      : 'text-[#526075] dark:text-[#8B9BB4]'
                  }`}
                >
                  Off
                </button>
              </div>
              <p className="mt-1.5 text-xs text-[#526075] dark:text-[#8B9BB4]">
                {blueprint.subtitlesEnabled
                  ? 'Gold active-word spring captions'
                  : 'Borderless full-bleed visuals'}
              </p>
            </div>
          </div>

          {draftError && (
            <p
              role="alert"
              className="text-xs text-[#DC2626] dark:text-[#F43F5E] bg-[#DC2626]/8 dark:bg-[#F43F5E]/12 rounded-lg px-3.5 py-2.5"
            >
              {draftError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={isDrafting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isDrafting
                ? 'Directing Real-World Scenarios...'
                : 'Draft Master Script & Direction'}
            </button>

            <button
              type="button"
              onClick={() => onStepChange('review')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors whitespace-nowrap cursor-pointer"
            >
              Inspect loaded flagship film ({blueprint.scenes.length} beats)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Quiet Color World Swatch Ribbon */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#526075] dark:text-[#8B9BB4]">
            <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">
              12 Trained Real-World Color Worlds
            </span>
            <span>Zero box templates · Zero human frames · 60fps AE transitions</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {colorWorldPreview.map((world) => (
              <div
                key={world.id}
                className="rounded-lg overflow-hidden border border-[#DCE3EE] dark:border-[#1E293B] bg-white dark:bg-[#111722]"
              >
                <div
                  className="h-10 w-full"
                  style={{
                    background: `linear-gradient(180deg, ${world.skyTop} 0%, ${world.skyBottom} 68%, ${world.ground} 100%)`,
                  }}
                />
                <div className="px-2.5 py-2">
                  <p className="text-[11px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                    {world.name}
                  </p>
                  <p className="text-[10px] text-[#526075] dark:text-[#8B9BB4] truncate">
                    {world.domain}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // STEP 2 · INFOGRAPHICS SHOW ULTRA DIRECTION GATE
  // =========================================================================
  if (step === 'review') {
    const styleAudit = auditBlueprintForInfographicsStyle(blueprint);
    return (
      <section aria-label="Master Script and Visual Direction Review" className="space-y-8">
        {/* Top Editorial Summary Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[#DCE3EE] dark:border-[#1E293B]">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#526075] dark:text-[#8B9BB4] mb-2">
              <button
                type="button"
                onClick={() => onStepChange('brief')}
                className="inline-flex items-center gap-1 hover:text-[#0F172A] dark:hover:text-[#F8FAFC] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Edit Brief
              </button>
              <span aria-hidden="true">·</span>
              <span className="text-[#D97706] dark:text-[#F5B82E] font-medium">
                Step 02 of 03 · Infographics Show Ultra Direction Gate
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                {blueprint.scenes.length} real-world beats · {blueprint.totalPreviewSec.toFixed(1)}s
              </span>
              {blueprint.revisionCount > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Revision {blueprint.revisionCount}</span>
                </>
              )}
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
              {blueprint.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleApproveTreatment}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Approve & Open Screening Room
          </button>
        </div>

        {/* 6-Dimension Infographics Show Ultra Quality Gate Strip (Clean Unboxed Tabular Figures) */}
        <div
          data-testid="ultra-quality-audit-strip"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pb-6 border-b border-[#DCE3EE] dark:border-[#1E293B]"
        >
          <div>
            <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">Ultra Gate Score</p>
            <p
              className={`font-mono-tabular text-xl font-bold mt-0.5 ${
                styleAudit.passed ||
                (styleAudit.score >= 90 &&
                  styleAudit.boxTemplateViolations.length === 0 &&
                  styleAudit.humanFrameViolations.length === 0)
                  ? 'text-[#059669] dark:text-[#2AD08E]'
                  : styleAudit.score >= 75
                    ? 'text-[#D97706] dark:text-[#F5B82E]'
                    : 'text-[#DC2626] dark:text-[#F43F5E]'
              }`}
            >
              {styleAudit.score}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">Box Templates</p>
            <p className="font-mono-tabular text-xl font-bold mt-0.5 text-[#0F172A] dark:text-[#F8FAFC]">
              {styleAudit.boxTemplateViolations.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">Human Frames</p>
            <p className="font-mono-tabular text-xl font-bold mt-0.5 text-[#0F172A] dark:text-[#F8FAFC]">
              {styleAudit.humanFrameViolations.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">Real-World Sets</p>
            <p className="font-mono-tabular text-xl font-bold mt-0.5 text-[#0F172A] dark:text-[#F8FAFC]">
              {styleAudit.environmentCoveragePct}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">2.5D Parallax Depth</p>
            <p className="font-mono-tabular text-xl font-bold mt-0.5 text-[#0F172A] dark:text-[#F8FAFC]">
              {styleAudit.parallaxDepthPct}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">Living Micro-Motion</p>
            <p className="font-mono-tabular text-xl font-bold mt-0.5 text-[#0F172A] dark:text-[#F8FAFC]">
              {styleAudit.microMotionPct}%
            </p>
          </div>
        </div>

        {/* Main 2-Column Spread: Shot-by-Shot Script + Sticky Director Critique Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Left: Shot-by-Shot Script & Real-World Visual Direction */}
          <div className="space-y-5">
            {blueprint.scenes.map((scene, idx) => {
              const thumbSvg = buildBeatThumbnailSvg(scene, blueprint.paletteMode);
              return (
                <article
                  key={scene.id}
                  className="rounded-xl bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#DCE3EE] dark:border-[#1E293B]">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#526075] dark:text-[#8B9BB4]">
                      <span className="font-mono-tabular font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                        Beat {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{scene.chapter}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{scene.durationSec.toFixed(1)}s</span>
                      <span aria-hidden="true">·</span>
                      <span>{scene.layers.length} vector layers</span>
                    </div>

                    <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#EEF2F7] dark:bg-[#0B0F17] text-xs">
                      <button
                        type="button"
                        onClick={() => handleInlinePolarityToggle(idx, 'light')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${
                          scene.palettePolarity === 'light'
                            ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                            : 'text-[#526075] dark:text-[#8B9BB4]'
                        }`}
                      >
                        Day
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInlinePolarityToggle(idx, 'dark')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${
                          scene.palettePolarity === 'dark'
                            ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                            : 'text-[#526075] dark:text-[#8B9BB4]'
                        }`}
                      >
                        Dusk
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[152px_1fr] gap-5 items-start">
                    <div
                      className="w-full sm:w-[152px] aspect-square rounded-lg overflow-hidden border border-[#DCE3EE] dark:border-[#1E293B] shrink-0"
                      dangerouslySetInnerHTML={{ __html: thumbSvg }}
                    />

                    <div className="space-y-4 min-w-0">
                      <div>
                        <h2 className="font-editorial text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                          {scene.headline}
                        </h2>
                        <label
                          htmlFor={`narration-${scene.id}`}
                          className="block text-[11px] font-medium text-[#526075] dark:text-[#8B9BB4] mt-2 mb-1"
                        >
                          Spoken Script (editable)
                        </label>
                        <textarea
                          id={`narration-${scene.id}`}
                          rows={2}
                          value={scene.narration}
                          onChange={(e) => handleInlineNarrationEdit(idx, e.target.value)}
                          className="w-full rounded-lg border border-[#DCE3EE] dark:border-[#222E42] bg-[#F7F9FC] dark:bg-[#0B0F17] px-3 py-2 text-sm text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed focus:outline-none focus:border-[#D97706] dark:focus:border-[#F5B82E] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                            Real-World Scenario (Zero Boxes · Zero Humans)
                          </p>
                          <p className="text-[#526075] dark:text-[#8B9BB4] leading-relaxed">
                            {scene.visualConcept}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#D97706] dark:text-[#F5B82E] mb-1">
                            Pro Smooth Transition · {scene.continuity.type}
                          </p>
                          <p className="text-[#526075] dark:text-[#8B9BB4] leading-relaxed">
                            {scene.continuity.carryDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right Sticky Director Feedback & Approval Rail */}
          <aside className="lg:sticky lg:top-24 rounded-xl bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="font-editorial text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Direct Revisions Before Render
              </h2>
              <p className="mt-1 text-xs text-[#526075] dark:text-[#8B9BB4] leading-relaxed">
                Want a sharper metaphor, different real-world location, faster pacing, or bolder
                transition? Give plain-English notes to the Director.
              </p>
            </div>

            <form onSubmit={handleReviseTreatment} className="space-y-3">
              <label htmlFor="director-critique" className="sr-only">
                Director critique instructions
              </label>
              <textarea
                id="director-critique"
                rows={4}
                value={critiqueInput}
                onChange={(e) => {
                  setCritiqueInput(e.target.value);
                  if (reviseError) setReviseError(null);
                }}
                placeholder="Example: Replace Beat 2 with a stormy shipping harbor, make Beat 1 punchier, and transition with an inked iris wipe..."
                className="w-full rounded-lg border border-[#DCE3EE] dark:border-[#222E42] bg-[#F7F9FC] dark:bg-[#0B0F17] px-3.5 py-2.5 text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#7B8AA3] focus:outline-none focus:border-[#D97706] dark:focus:border-[#F5B82E] resize-none"
              />

              <div className="space-y-1.5">
                {QUICK_CRITIQUES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setCritiqueInput(q);
                      setReviseError(null);
                    }}
                    className="block w-full text-left text-[11px] text-[#526075] dark:text-[#8B9BB4] hover:text-[#D97706] dark:hover:text-[#F5B82E] transition-colors truncate cursor-pointer"
                  >
                    + {q}
                  </button>
                ))}
              </div>

              {reviseError && (
                <p
                  role="alert"
                  className="text-xs text-[#DC2626] dark:text-[#F43F5E] bg-[#DC2626]/8 dark:bg-[#F43F5E]/12 rounded-lg px-3 py-2"
                >
                  {reviseError}
                </p>
              )}

              <button
                type="submit"
                disabled={isRevising}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-[#0F172A] dark:border-[#F5B82E] text-[#0F172A] dark:text-[#F5B82E] hover:bg-[#0F172A]/5 dark:hover:bg-[#F5B82E]/10 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isRevising ? 'Revising Real-World Scenes...' : 'Revise Script & Direction'}
              </button>
            </form>

            <div className="pt-4 border-t border-[#DCE3EE] dark:border-[#1E293B] space-y-3">
              <button
                type="button"
                onClick={handleApproveTreatment}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Approve & Open Screening Room
              </button>
              <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4] leading-relaxed">
                Antigravity enforces this exact 18-Point Pro-Editor Quality Gate before running
                local Kokoro-82M voiceover and 60fps Remotion rendering.
              </p>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  // =========================================================================
  // STEP 3 · 60FPS CINEMA SCREENING ROOM & ANTIGRAVITY HANDOFF
  // =========================================================================
  const activeScene = blueprint.scenes[activeBeatIdx] ?? blueprint.scenes[0];
  const localCommands = [
    {
      id: 'audit',
      step: '1. Enforce 18-Point Infographics Ultra Gate',
      cmd: 'node scripts/audit_infographics_quality.mjs --blueprint templates/active_blueprint.json',
    },
    {
      id: 'kokoro',
      step: '2. Local Kokoro-82M Audio + WhisperX Sync',
      cmd: 'python scripts/generate_audio_kokoro.py --blueprint templates/active_blueprint.json --out project/',
    },
    {
      id: 'render',
      step: '3. 60fps Remotion HD Render + 5-Layer Pro SFX',
      cmd: 'node scripts/render_remotion_60fps.mjs --composition MainFilm --audio project/master_narration.wav --timeline project/timeline.synced.json --out project/final_master.mp4',
    },
  ];

  return (
    <section aria-label="Cinema Screening Room" className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#526075] dark:text-[#8B9BB4] mb-1">
            <button
              type="button"
              onClick={() => onStepChange('review')}
              className="inline-flex items-center gap-1 hover:text-[#0F172A] dark:hover:text-[#F8FAFC] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Direction Gate
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-[#D97706] dark:text-[#F5B82E] font-medium">
              Step 03 of 03 · 60fps Cinema Screening Room
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            {blueprint.title}
          </h1>
        </div>

        {/* Clean Single-Row Canvas Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#EEF2F7] dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B]">
            {(['9:16', '16:9'] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() =>
                  onUpdateBlueprint({
                    ...blueprint,
                    aspectRatio: ratio,
                    format:
                      ratio === '9:16'
                        ? 'reel-1m'
                        : blueprint.format === 'reel-1m'
                          ? 'youtube-2m'
                          : blueprint.format,
                  })
                }
                className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap ${
                  blueprint.aspectRatio === ratio
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                    : 'text-[#526075] dark:text-[#8B9BB4]'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#EEF2F7] dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B]">
            {(['light', 'dark', 'mix'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handlePaletteChange(mode)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize cursor-pointer whitespace-nowrap ${
                  blueprint.paletteMode === mode
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                    : 'text-[#526075] dark:text-[#8B9BB4]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              onUpdateBlueprint({ ...blueprint, subtitlesEnabled: !blueprint.subtitlesEnabled })
            }
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DCE3EE] dark:border-[#1E293B] bg-white dark:bg-[#111722] text-[#0F172A] dark:text-[#F8FAFC] hover:border-[#D97706] dark:hover:border-[#F5B82E] transition-colors cursor-pointer whitespace-nowrap"
          >
            Captions: {blueprint.subtitlesEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Main Screening Split: Left 16:9 Cinema Stage + Right Antigravity Production Handoff */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="rounded-xl bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] p-4 sm:p-6 space-y-5">
          {/* Playback Mode Switch + Download / Render Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#EEF2F7] dark:bg-[#0B0F17]">
              <button
                type="button"
                onClick={() => setPreviewMode('mp4')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  previewMode === 'mp4'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                    : 'text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                }`}
              >
                Rendered 60fps MP4
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('interactive')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  previewMode === 'interactive'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                    : 'text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                }`}
              >
                {isRemotionFlagship ? 'Live 60fps Remotion Stage' : 'Interactive Stage'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {renderedVideo && renderStatus !== 'rendering' && (
                <a
                  href={
                    videoCacheBust
                      ? `${renderedVideo.videoUrl}?v=${videoCacheBust}`
                      : renderedVideo.videoUrl
                  }
                  download={`${blueprint.id || 'sovereign-motion-film'}.mp4`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DCE3EE] dark:border-[#222E42] text-[#0F172A] dark:text-[#F8FAFC] hover:border-[#D97706] dark:hover:border-[#F5B82E] transition-colors whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download MP4
                </a>
              )}
              <button
                type="button"
                onClick={handleRenderTestMp4}
                disabled={renderStatus === 'rendering'}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap cursor-pointer"
              >
                {renderStatus === 'rendering' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Rendering ({renderProgress}%)
                  </>
                ) : (
                  <>
                    <Film className="w-3.5 h-3.5" />
                    {renderedVideo ? 'Re-render MP4' : 'Render Test MP4'}
                  </>
                )}
              </button>
            </div>
          </div>

          {previewMode === 'mp4' ? (
            <div className="space-y-4">
              {renderStatus === 'rendering' && (
                <div className="rounded-lg bg-[#F7F9FC] dark:bg-[#0B0F17] border border-[#DCE3EE] dark:border-[#1E293B] p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                      {renderStage || 'Encoding 60fps Infographics Show Ultra HD MP4...'}
                    </span>
                    <span className="font-mono-tabular text-[#D97706] dark:text-[#F5B82E] font-semibold">
                      {renderProgress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#DCE3EE] dark:bg-[#1E293B] overflow-hidden">
                    <div
                      className="h-full bg-[#F5B82E] transition-all duration-300"
                      style={{ width: `${Math.max(4, renderProgress)}%` }}
                    />
                  </div>
                </div>
              )}

              {renderError && (
                <p
                  role="alert"
                  className="text-xs text-[#DC2626] dark:text-[#F43F5E] bg-[#DC2626]/8 dark:bg-[#F43F5E]/12 rounded-lg px-3.5 py-2.5"
                >
                  {renderError}
                </p>
              )}

              {renderedVideo ? (
                <>
                  <div className="flex justify-center bg-[#060910] rounded-lg overflow-hidden border border-[#1E293B]">
                    <video
                      key={videoCacheBust || renderedVideo.renderedAt}
                      data-testid="rendered-mp4-player"
                      src={
                        videoCacheBust
                          ? `${renderedVideo.videoUrl}?v=${videoCacheBust}`
                          : renderedVideo.videoUrl
                      }
                      controls
                      playsInline
                      preload="metadata"
                      className={
                        renderedVideo.height > renderedVideo.width
                          ? 'w-full max-w-[360px] aspect-[9/16] bg-black'
                          : 'w-full aspect-video bg-black'
                      }
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-[#526075] dark:text-[#8B9BB4]">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-tabular">
                      <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">
                        {renderedVideo.width}×{renderedVideo.height} HD · {renderedVideo.fps}fps MP4
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatTimecode(renderedVideo.durationSec)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{(renderedVideo.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {renderedVideo.hasVoiceover
                          ? `Voiceover (${renderedVideo.voiceName})`
                          : 'Silent Master'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#059669] dark:text-[#2AD08E] font-medium">
                      {renderedVideo.fps >= 60
                        ? 'Infographics Show Ultra · 60fps · 6 Pro Smooth Transitions'
                        : 'HD H.264/AAC'}
                    </span>
                  </div>
                </>
              ) : (
                renderStatus !== 'rendering' && (
                  <div className="rounded-lg bg-[#F7F9FC] dark:bg-[#0B0F17] border border-[#DCE3EE] dark:border-[#1E293B] p-8 text-center space-y-3">
                    <p className="font-editorial text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      Render a playable 60fps HD MP4
                    </p>
                    <p className="text-xs text-[#526075] dark:text-[#8B9BB4] max-w-md mx-auto leading-relaxed">
                      Click <strong>Render Test MP4</strong> above or switch to the{' '}
                      <strong>Live 60fps Remotion Stage</strong> to inspect every smooth transition
                      frame by frame.
                    </p>
                  </div>
                )
              )}
            </div>
          ) : isRemotionFlagship ? (
            <div className="space-y-4">
              <div
                data-testid="remotion-60fps-stage"
                className="flex justify-center bg-[#060910] rounded-lg overflow-hidden border border-[#1E293B]"
              >
                <Player
                  ref={remotionPlayerRef}
                  component={BangladeshXFilm}
                  inputProps={{
                    paletteMode: blueprint.paletteMode,
                    subtitlesEnabled: blueprint.subtitlesEnabled,
                  }}
                  durationInFrames={TOTAL_FILM_FRAMES}
                  fps={FILM_FPS}
                  compositionWidth={1280}
                  compositionHeight={720}
                  controls
                  autoPlay={false}
                  loop
                  style={{ width: '100%', aspectRatio: '16 / 9' }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#526075] dark:text-[#8B9BB4]">
                <span className="font-mono-tabular text-[#0F172A] dark:text-[#F8FAFC] font-semibold">
                  Remotion 60fps Engine · 1280×720 · {TOTAL_FILM_FRAMES} frames · 6 AE Transitions
                </span>
                <span className="text-[11px]">
                  Click any beat below to jump directly to that real-world set
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
                {BANGLADESH_X_TIMELINE.slots.map((slot, idx) => (
                  <button
                    key={slot.beat.id}
                    type="button"
                    onClick={() => {
                      setActiveBeatIdx(idx);
                      remotionPlayerRef.current?.seekTo(slot.globalStartFrame);
                      remotionPlayerRef.current?.play();
                    }}
                    className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                      activeBeatIdx === idx
                        ? 'border-[#D97706] dark:border-[#F5B82E] bg-[#F7F9FC] dark:bg-[#182132] text-[#0F172A] dark:text-[#F8FAFC]'
                        : 'border-[#DCE3EE] dark:border-[#1E293B] text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                    }`}
                  >
                    <div className="font-mono-tabular text-[10px] text-[#D97706] dark:text-[#F5B82E]">
                      {String(idx + 1).padStart(2, '0')} · {formatTimecode(slot.beat.startSec)} ·{' '}
                      {TRANSITION_LABELS[idx] ?? 'Smooth Cut'}
                    </div>
                    <div className="font-medium truncate mt-0.5">{slot.beat.headline}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center bg-[#EEF2F7] dark:bg-[#060910] rounded-lg p-4 sm:p-6 overflow-hidden">
                <div
                  ref={stageHostRef}
                  data-testid="continuous-film-stage"
                  data-active-beat={activeBeatIdx}
                  style={{
                    aspectRatio: `${frameDims.width} / ${frameDims.height}`,
                    width: blueprint.aspectRatio === '9:16' ? 'min(100%, 340px)' : '100%',
                  }}
                  className="rounded-lg overflow-hidden shadow-lg border border-black/10 dark:border-white/10 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] shrink-0 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSeek(0)}
                    aria-label="Restart preview"
                    className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#DCE3EE] dark:border-[#222E42] text-[#0F172A] dark:text-[#F8FAFC] shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <input
                    type="range"
                    aria-label="Film timeline scrubber"
                    min={0}
                    max={blueprint.totalPreviewSec}
                    step={0.05}
                    value={Math.min(displayTime, blueprint.totalPreviewSec)}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="flex-1 accent-[#F5B82E] cursor-pointer"
                  />

                  <span className="font-mono-tabular text-xs text-[#526075] dark:text-[#8B9BB4] shrink-0">
                    {formatTimecode(displayTime)} / {formatTimecode(blueprint.totalPreviewSec)}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSfxMuted((m) => !m)}
                    aria-label={sfxMuted ? 'Unmute transition SFX' : 'Mute transition SFX'}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#DCE3EE] dark:border-[#222E42] text-[#0F172A] dark:text-[#F8FAFC] shrink-0 cursor-pointer"
                  >
                    {sfxMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                  {blueprint.scenes.map((scene, idx) => {
                    const active = idx === activeBeatIdx;
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => handleSeek(scene.startSec + 0.05)}
                        className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                          active
                            ? 'border-[#D97706] dark:border-[#F5B82E] bg-[#F7F9FC] dark:bg-[#182132] text-[#0F172A] dark:text-[#F8FAFC]'
                            : 'border-[#DCE3EE] dark:border-[#1E293B] text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                        }`}
                      >
                        <div className="font-mono-tabular text-[11px] text-[#D97706] dark:text-[#F5B82E]">
                          Beat {String(idx + 1).padStart(2, '0')} · {scene.continuity.type}
                        </div>
                        <div className="font-medium truncate mt-0.5">{scene.headline}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE3EE] dark:border-[#1E293B] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                    Active Narration (Beat {String(activeBeatIdx + 1).padStart(2, '0')})
                  </p>
                  <p className="text-[#526075] dark:text-[#8B9BB4] leading-relaxed">
                    “{activeScene.narration}”
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#D97706] dark:text-[#F5B82E] mb-1">
                    Smooth Transition Handoff
                  </p>
                  <p className="text-[#526075] dark:text-[#8B9BB4] leading-relaxed">
                    {activeScene.continuity.carryDescription}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Clean Local Antigravity Production Handoff */}
        <aside className="rounded-xl bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] p-5 sm:p-6 space-y-5">
          <div>
            <p className="text-xs font-medium text-[#D97706] dark:text-[#F5B82E] mb-1">
              Antigravity IDE Ultra v5.0 · 29 Self-Contained Files
            </p>
            <h2 className="font-editorial text-xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
              Consistent 60fps Quality Every Time
            </h2>
            <p className="mt-1.5 text-xs text-[#526075] dark:text-[#8B9BB4] leading-relaxed">
              Ships the 12-Domain Playbook, 8 Shot Archetypes, cel-shaded{' '}
              <code>proPrimitives.tsx</code>, 18-Point Quality Gate, 6 AE transitions, and 5-layer
              SFX + Kokoro-82M render pipeline in one zip.
            </p>
          </div>

          <button
            type="button"
            onClick={onExportZip}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Antigravity Skill (.zip)
          </button>

          <div className="space-y-3 pt-3 border-t border-[#DCE3EE] dark:border-[#1E293B]">
            {localCommands.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{item.step}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(item.id, item.cmd)}
                    aria-label={`Copy ${item.step}`}
                    className="inline-flex items-center gap-1 text-[11px] text-[#D97706] dark:text-[#F5B82E] hover:underline cursor-pointer"
                  >
                    {copiedCmd === item.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="rounded-lg bg-[#F7F9FC] dark:bg-[#0B0F17] border border-[#DCE3EE] dark:border-[#1E293B] px-3 py-2 text-[11px] font-mono-tabular text-[#0F172A] dark:text-[#CBD5E1] overflow-x-auto">
                  {item.cmd}
                </pre>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#DCE3EE] dark:border-[#1E293B] text-xs text-[#526075] dark:text-[#8B9BB4] space-y-1">
            <p className="font-mono-tabular">
              Kokoro Blend: {Math.round(config.voiceBlendRatio * 100)}% {config.primaryVoiceId} +{' '}
              {Math.round((1 - config.voiceBlendRatio) * 100)}% {config.secondaryVoiceId}
            </p>
            <p className="font-mono-tabular">
              Model: {config.kokoroQuantization.toUpperCase()} · WhisperX: {config.whisperModel} ·
              60fps H.264
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
