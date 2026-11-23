import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Layers, Scissors, Sparkles, Subtitles } from 'lucide-react';
import { renderViralClipSimulatorFrame } from '../engine/illustratorRenderer';
import {
  alignSceneWords,
  buildAssSubtitleFile,
  detectHeatmapPeaks,
  formatTimecode,
} from '../engine/motionMath';
import type {
  ClipFramingMode,
  SkillConfig,
  ViralClipProject,
  ViralMoment,
} from '../types/engine';

interface ViralClipperViewProps {
  project: ViralClipProject;
  config: SkillConfig;
  onUpdateProject: (next: ViralClipProject) => void;
  onNotify: (msg: string) => void;
}

export function ViralClipperView({
  project,
  config,
  onUpdateProject,
  onNotify,
}: ViralClipperViewProps) {
  const [urlInput, setUrlInput] = useState(project.sourceUrl);
  const [notesInput, setNotesInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMomentId, setSelectedMomentId] = useState(project.moments[0]?.id ?? '');
  const [injectOverlay, setInjectOverlay] = useState(config.injectMotionOverlays);
  const [showAssDrawer, setShowAssDrawer] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeMoment: ViralMoment =
    project.moments.find((m) => m.id === selectedMomentId) ?? project.moments[0];

  const activeMomentRef = useRef<ViralMoment>(activeMoment);
  const injectOverlayRef = useRef<boolean>(injectOverlay);

  useEffect(() => {
    activeMomentRef.current = activeMoment;
  }, [activeMoment]);

  useEffect(() => {
    injectOverlayRef.current = injectOverlay;
  }, [injectOverlay]);

  // Animate 9:16 vertical clip simulator cleanly at 24fps (feather-light CPU usage)
  useEffect(() => {
    let rafId = 0;
    const start = performance.now();
    let lastDraw = 0;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (document.hidden || now - lastDraw < 42) return;
      lastDraw = now;
      const elapsed = (now - start) / 1000;
      const canvas = canvasRef.current;
      if (canvas && activeMomentRef.current) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderViralClipSimulatorFrame(
            ctx,
            canvas.width,
            canvas.height,
            activeMomentRef.current,
            elapsed,
            injectOverlayRef.current
          );
        }
      }
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const peaks = useMemo(
    () => detectHeatmapPeaks(project.heatmap, project.sourceDurationSec, 0.62, 6),
    [project.heatmap, project.sourceDurationSec]
  );

  const assPreview = useMemo(() => {
    if (!activeMoment) return '';
    const dur = Math.max(12, activeMoment.endSec - activeMoment.startSec);
    const words = alignSceneWords(activeMoment.transcriptExcerpt, 0, Math.min(dur, 18));
    return buildAssSubtitleFile(words, activeMoment.palettePolarity, 4);
  }, [activeMoment]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() && !notesInput.trim()) {
      setError('Paste a YouTube video URL or a transcript/topic to detect viral moments.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    try {
      const resp = await fetch('/api/analyze-viral-clips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceUrl: urlInput.trim(),
          sourceInput: notesInput.trim() || urlInput.trim(),
          framingDefault: config.clipFramingDefault,
          captionsEnabled: config.defaultSubtitles === 'luxury-reel',
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Could not analyze viral clips.');
      }
      onUpdateProject(data);
      if (data.moments?.[0]) {
        setSelectedMomentId(data.moments[0].id);
      }
      onNotify(`Detected ${data.moments.length} viral clipping windows with heatmap spikes`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Viral clip analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateActiveMoment = (patch: Partial<ViralMoment>) => {
    if (!activeMoment) return;
    onUpdateProject({
      ...project,
      moments: project.moments.map((m) => (m.id === activeMoment.id ? { ...m, ...patch } : m)),
    });
  };

  const localCliCommand = activeMoment
    ? `python scripts/viral_clipper_pipeline.py --url "${project.sourceUrl}" --framing ${activeMoment.framingMode} ${activeMoment.captionsEnabled ? '--captions' : ''}`
    : '';

  const handleCopyCommand = () => {
    navigator.clipboard?.writeText(localCliCommand).catch(() => {});
    onNotify('Copied local Antigravity viral clipper command');
  };

  // Build SVG path for the 100-point YouTube Most Replayed heatmap
  const heatmapPoints = project.heatmap
    .map((val, idx) => {
      const x = (idx / 99) * 1000;
      const y = 120 - val * 104;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="space-y-8">
      {/* YouTube Source Ingestion & Viral Scanner */}
      <section className="bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#DCE3EE] dark:border-[#1E293B]">
          <div>
            <p className="text-xs font-medium text-[#D97706] dark:text-[#F5B82E] tracking-wide">
              Mode B · Viral YouTube Clipper + Illustrator Motion Overlays
            </p>
            <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
              Scan Any YouTube Video for Viral Peaks
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono-tabular text-[#526075] dark:text-[#8B9BB4]">
            <span>yt-dlp Most Replayed Heatmap</span>
            <span aria-hidden="true">·</span>
            <span>MediaPipe EMA 9:16 Crop</span>
            <span aria-hidden="true">·</span>
            <span>FFmpeg libass Captions</span>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <label htmlFor="yt-url" className="sr-only">
                YouTube URL
              </label>
              <input
                id="yt-url"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 text-sm font-mono-tabular rounded-lg bg-[#F7F9FC] dark:bg-[#0B0F17] border border-[#DCE3EE] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>
            <div className="md:col-span-5">
              <label htmlFor="yt-notes" className="sr-only">
                Optional transcript or focus topic
              </label>
              <input
                id="yt-notes"
                type="text"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Optional: paste transcript excerpt or niche angle (e.g. wealth habits)"
                className="w-full px-4 py-3 text-sm rounded-lg bg-[#F7F9FC] dark:bg-[#0B0F17] border border-[#DCE3EE] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isAnalyzing ? 'Scanning...' : 'Scan Peaks'}
              </button>
            </div>
          </div>
          {error && (
            <p role="alert" className="text-xs font-medium text-[#B53D32] dark:text-[#E05A47]">
              {error}
            </p>
          )}
        </form>

        {/* Interactive 100-Segment Most Replayed Heatmap Radar */}
        <div className="pt-2 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">
              {project.sourceTitle}
            </span>
            <span className="font-mono-tabular text-[#526075] dark:text-[#8B9BB4]">
              {project.sourceChannel} · {Math.round(project.sourceDurationSec / 60)}m source ·{' '}
              {peaks.length} viral heatmap spikes detected
            </span>
          </div>

          <div className="relative rounded-lg border border-[#DCE3EE] dark:border-[#1E293B] bg-[#F7F9FC] dark:bg-[#0B0F17] p-4">
            <svg
              viewBox="0 0 1000 128"
              className="w-full h-32 overflow-visible"
              role="img"
              aria-label="YouTube Most Replayed Viral Heatmap"
            >
              <defs>
                <linearGradient id="heatFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A67C37" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#A67C37" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {/* Threshold guide line */}
              <line
                x1="0"
                y1="55"
                x2="1000"
                y2="55"
                stroke="currentColor"
                strokeDasharray="4 6"
                className="text-[#A67C37]/40"
              />
              <polygon points={`0,120 ${heatmapPoints} 1000,120`} fill="url(#heatFill)" />
              <polyline
                points={heatmapPoints}
                fill="none"
                stroke="#A67C37"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Clickable viral moment markers */}
              {project.moments.map((m, idx) => {
                const x = Math.min(980, Math.max(20, (m.startSec / project.sourceDurationSec) * 1000));
                const y = 120 - m.heatmapIntensity * 104;
                const selected = m.id === activeMoment?.id;
                return (
                  <g
                    key={m.id}
                    onClick={() => setSelectedMomentId(m.id)}
                    className="cursor-pointer"
                  >
                    <line
                      x1={x}
                      y1={y}
                      x2={x}
                      y2="120"
                      stroke={selected ? '#0F6B4E' : '#A67C37'}
                      strokeWidth={selected ? 2 : 1}
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={selected ? 7 : 5}
                      fill={selected ? '#0F6B4E' : '#D4AF6A'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={Math.max(14, y - 12)}
                      textAnchor="middle"
                      className="fill-[#131715] dark:fill-[#F4F1EA] text-[11px] font-mono"
                    >
                      #{idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* Two-Column Ranked Moments + Live 9:16 Smart-Crop & Overlay Simulator */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ranked Viral Moments List */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] rounded-xl divide-y divide-[#DCE3EE] dark:divide-[#1E293B]">
          <div className="p-5 flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-xl font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                Ranked Viral Windows
              </h2>
              <p className="text-xs text-[#526075] dark:text-[#8B9BB4] mt-0.5">
                Fused from Most Replayed intensity, opening hook strength, and standalone payoff
              </p>
            </div>
            <span className="text-xs font-mono-tabular text-[#526075] dark:text-[#8B9BB4]">
              {project.moments.length} ready clips
            </span>
          </div>

          {project.moments.map((m, idx) => {
            const isSelected = m.id === activeMoment?.id;
            const clipDur = Math.round(m.endSec - m.startSec);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMomentId(m.id)}
                className={`w-full p-5 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#F6F4EF] dark:bg-[#1B221F]'
                    : 'hover:bg-[#FAF8F4] dark:hover:bg-[#171D1A]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular text-[#526075] dark:text-[#8B9BB4]">
                  <span className="text-[#D97706] dark:text-[#F5B82E] font-medium">
                    Clip 0{idx + 1} · {formatTimecode(m.startSec)} – {formatTimecode(m.endSec)} ({clipDur}s)
                  </span>
                  <span>
                    Peak {Math.round(m.heatmapIntensity * 100)}% · Hook {m.hookScore} · Dead-air -{m.deadAirSavedSec}s
                  </span>
                </div>
                <h3 className="font-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC] mt-1.5">
                  {m.title}
                </h3>
                <p className="text-sm text-[#526075] dark:text-[#8B9BB4] mt-1 leading-relaxed">
                  “{m.hookLine}”
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#526075] dark:text-[#8B9BB4]">
                  <span>Overlay: {m.overlayHeadline} ({m.overlayMetric})</span>
                  <span aria-hidden="true">·</span>
                  <span>{m.whyItHits}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live 9:16 Vertical Framing & Illustrator Overlay Simulator */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] rounded-xl p-6 space-y-5">
          {activeMoment && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#D97706] dark:text-[#F5B82E]">
                    9:16 Vertical Reframe Preview
                  </p>
                  <h3 className="font-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    EMA Crop & Vector Overlay
                  </h3>
                </div>
                <span className="text-xs font-mono-tabular text-[#0F6B4E] dark:text-[#2BB682]">
                  1080×1920
                </span>
              </div>

              <div className="flex justify-center bg-[#EFECE4] dark:bg-[#0B0E0D] rounded-lg p-3 border border-[#DCE3EE] dark:border-[#1E293B]">
                <canvas
                  ref={canvasRef}
                  width={360}
                  height={640}
                  data-testid="clipper-canvas"
                  data-framing={activeMoment.framingMode}
                  className="h-[460px] w-auto rounded-md shadow-lg border border-black/15 dark:border-white/10"
                />
              </div>

              {/* Framing Mode Controls */}
              <div>
                <span className="block text-xs font-medium text-[#526075] dark:text-[#8B9BB4] mb-2">
                  Smart-Crop Framing Strategy
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#F7F9FC] dark:bg-[#0B0F17] border border-[#DCE3EE] dark:border-[#1E293B]">
                  {[
                    { id: 'ema-single' as ClipFramingMode, label: 'EMA Speaker' },
                    { id: 'podcast-split' as ClipFramingMode, label: 'Podcast Split' },
                    { id: 'motion-split' as ClipFramingMode, label: 'Motion Split' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateActiveMoment({ framingMode: opt.id })}
                      className={`py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        activeMoment.framingMode === opt.id
                          ? 'bg-white dark:bg-[#1B221F] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                          : 'text-[#526075] dark:text-[#8B9BB4]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overlay & Caption Switches */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInjectOverlay((v) => !v)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    injectOverlay
                      ? 'border-[#A67C37] bg-[#F6F4EF] dark:bg-[#1B221F] text-[#0F172A] dark:text-[#F8FAFC]'
                      : 'border-[#DCE3EE] dark:border-[#1E293B] text-[#526075] dark:text-[#8B9BB4]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F5B82E]" />
                  Illustrator Overlay: {injectOverlay ? 'On' : 'Off'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateActiveMoment({ captionsEnabled: !activeMoment.captionsEnabled })
                  }
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    activeMoment.captionsEnabled
                      ? 'border-[#A67C37] bg-[#F6F4EF] dark:bg-[#1B221F] text-[#0F172A] dark:text-[#F8FAFC]'
                      : 'border-[#DCE3EE] dark:border-[#1E293B] text-[#526075] dark:text-[#8B9BB4]'
                  }`}
                >
                  <Subtitles className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F5B82E]" />
                  .ASS Captions: {activeMoment.captionsEnabled ? 'On' : 'Off'}
                </button>
              </div>

              {/* Local CLI & .ASS Inspector */}
              <div className="pt-3 border-t border-[#DCE3EE] dark:border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#526075] dark:text-[#8B9BB4] inline-flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5" />
                    Local Antigravity Clip Command
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCommand}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#D97706] dark:text-[#F5B82E] hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    Copy CLI
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-[#F7F9FC] dark:bg-[#0B0F17] border border-[#DCE3EE] dark:border-[#1E293B] text-[11px] font-mono-tabular text-[#0F172A] dark:text-[#F8FAFC] overflow-x-auto">
                  {localCliCommand}
                </pre>

                <button
                  type="button"
                  onClick={() => setShowAssDrawer((v) => !v)}
                  className="text-xs font-medium text-[#526075] dark:text-[#8B9BB4] hover:text-[#131715] dark:hover:text-[#F4F1EA] underline underline-offset-4 cursor-pointer"
                >
                  {showAssDrawer ? 'Hide generated .ASS karaoke file' : 'Inspect compiled FFmpeg libass .ASS captions'}
                </button>

                {showAssDrawer && (
                  <pre className="p-3 rounded-lg bg-[#F7F9FC] dark:bg-[#0B0F17] border border-[#DCE3EE] dark:border-[#1E293B] text-[11px] font-mono-tabular text-[#526075] dark:text-[#8B9BB4] max-h-44 overflow-auto">
                    {assPreview}
                  </pre>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
