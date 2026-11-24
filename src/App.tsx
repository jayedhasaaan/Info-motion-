import React, { useEffect, useMemo, useState } from 'react';
import JSZip from 'jszip';
import { Download, Moon, Sun } from 'lucide-react';
import { AntigravitySkillView } from './components/AntigravitySkillView';
import { DirectorStudioView, type StudioStep } from './components/DirectorStudioView';
import { ViralClipperView } from './components/ViralClipperView';
import {
  createInitialBlueprint,
  createInitialViralClipProject,
  DEFAULT_SKILL_CONFIG,
} from './data/presets';
import { generateSkillRepoFiles } from './engine/skillRepoGenerator';
import type { SkillConfig, VideoBlueprint, ViralClipProject } from './types/engine';

type ActiveTab = 'studio' | 'clipper' | 'skill';

const STORAGE_CONFIG_KEY = 'sovereign-motion-config-v3';
const STORAGE_THEME_KEY = 'sovereign-motion-ui-theme-v3';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [studioStep, setStudioStep] = useState<StudioStep>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('step') === 'brief') return 'brief';
      if (params.get('step') === 'review') return 'review';
    } catch {
      // ignore
    }
    return 'preview';
  });

  // Cinema Broadcast Dark Suite default with seamless Crisp Studio Light toggle
  const [isDarkUi, setIsDarkUi] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved === 'light') return false;
      return true;
    } catch {
      return true;
    }
  });

  const [config, setConfig] = useState<SkillConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) return { ...DEFAULT_SKILL_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore storage errors
    }
    return DEFAULT_SKILL_CONFIG;
  });

  const [blueprint, setBlueprint] = useState<VideoBlueprint>(() => createInitialBlueprint());
  const [clipProject, setClipProject] = useState<ViralClipProject>(() =>
    createInitialViralClipProject()
  );
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkUi);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, isDarkUi ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDarkUi]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const repoFiles = useMemo(
    () => generateSkillRepoFiles(config, blueprint, clipProject),
    [config, blueprint, clipProject]
  );

  const handleExportZip = async () => {
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder(config.repoName) ?? zip;
      for (const file of repoFiles) {
        rootFolder.file(file.path, file.content);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.repoName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      notify(`Exported ${config.repoName}.zip (${repoFiles.length} Antigravity files)`);
    } catch {
      notify('Could not build .zip archive in this browser.');
    }
  };

  const navItems: Array<{ id: ActiveTab; label: string }> = [
    { id: 'studio', label: 'Studio' },
    { id: 'clipper', label: 'Clipper' },
    { id: 'skill', label: 'Antigravity Skill' },
  ];

  const studioSteps: Array<{ id: StudioStep; label: string }> = [
    { id: 'brief', label: '01. Brief' },
    { id: 'review', label: '02. Direction Gate' },
    { id: 'preview', label: '03. Screening Room' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#0F172A] dark:bg-[#080C14] dark:text-[#F8FAFC] transition-colors duration-200">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#F7F9FC]/92 dark:bg-[#080C14]/92 backdrop-blur-md border-b border-[#DCE3EE] dark:border-[#1B263B]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark + Broadcast Aperture Mark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('studio');
              setStudioStep('preview');
            }}
            className="inline-flex items-center gap-2.5 font-editorial text-xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] whitespace-nowrap shrink-0"
          >
            <span
              aria-hidden="true"
              className="w-6 h-6 rounded-md bg-[#0F172A] dark:bg-[#F5B82E] inline-flex items-center justify-center shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 2.5H8.5L11.5 7L8.5 11.5H2.5L5.5 7L2.5 2.5Z"
                  className="fill-[#F5B82E] dark:fill-[#080C14]"
                />
              </svg>
            </span>
            Sovereign Motion
          </a>

          {/* Zone 2: 3 Clean Single-Line Nav Links */}
          <nav
            aria-label="Primary workspace navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium"
          >
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'border-[#D97706] dark:border-[#F5B82E] text-[#0F172A] dark:text-[#F8FAFC]'
                      : 'border-transparent text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleExportZip}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Skill
            </button>
          </div>
        </div>
      </header>

      {/* Precision Sub-Toolbar: 3-Step Studio Flow + Studio Surface Switch */}
      <div className="border-b border-[#DCE3EE] dark:border-[#1E293B] bg-white/80 dark:bg-[#111722]/85">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Mobile primary nav */}
          <div className="flex md:hidden items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17]'
                    : 'text-[#526075] dark:text-[#8B9BB4]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Studio 3-step workflow rail */}
          {activeTab === 'studio' ? (
            <div
              role="navigation"
              aria-label="Director workflow steps"
              className="flex items-center gap-2 sm:gap-5 text-xs"
            >
              {studioSteps.map((s, idx) => {
                const active = studioStep === s.id;
                return (
                  <React.Fragment key={s.id}>
                    {idx > 0 && (
                      <span aria-hidden="true" className="text-[#CBD5E1] dark:text-[#2D3B54]">
                        /
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setStudioStep(s.id)}
                      aria-current={active ? 'step' : undefined}
                      className={`whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'font-semibold text-[#0F172A] dark:text-[#F5B82E]'
                          : 'text-[#526075] dark:text-[#8B9BB4] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                      }`}
                    >
                      {s.label}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs text-[#526075] dark:text-[#8B9BB4]">
              <span>
                {activeTab === 'clipper'
                  ? 'YouTube Most Replayed Radar · EMA 9:16 Smart Crop'
                  : `Infographics Show Broadcast v6.0 · ${repoFiles.length} Self-Contained Files · Kokoro-82M (${config.kokoroQuantization.toUpperCase()})`}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsDarkUi((d) => !d)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-[#DCE3EE] dark:border-[#222E42] bg-white dark:bg-[#182132] text-[#0F172A] dark:text-[#F8FAFC] hover:border-[#D97706] dark:hover:border-[#F5B82E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isDarkUi ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F5B82E]" />
                Studio Light
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#526075]" />
                Cinema Dark
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main id="top" className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'studio' && (
          <DirectorStudioView
            step={studioStep}
            onStepChange={setStudioStep}
            blueprint={blueprint}
            config={config}
            onUpdateBlueprint={setBlueprint}
            onExportZip={handleExportZip}
            onNotify={notify}
          />
        )}
        {activeTab === 'clipper' && (
          <ViralClipperView
            project={clipProject}
            config={config}
            onUpdateProject={setClipProject}
            onNotify={notify}
          />
        )}
        {activeTab === 'skill' && (
          <AntigravitySkillView
            config={config}
            files={repoFiles}
            onUpdateConfig={setConfig}
            onExportZip={handleExportZip}
            onNotify={notify}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#DCE3EE] dark:border-[#1B263B] py-6 mt-10">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#526075] dark:text-[#8B9BB4]">
          <span>Sovereign Motion · Infographics Show Broadcast v6.0 Studio & Antigravity Skill</span>
          <span>Lineless Split-Shaded Art · Zero Box Templates · Zero Human Frames · 60fps AE Transitions</span>
        </div>
      </footer>

      {/* Non-intrusive Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-[#0F172A] text-[#F8FAFC] dark:bg-[#F5B82E] dark:text-[#0B0F17] text-xs font-semibold shadow-xl border border-white/10"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
