import React, { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { ECOSYSTEM_TEARDOWN, KOKORO_VOICES } from '../data/presets';
import {
  GIGA_QUALITY_CHECKLIST,
  INFOGRAPHICS_WORLD_PALETTES,
  SHOT_COMPOSITION_ARCHETYPES,
  VISUAL_METAPHOR_MATRIX,
} from '../engine/infographicsStyleBible';
import { calculateHardwareBudget } from '../engine/motionMath';
import type {
  KokoroQuantization,
  SkillConfig,
  SkillRepoFile,
  VideoFormatId,
  WhisperModelTier,
} from '../types/engine';

interface AntigravitySkillViewProps {
  config: SkillConfig;
  files: SkillRepoFile[];
  onUpdateConfig: (next: SkillConfig) => void;
  onExportZip: () => void;
  onNotify: (msg: string) => void;
}

type TrainingInspectorTab =
  | 'quality-gate'
  | 'shot-archetypes'
  | 'metaphors'
  | 'color-worlds'
  | 'ecosystem';

export function AntigravitySkillView({
  config,
  files,
  onUpdateConfig,
  onExportZip,
  onNotify,
}: AntigravitySkillViewProps) {
  const [selectedPath, setSelectedPath] = useState(files[0]?.path ?? 'SKILL.md');
  const [budgetFormat, setBudgetFormat] = useState<VideoFormatId>('deepdive-30m');
  const [copiedFile, setCopiedFile] = useState(false);
  const [trainingTab, setTrainingTab] = useState<TrainingInspectorTab>('quality-gate');

  const selectedFile = files.find((f) => f.path === selectedPath) ?? files[0];
  const budget = calculateHardwareBudget({
    quantization: config.kokoroQuantization,
    whisperModel: config.whisperModel,
    format: budgetFormat,
    chunkSeconds: config.chunkSeconds,
    includeClipperStack: true,
  });

  const handleCopyFile = async () => {
    if (!selectedFile) return;
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopiedFile(true);
      onNotify(`Copied ${selectedFile.path}`);
      window.setTimeout(() => setCopiedFile(false), 1800);
    } catch {
      onNotify('Clipboard unavailable in this browser');
    }
  };

  return (
    <section aria-label="Antigravity Local Engine and Skill Repository" className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[#DCE3EE] dark:border-[#1E293B]">
        <div>
          <p className="text-xs font-medium text-[#D97706] dark:text-[#F5B82E] mb-1">
            Antigravity IDE Ultra v5.0 · {files.length} Self-Contained Files
          </p>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Infographics Show Ultra — Antigravity Skill & Local Engine
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#526075] dark:text-[#8B9BB4] max-w-2xl">
            Ships the 12-Domain Creative Playbook, 8 Shot-Composition Archetypes, cel-shaded{' '}
            <code>proPrimitives.tsx</code>, 6 AE-Bezier Remotion transitions, executable 18-Point
            Pro-Editor Quality Gate, and 5-layer SFX + Kokoro-82M pipeline.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportZip}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download {config.repoName}.zip
        </button>
      </div>

      {/* Local Kokoro + 16 GB RAM Budget Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Local Kokoro Voice Casting */}
        <div className="rounded-xl bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] p-6 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-editorial text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Local Kokoro-82M Voice Blend
            </h2>
            <span className="font-mono-tabular text-xs text-[#D97706] dark:text-[#F5B82E]">
              100% Offline in Antigravity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="kokoro-primary-voice"
                className="block text-xs font-medium text-[#526075] dark:text-[#8B9BB4] mb-1.5"
              >
                Primary Actor ({Math.round(config.voiceBlendRatio * 100)}%)
              </label>
              <select
                id="kokoro-primary-voice"
                value={config.primaryVoiceId}
                onChange={(e) => onUpdateConfig({ ...config, primaryVoiceId: e.target.value })}
                className="w-full rounded-lg border border-[#DCE3EE] dark:border-[#222E42] bg-[#F7F9FC] dark:bg-[#0B0F17] px-3 py-2 text-xs text-[#0F172A] dark:text-[#F8FAFC]"
              >
                {KOKORO_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="kokoro-secondary-voice"
                className="block text-xs font-medium text-[#526075] dark:text-[#8B9BB4] mb-1.5"
              >
                Secondary Blend ({Math.round((1 - config.voiceBlendRatio) * 100)}%)
              </label>
              <select
                id="kokoro-secondary-voice"
                value={config.secondaryVoiceId}
                onChange={(e) => onUpdateConfig({ ...config, secondaryVoiceId: e.target.value })}
                className="w-full rounded-lg border border-[#DCE3EE] dark:border-[#222E42] bg-[#F7F9FC] dark:bg-[#0B0F17] px-3 py-2 text-xs text-[#0F172A] dark:text-[#F8FAFC]"
              >
                {KOKORO_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label
                  htmlFor="voice-blend-slider"
                  className="text-[#526075] dark:text-[#8B9BB4]"
                >
                  Style LERP Ratio
                </label>
                <span className="font-mono-tabular text-[#0F172A] dark:text-[#F8FAFC]">
                  {Math.round(config.voiceBlendRatio * 100)} /{' '}
                  {Math.round((1 - config.voiceBlendRatio) * 100)}
                </span>
              </div>
              <input
                id="voice-blend-slider"
                type="range"
                min={0.5}
                max={1}
                step={0.05}
                value={config.voiceBlendRatio}
                onChange={(e) =>
                  onUpdateConfig({ ...config, voiceBlendRatio: Number(e.target.value) })
                }
                className="w-full accent-[#F5B82E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label htmlFor="speech-speed-slider" className="text-[#526075] dark:text-[#8B9BB4]">
                  Delivery Pace
                </label>
                <span className="font-mono-tabular text-[#0F172A] dark:text-[#F8FAFC]">
                  {config.speechSpeed.toFixed(2)}x
                </span>
              </div>
              <input
                id="speech-speed-slider"
                type="range"
                min={0.85}
                max={1.15}
                step={0.05}
                value={config.speechSpeed}
                onChange={(e) => onUpdateConfig({ ...config, speechSpeed: Number(e.target.value) })}
                className="w-full accent-[#F5B82E] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 16 GB RAM & Disk Footprint Calculator */}
        <div className="rounded-xl bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-editorial text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              16 GB RAM & Disk Footprint
            </h2>
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#EEF2F7] dark:bg-[#0B0F17] text-xs">
              {(
                [
                  { id: 'reel-1m', label: '1m' },
                  { id: 'youtube-10m', label: '10m' },
                  { id: 'deepdive-30m', label: '30m' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setBudgetFormat(f.id)}
                  className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer ${
                    budgetFormat === f.id
                      ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                      : 'text-[#526075] dark:text-[#8B9BB4]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-[#526075] dark:text-[#8B9BB4] mb-1.5">
                Kokoro ONNX Precision
              </span>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#EEF2F7] dark:bg-[#0B0F17]">
                {(['int8', 'fp16', 'fp32'] as KokoroQuantization[]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, kokoroQuantization: q })}
                    className={`py-1 text-xs font-mono-tabular uppercase rounded-md cursor-pointer ${
                      config.kokoroQuantization === q
                        ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                        : 'text-[#526075] dark:text-[#8B9BB4]'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs text-[#526075] dark:text-[#8B9BB4] mb-1.5">
                WhisperX Alignment
              </span>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#EEF2F7] dark:bg-[#0B0F17]">
                {(['base.en', 'small.en'] as WhisperModelTier[]).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, whisperModel: tier })}
                    className={`py-1 text-xs font-mono-tabular rounded-md cursor-pointer ${
                      config.whisperModel === tier
                        ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                        : 'text-[#526075] dark:text-[#8B9BB4]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#DCE3EE] dark:border-[#1E293B]">
            <div>
              <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">Total Local Disk</p>
              <p
                data-testid="total-disk-readout"
                className="font-mono-tabular text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]"
              >
                {budget.totalDiskMb} MB
              </p>
              <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4] font-mono-tabular">
                {(budget.totalDiskMb / 1024).toFixed(2)} GB total
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">Low-RAM Fallback</p>
              <p className="font-mono-tabular text-lg font-bold text-[#059669] dark:text-[#2AD08E]">
                ~{budget.peakRenderRamGb} GB
              </p>
              <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">
                Rust Resvg · {budget.chunkCount} chunks
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">60fps Remotion HD</p>
              <p className="font-mono-tabular text-lg font-bold text-[#D97706] dark:text-[#F5B82E]">
                60 FPS
              </p>
              <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4]">
                Pure SVG · 4x Fast Chrome
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live-Hydrated 25-File Antigravity Skill Explorer */}
      <div className="rounded-xl bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr]">
          {/* File Tree */}
          <div className="border-b lg:border-b-0 lg:border-r border-[#DCE3EE] dark:border-[#1E293B] p-4 max-h-[540px] overflow-y-auto space-y-1">
            <p className="px-2 pb-2 text-xs font-mono-tabular font-medium text-[#526075] dark:text-[#8B9BB4]">
              ~/.agents/skills/{config.repoName}/ ({files.length})
            </p>
            {files.map((file) => {
              const active = file.path === selectedFile?.path;
              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedPath(file.path)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] font-semibold'
                      : 'text-[#0F172A] dark:text-[#E2E8F0] hover:bg-[#EEF2F7] dark:hover:bg-[#182132]'
                  }`}
                >
                  <div className="font-mono-tabular truncate">{file.path}</div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      active ? 'opacity-80' : 'text-[#526075] dark:text-[#8B9BB4]'
                    }`}
                  >
                    {file.category}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer */}
          {selectedFile && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#DCE3EE] dark:border-[#1E293B]">
                <div className="min-w-0">
                  <p className="font-mono-tabular text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                    {selectedFile.path}
                  </p>
                  <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4] truncate">
                    {selectedFile.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyFile}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[#DCE3EE] dark:border-[#222E42] text-[#0F172A] dark:text-[#F8FAFC] hover:border-[#D97706] dark:hover:border-[#F5B82E] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedFile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedFile ? 'Copied' : 'Copy File'}
                </button>
              </div>
              <pre className="p-5 text-xs font-mono-tabular leading-relaxed text-[#0F172A] dark:text-[#CBD5E1] bg-[#F7F9FC] dark:bg-[#0B0F17] overflow-auto max-h-[480px]">
                {selectedFile.content}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Infographics Show Ultra Training Architecture Inspector */}
      <div className="rounded-xl bg-white dark:bg-[#111722] border border-[#DCE3EE] dark:border-[#1E293B] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Infographics Show Ultra — Antigravity Training Architecture
            </h2>
            <p className="text-xs text-[#526075] dark:text-[#8B9BB4] mt-0.5">
              Every rule below is embedded inside your exported skill so Antigravity maintains 10/10
              creativity and zero-defect consistency across any topic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#EEF2F7] dark:bg-[#0B0F17] text-xs">
            {(
              [
                { id: 'quality-gate', label: '18-Point Quality Gate' },
                { id: 'shot-archetypes', label: 'Shot Archetypes (8)' },
                { id: 'metaphors', label: '12-Domain Metaphors' },
                { id: 'color-worlds', label: '12 Color Worlds' },
                { id: 'ecosystem', label: 'Ecosystem Teardown' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTrainingTab(tab.id)}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  trainingTab === tab.id
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                    : 'text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {trainingTab === 'shot-archetypes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SHOT_COMPOSITION_ARCHETYPES.map((arch) => (
              <div
                key={arch.id}
                className="rounded-lg border border-[#DCE3EE] dark:border-[#1E293B] bg-[#F7F9FC] dark:bg-[#0B0F17] p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">{arch.name}</p>
                  <span className="font-mono-tabular text-[11px] text-[#D97706] dark:text-[#F5B82E] shrink-0">
                    {arch.signatureTransition}
                  </span>
                </div>
                <p className="text-xs text-[#0F172A] dark:text-[#E2E8F0] leading-relaxed">
                  {arch.cameraLanguage}
                </p>
                <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4] leading-relaxed">
                  <strong className="text-[#0F172A] dark:text-[#CBD5E1]">Framing:</strong>{' '}
                  {arch.framingRule}
                </p>
                <p className="text-[11px] text-[#059669] dark:text-[#2AD08E]">
                  Best for: {arch.bestUsedFor}
                </p>
              </div>
            ))}
          </div>
        )}

        {trainingTab === 'quality-gate' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DCE3EE] dark:border-[#1E293B] text-[#526075] dark:text-[#8B9BB4]">
                  <th className="py-2.5 pr-4 font-medium">#</th>
                  <th className="py-2.5 pr-4 font-medium">Category</th>
                  <th className="py-2.5 pr-4 font-medium">Defect Eliminated</th>
                  <th className="py-2.5 font-medium">Infographics Show Ultra Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EE] dark:divide-[#1E293B]">
                {GIGA_QUALITY_CHECKLIST.map((item, i) => (
                  <tr key={item.id} className="align-top">
                    <td className="py-3 pr-4 font-mono-tabular font-semibold text-[#D97706] dark:text-[#F5B82E]">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 pr-4 font-medium text-[#0F172A] dark:text-[#F8FAFC] whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3 pr-4 text-[#526075] dark:text-[#8B9BB4]">
                      {item.defectTargeted}
                    </td>
                    <td className="py-3 text-[#0F172A] dark:text-[#E2E8F0]">
                      {item.nonNegotiableStandard}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {trainingTab === 'metaphors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DCE3EE] dark:border-[#1E293B] text-[#526075] dark:text-[#8B9BB4]">
                  <th className="py-2.5 pr-4 font-medium">Domain</th>
                  <th className="py-2.5 pr-4 font-medium">Banned Cliché</th>
                  <th className="py-2.5 pr-4 font-medium">Real-World Zero-Human Scenario</th>
                  <th className="py-2.5 font-medium">Color World</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EE] dark:divide-[#1E293B]">
                {VISUAL_METAPHOR_MATRIX.map((m) => (
                  <tr key={m.domain} className="align-top">
                    <td className="py-3 pr-4 font-semibold text-[#0F172A] dark:text-[#F8FAFC] whitespace-nowrap">
                      {m.domain}
                    </td>
                    <td className="py-3 pr-4 text-[#DC2626] dark:text-[#F43F5E]/90 line-through">
                      {m.bannedCliche}
                    </td>
                    <td className="py-3 pr-4 text-[#0F172A] dark:text-[#E2E8F0] leading-relaxed">
                      {m.ultraRealWorldScenario}
                    </td>
                    <td className="py-3 font-mono-tabular text-[#D97706] dark:text-[#F5B82E] whitespace-nowrap">
                      {m.recommendedWorldId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {trainingTab === 'color-worlds' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(INFOGRAPHICS_WORLD_PALETTES).map((world) => (
              <div
                key={world.id}
                className="rounded-lg overflow-hidden border border-[#DCE3EE] dark:border-[#1E293B] bg-[#F7F9FC] dark:bg-[#0B0F17]"
              >
                <div
                  className="h-14 w-full relative"
                  style={{
                    background: `linear-gradient(180deg, ${world.skyTop} 0%, ${world.skyBottom} 64%, ${world.ground} 100%)`,
                  }}
                >
                  <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-[#18222F]"
                      style={{ backgroundColor: world.primary }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-[#18222F]"
                      style={{ backgroundColor: world.secondary }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-[#18222F]"
                      style={{ backgroundColor: world.accent }}
                    />
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {world.name}
                  </p>
                  <p className="text-[11px] font-mono-tabular text-[#D97706] dark:text-[#F5B82E]">
                    {world.id} · {world.domain}
                  </p>
                  <p className="text-[11px] text-[#526075] dark:text-[#8B9BB4] leading-relaxed">
                    {world.mood}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {trainingTab === 'ecosystem' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DCE3EE] dark:border-[#1E293B] text-[#526075] dark:text-[#8B9BB4]">
                  <th className="py-2.5 pr-4 font-medium">Skill / Repository</th>
                  <th className="py-2.5 pr-4 font-medium">Adopted Strength</th>
                  <th className="py-2.5 pr-4 font-medium">Bottleneck Solved</th>
                  <th className="py-2.5 font-medium">Sovereign Motion Ultra Upgrade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EE] dark:divide-[#1E293B]">
                {ECOSYSTEM_TEARDOWN.map((row) => (
                  <tr key={row.tool} className="align-top">
                    <td className="py-3 pr-4 font-mono-tabular font-semibold text-[#0F172A] dark:text-[#F8FAFC] whitespace-nowrap">
                      {row.tool}
                    </td>
                    <td className="py-3 pr-4 text-[#526075] dark:text-[#8B9BB4]">{row.strengths}</td>
                    <td className="py-3 pr-4 text-[#526075] dark:text-[#8B9BB4]">
                      {row.bottleneck}
                    </td>
                    <td className="py-3 text-[#0F172A] dark:text-[#E2E8F0]">
                      {row.sovereignAdvantage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
