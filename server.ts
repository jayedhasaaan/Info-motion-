import 'dotenv/config';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type } from '@google/genai';
import { createInitialBlueprint } from './src/data/presets';
import { INFOGRAPHICS_SHOW_ULTRA_SYSTEM_PROMPT } from './src/engine/infographicsStyleBible';
import { renderBlueprintToMp4, type RenderMp4Result } from './src/server/renderMp4Engine';
import type { VideoBlueprint } from './src/types/engine';

interface RenderJobState {
  jobId: string;
  status: 'running' | 'done' | 'error';
  stage: string;
  progress: number;
  videoUrl?: string;
  meta?: {
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
  };
  syncedBlueprint?: VideoBlueprint;
  error?: string;
}

const renderJobs = new Map<string, RenderJobState>();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Add it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const VALID_CLIP_OBJECTS = [
  'sovereign-coins',
  'compound-staircase',
  'eroding-banknote',
  'watch-escapement',
  'credit-trap-ledger',
  'vault-dial',
  'asset-balance-scale',
  'statement-scanner',
  'property-blueprint',
  'split-ledger-compare',
] as const;

const VALID_PRIMITIVES = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'line', 'text'] as const;
const VALID_ENTRANCES = [
  'trim-path',
  'spring-pop',
  'slide-up',
  'slide-left',
  'slide-right',
  'scale-bloom',
  'drop-gravity',
  'fade',
] as const;
const VALID_IDLES = ['none', 'float', 'pulse', 'rotate-slow', 'sway', 'drip', 'tick'] as const;
const VALID_BRIDGES = [
  'zoom-through',
  'pan-follow',
  'path-extension',
  'morph-handoff',
  'match-cut-spin',
  'vertical-dolly',
] as const;

const TREATMENT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    hook: { type: Type.STRING },
    formula: {
      type: Type.OBJECT,
      properties: {
        hookStrategy: { type: Type.STRING },
        openLoop: { type: Type.STRING },
        continuitySpine: { type: Type.STRING },
        pacingRule: { type: Type.STRING },
        payoffLine: { type: Type.STRING },
      },
      required: ['hookStrategy', 'openLoop', 'continuitySpine', 'pacingRule', 'payoffLine'],
    },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          chapter: { type: Type.STRING },
          headline: { type: Type.STRING },
          sublabel: { type: Type.STRING },
          narration: { type: Type.STRING },
          durationSec: { type: Type.NUMBER },
          visualConcept: { type: Type.STRING },
          cameraMove: { type: Type.STRING },
          palettePolarity: { type: Type.STRING },
          sfxCue: { type: Type.STRING },
          emotion: { type: Type.STRING },
          continuityType: { type: Type.STRING },
          continuityDescription: { type: Type.STRING },
          bridgeColor: { type: Type.STRING },
          layers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                kind: { type: Type.STRING },
                depth: { type: Type.STRING },
                d: { type: Type.STRING },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                width: { type: Type.NUMBER },
                height: { type: Type.NUMBER },
                rx: { type: Type.NUMBER },
                ry: { type: Type.NUMBER },
                cx: { type: Type.NUMBER },
                cy: { type: Type.NUMBER },
                r: { type: Type.NUMBER },
                x1: { type: Type.NUMBER },
                y1: { type: Type.NUMBER },
                x2: { type: Type.NUMBER },
                y2: { type: Type.NUMBER },
                points: { type: Type.STRING },
                text: { type: Type.STRING },
                fontSize: { type: Type.NUMBER },
                fontFamily: { type: Type.STRING },
                fill: { type: Type.STRING },
                stroke: { type: Type.STRING },
                strokeWidth: { type: Type.NUMBER },
                strokeDasharray: { type: Type.STRING },
                opacity: { type: Type.NUMBER },
                entrance: { type: Type.STRING },
                idle: { type: Type.STRING },
                delaySec: { type: Type.NUMBER },
                durationSec: { type: Type.NUMBER },
              },
              required: ['label', 'kind', 'depth', 'entrance', 'delaySec', 'durationSec'],
            },
          },
        },
        required: [
          'chapter',
          'headline',
          'sublabel',
          'narration',
          'durationSec',
          'visualConcept',
          'cameraMove',
          'palettePolarity',
          'sfxCue',
          'emotion',
          'continuityType',
          'continuityDescription',
          'layers',
        ],
      },
    },
  },
  required: ['title', 'hook', 'formula', 'scenes'],
};

function sanitizeTreatmentScenes(
  rawScenes: unknown,
  paletteMode: string,
  emotionCadence: string
) {
  const list = Array.isArray(rawScenes) ? rawScenes : [];
  return list.map((raw, idx) => {
    const s = raw as Record<string, unknown>;
    const rawLayers = Array.isArray(s.layers) ? s.layers : [];
    const safeLayers: Array<Record<string, unknown>> = rawLayers.slice(0, 14).map((lr, lIdx) => {
      const l = lr as Record<string, unknown>;
      const kind = VALID_PRIMITIVES.includes(String(l.kind) as (typeof VALID_PRIMITIVES)[number])
        ? String(l.kind)
        : 'circle';
      const depth = ['bg', 'mid', 'fg'].includes(String(l.depth)) ? String(l.depth) : 'mid';
      const entrance = VALID_ENTRANCES.includes(
        String(l.entrance) as (typeof VALID_ENTRANCES)[number]
      )
        ? String(l.entrance)
        : 'trim-path';
      const idle = VALID_IDLES.includes(String(l.idle) as (typeof VALID_IDLES)[number])
        ? String(l.idle)
        : 'none';

      return {
        id: `layer-${idx}-${lIdx}`,
        label: String(l.label || `Layer ${lIdx + 1}`),
        kind,
        depth,
        d: typeof l.d === 'string' && l.d.trim() ? l.d.trim() : undefined,
        x: typeof l.x === 'number' ? l.x : undefined,
        y: typeof l.y === 'number' ? l.y : undefined,
        width: typeof l.width === 'number' ? l.width : undefined,
        height: typeof l.height === 'number' ? l.height : undefined,
        rx: typeof l.rx === 'number' ? l.rx : undefined,
        ry: typeof l.ry === 'number' ? l.ry : undefined,
        cx: typeof l.cx === 'number' ? l.cx : undefined,
        cy: typeof l.cy === 'number' ? l.cy : undefined,
        r: typeof l.r === 'number' ? l.r : undefined,
        x1: typeof l.x1 === 'number' ? l.x1 : undefined,
        y1: typeof l.y1 === 'number' ? l.y1 : undefined,
        x2: typeof l.x2 === 'number' ? l.x2 : undefined,
        y2: typeof l.y2 === 'number' ? l.y2 : undefined,
        points: typeof l.points === 'string' && l.points.trim() ? l.points.trim() : undefined,
        text: typeof l.text === 'string' && l.text.trim() ? l.text.trim() : undefined,
        fontSize: typeof l.fontSize === 'number' ? Math.max(16, Math.min(64, l.fontSize)) : undefined,
        fontFamily: ['editorial', 'sans', 'mono'].includes(String(l.fontFamily))
          ? String(l.fontFamily)
          : 'mono',
        fill: typeof l.fill === 'string' && l.fill.trim() ? l.fill.trim() : 'none',
        stroke: typeof l.stroke === 'string' && l.stroke.trim() ? l.stroke.trim() : 'accent',
        strokeWidth: typeof l.strokeWidth === 'number' ? Math.max(0, Math.min(28, l.strokeWidth)) : 4,
        strokeDasharray:
          typeof l.strokeDasharray === 'string' && l.strokeDasharray.trim()
            ? l.strokeDasharray.trim()
            : undefined,
        opacity: typeof l.opacity === 'number' ? Math.max(0.08, Math.min(1, l.opacity)) : 1,
        entrance,
        idle,
        delaySec: Math.max(0, Math.min(2.5, Number(l.delaySec) || lIdx * 0.08)),
        durationSec: Math.max(0.3, Math.min(1.8, Number(l.durationSec) || 0.72)),
      };
    });

    // Guarantee at least one visible vector artwork if model returns empty layers
    if (safeLayers.length === 0) {
      safeLayers.push(
        {
          id: `fallback-ring-${idx}`,
          label: 'Focal Ring',
          kind: 'circle',
          depth: 'mid',
          cx: 500,
          cy: 500,
          r: 180,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 6,
          opacity: 1,
          entrance: 'trim-path',
          idle: 'float',
          delaySec: 0.1,
          durationSec: 0.85,
        },
        {
          id: `fallback-label-${idx}`,
          label: 'Beat Title',
          kind: 'text',
          depth: 'fg',
          x: 500,
          y: 512,
          text: String(s.headline || 'Visual Beat').slice(0, 26),
          fontSize: 28,
          fontFamily: 'mono',
          fill: 'ink',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          entrance: 'slide-up',
          idle: 'none',
          delaySec: 0.35,
          durationSec: 0.6,
        }
      );
    }

    const continuityType = VALID_BRIDGES.includes(
      String(s.continuityType) as (typeof VALID_BRIDGES)[number]
    )
      ? String(s.continuityType)
      : idx % 2 === 0
        ? 'pan-follow'
        : 'zoom-through';

    // Spread scenes across Continuous Infinite World Space so the camera glides organically between beats
    const worldX = idx * 1160;
    const worldY = idx === 0 ? 0 : idx % 2 === 1 ? 110 : -110;

    return {
      id: `beat-${Date.now()}-${idx}`,
      chapter: String(s.chapter || `0${idx + 1} · SCENE BEAT`),
      headline: String(s.headline || `Visual Beat ${idx + 1}`),
      sublabel: String(s.sublabel || 'Bespoke Continuous Vector Scene'),
      narration: String(s.narration || ''),
      durationSec: Math.max(4.8, Math.min(10.5, Number(s.durationSec) || 7.0)),
      startSec: 0,
      visualConcept: String(
        s.visualConcept || 'Custom multi-layer Illustrator vector scene matching narration 100%.'
      ),
      worldX,
      worldY,
      cameraZoom: idx % 2 === 1 ? 1.04 : 1.0,
      cameraRotate: 0,
      continuity: {
        type: continuityType,
        carryDescription: String(
          s.continuityDescription ||
            'Camera glides smoothly along the continuous visual thread from the previous shot into this scene.'
        ),
        bridgeColor: ['accent', 'emerald', 'crimson', 'ink', 'muted'].includes(
          String(s.bridgeColor)
        )
          ? String(s.bridgeColor)
          : 'accent',
      },
      layers: safeLayers,
      visualObject: VALID_CLIP_OBJECTS[idx % VALID_CLIP_OBJECTS.length],
      metricStart: '',
      metricEnd: '',
      metricUnit: '',
      cameraMove: ['push-in', 'pull-back', 'pan-right', 'whip-cut', 'settle'].includes(
        String(s.cameraMove)
      )
        ? String(s.cameraMove)
        : 'push-in',
      transition: 'match-cut',
      palettePolarity:
        paletteMode === 'light'
          ? 'light'
          : paletteMode === 'dark'
            ? 'dark'
            : s.palettePolarity === 'dark'
              ? 'dark'
              : 'light',
      sfxCue: ['coin-chime', 'ledger-tick', 'velvet-whoosh', 'vault-lock', 'tension-pulse'].includes(
        String(s.sfxCue)
      )
        ? String(s.sfxCue)
        : 'velvet-whoosh',
      emotion: ['grounded-mentor', 'sharp-investigative', 'urgent-warning', 'calm-authority'].includes(
        String(s.emotion)
      )
        ? String(s.emotion)
        : emotionCadence || 'grounded-mentor',
      words: [],
    };
  });
}

const DIRECTOR_SYSTEM_PROMPT = INFOGRAPHICS_SHOW_ULTRA_SYSTEM_PROMPT;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // 1. Draft Master Script + Continuous Visual Direction + Procedural SVG Scene Graph
  app.post('/api/draft-treatment', async (req, res) => {
    try {
      const { topic, format, paletteMode, subtitlesEnabled, emotionCadence } = req.body ?? {};
      if (!topic || typeof topic !== 'string' || !topic.trim()) {
        res.status(400).json({ error: 'Please describe your video topic first.' });
        return;
      }

      const ai = getGeminiClient();
      const targetMinutes =
        format === 'deepdive-30m'
          ? 30
          : format === 'youtube-10m'
            ? 10
            : format === 'youtube-2m'
              ? 2
              : 1;
      const aspectRatio = format === 'reel-1m' ? '9:16' : '16:9';
      const beatCount =
        format === 'deepdive-30m' ? 6 : format === 'youtube-10m' || format === 'youtube-2m' ? 6 : 4;

      const userPrompt = `Direct a ${targetMinutes}-minute (${aspectRatio}) continuous animated motion-graphics treatment on this topic:
"${topic.trim()}"

Directives:
- Palette preference: "${paletteMode || 'mix'}" (if "light", every beat is "light"; if "dark", every beat is "dark"; if "mix", alternate thoughtfully between "light" and "dark" by dramatic tension).
- Voice/Emotion cadence: "${emotionCadence || 'grounded-mentor'}".
- Output ${beatCount} tightly linked continuous beats representing the full master flow (each narration 22–36 vivid English words, zero filler).
- Make every beat's vector 'layers' visually distinct, concrete, and 100% matched to what is being spoken—NOT generic charts.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: userPrompt,
        config: {
          systemInstruction: DIRECTOR_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: TREATMENT_RESPONSE_SCHEMA,
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Gemini returned an empty treatment. Please try again.' });
        return;
      }

      const parsed = JSON.parse(rawText);
      const safeScenes = sanitizeTreatmentScenes(
        parsed.scenes,
        String(paletteMode || 'mix'),
        String(emotionCadence || 'grounded-mentor')
      );

      res.json({
        title: String(parsed.title || topic.trim()),
        hook: String(parsed.hook || ''),
        topic: topic.trim(),
        format: format || 'reel-1m',
        aspectRatio,
        targetMinutes,
        paletteMode: paletteMode || 'mix',
        subtitlesEnabled: Boolean(subtitlesEnabled),
        formula: {
          hookStrategy: String(parsed.formula?.hookStrategy || 'Immediate physical metaphor hook within 0.5s.'),
          openLoop: String(parsed.formula?.openLoop || 'Sets up an unresolved tension revealed by the final beat.'),
          continuitySpine: String(parsed.formula?.continuitySpine || 'Continuous infinite camera linking every shot.'),
          pacingRule: String(parsed.formula?.pacingRule || 'Dynamic beat evolution every 6–8 seconds.'),
          payoffLine: String(parsed.formula?.payoffLine || ''),
        },
        scenes: safeScenes,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to draft script and visual direction.';
      res.status(500).json({ error: message });
    }
  });

  // 2. Revise Master Script & Visual Direction from User Critique (Director's Review Loop)
  app.post('/api/revise-treatment', async (req, res) => {
    try {
      const { currentBlueprint, feedback } = req.body ?? {};
      if (!feedback || typeof feedback !== 'string' || !feedback.trim()) {
        res.status(400).json({ error: 'Tell the Director what you want changed before revising.' });
        return;
      }
      if (!currentBlueprint || !Array.isArray(currentBlueprint.scenes)) {
        res.status(400).json({ error: 'Missing active treatment to revise.' });
        return;
      }

      const ai = getGeminiClient();
      const condensedCurrent = {
        title: currentBlueprint.title,
        topic: currentBlueprint.topic,
        paletteMode: currentBlueprint.paletteMode,
        formula: currentBlueprint.formula,
        scenes: currentBlueprint.scenes.map((s: Record<string, unknown>, i: number) => ({
          beatNumber: i + 1,
          chapter: s.chapter,
          headline: s.headline,
          narration: s.narration,
          visualConcept: s.visualConcept,
          continuityType: (s.continuity as Record<string, unknown> | undefined)?.type,
          continuityDescription: (s.continuity as Record<string, unknown> | undefined)?.carryDescription,
          palettePolarity: s.palettePolarity,
        })),
      };

      const prompt = `Here is the current Master Script & Continuous Visual Direction treatment:
${JSON.stringify(condensedCurrent, null, 2)}

USER CRITIQUE & REVISION REQUEST:
"${feedback.trim()}"

Revise the Master Script, Continuity Bridges, and bespoke multi-layer SVG vector scenes to address 100% of the user's feedback cleanly while keeping every shot linked as one ongoing continuous animated film. Preserve the same number of beats (${currentBlueprint.scenes.length}) unless the user explicitly asked to add or remove beats.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction: DIRECTOR_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: TREATMENT_RESPONSE_SCHEMA,
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Gemini returned an empty revision. Please try again.' });
        return;
      }

      const parsed = JSON.parse(rawText);
      const nextPalette =
        /dark/i.test(feedback) && !/light/i.test(feedback)
          ? 'dark'
          : /light/i.test(feedback) && !/dark/i.test(feedback)
            ? 'light'
            : String(currentBlueprint.paletteMode || 'mix');

      const safeScenes = sanitizeTreatmentScenes(
        parsed.scenes,
        nextPalette,
        'grounded-mentor'
      );

      res.json({
        title: String(parsed.title || currentBlueprint.title),
        hook: String(parsed.hook || currentBlueprint.hook),
        paletteMode: nextPalette,
        formula: {
          hookStrategy: String(parsed.formula?.hookStrategy || currentBlueprint.formula?.hookStrategy || ''),
          openLoop: String(parsed.formula?.openLoop || currentBlueprint.formula?.openLoop || ''),
          continuitySpine: String(parsed.formula?.continuitySpine || currentBlueprint.formula?.continuitySpine || ''),
          pacingRule: String(parsed.formula?.pacingRule || currentBlueprint.formula?.pacingRule || ''),
          payoffLine: String(parsed.formula?.payoffLine || currentBlueprint.formula?.payoffLine || ''),
        },
        scenes: safeScenes,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to revise treatment.';
      res.status(500).json({ error: message });
    }
  });

  // 3. Viral YouTube Clipper Moment Analyzer (gemini-4-hydrogen structured JSON)
  app.post('/api/analyze-viral-clips', async (req, res) => {
    try {
      const { sourceInput, sourceUrl, framingDefault, captionsEnabled } = req.body ?? {};
      if ((!sourceInput || !String(sourceInput).trim()) && (!sourceUrl || !String(sourceUrl).trim())) {
        res.status(400).json({
          error: 'Provide a YouTube URL, video topic, or transcript excerpt to detect viral moments.',
        });
        return;
      }

      const ai = getGeminiClient();
      const systemInstruction = `You are a Viral Short-Form Clipping Strategist combining YouTube Most Replayed heatmap modeling with custom vector motion overlays for any long-form video or podcast.
Rules:
- Extract exactly 4 high-retention standalone viral clip windows (each 35–60 seconds long) inside a 36–50 minute source video.
- Each clip must include realistic startSec/endSec timestamps spread across the source video, a sharp scroll-stopping hookLine, concrete transcriptExcerpt (30–45 spoken words), whyItHits analysis, deadAirSavedSec (3.5–8.5s), scores (82–98), and a matched overlay object from: ${VALID_CLIP_OBJECTS.join(', ')}.`;

      const prompt = `Analyze this YouTube source for top viral 9:16 clipping moments:
URL: ${sourceUrl || 'Not provided'}
Notes / Transcript / Topic: ${sourceInput || 'Long-form high-retention podcast interview'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sourceTitle: { type: Type.STRING },
              sourceChannel: { type: Type.STRING },
              sourceDurationSec: { type: Type.NUMBER },
              moments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    hookLine: { type: Type.STRING },
                    startSec: { type: Type.NUMBER },
                    endSec: { type: Type.NUMBER },
                    heatmapIntensity: { type: Type.NUMBER },
                    hookScore: { type: Type.NUMBER },
                    retentionScore: { type: Type.NUMBER },
                    payoffScore: { type: Type.NUMBER },
                    deadAirSavedSec: { type: Type.NUMBER },
                    transcriptExcerpt: { type: Type.STRING },
                    whyItHits: { type: Type.STRING },
                    overlayObject: { type: Type.STRING },
                    overlayHeadline: { type: Type.STRING },
                    overlayMetric: { type: Type.STRING },
                    palettePolarity: { type: Type.STRING },
                  },
                  required: [
                    'title',
                    'hookLine',
                    'startSec',
                    'endSec',
                    'heatmapIntensity',
                    'hookScore',
                    'retentionScore',
                    'payoffScore',
                    'deadAirSavedSec',
                    'transcriptExcerpt',
                    'whyItHits',
                    'overlayObject',
                    'overlayHeadline',
                    'overlayMetric',
                    'palettePolarity',
                  ],
                },
              },
            },
            required: ['sourceTitle', 'sourceChannel', 'sourceDurationSec', 'moments'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Gemini returned an empty clip analysis.' });
        return;
      }

      const parsed = JSON.parse(rawText);
      const totalDur = Math.max(600, Number(parsed.sourceDurationSec) || 2400);
      const moments = (Array.isArray(parsed.moments) ? parsed.moments : []).map(
        (m: Record<string, unknown>, idx: number) => {
          const s = Math.max(20, Number(m.startSec) || (idx + 1) * 380);
          const e = Math.max(s + 32, Number(m.endSec) || s + 52);
          return {
            id: `viral-${Date.now()}-${idx}`,
            title: String(m.title || `Viral Moment #${idx + 1}`),
            hookLine: String(m.hookLine || ''),
            startSec: s,
            endSec: Math.min(totalDur, e),
            heatmapIntensity: Math.max(0.65, Math.min(0.99, Number(m.heatmapIntensity) || 0.88)),
            hookScore: Math.round(Math.max(78, Math.min(99, Number(m.hookScore) || 91))),
            retentionScore: Math.round(Math.max(78, Math.min(99, Number(m.retentionScore) || 90))),
            payoffScore: Math.round(Math.max(78, Math.min(99, Number(m.payoffScore) || 92))),
            deadAirSavedSec: Number((Number(m.deadAirSavedSec) || 5.4).toFixed(1)),
            transcriptExcerpt: String(m.transcriptExcerpt || ''),
            whyItHits: String(m.whyItHits || ''),
            framingMode: framingDefault || (idx % 2 === 0 ? 'motion-split' : 'ema-single'),
            overlayObject: VALID_CLIP_OBJECTS.includes(m.overlayObject as (typeof VALID_CLIP_OBJECTS)[number])
              ? m.overlayObject
              : VALID_CLIP_OBJECTS[idx % VALID_CLIP_OBJECTS.length],
            overlayHeadline: String(m.overlayHeadline || 'Key Moment'),
            overlayMetric: String(m.overlayMetric || '98% Peak'),
            captionsEnabled: captionsEnabled !== false,
            palettePolarity: m.palettePolarity === 'light' ? 'light' : 'dark',
          };
        }
      );

      const heatmap: number[] = Array.from({ length: 100 }, (_, i) => {
        let val = 0.16 + Math.sin(i * 0.19) * 0.05;
        for (const mom of moments) {
          const seg = Math.min(97, Math.max(2, (mom.startSec / totalDur) * 100));
          val += (mom.heatmapIntensity - 0.15) * Math.exp(-Math.pow((i - seg) / 2.7, 2));
        }
        return Number(Math.max(0.08, Math.min(1, val)).toFixed(3));
      });

      res.json({
        id: `clip-proj-${Date.now()}`,
        sourceTitle: String(parsed.sourceTitle || 'Analyzed YouTube Source'),
        sourceChannel: String(parsed.sourceChannel || 'External Channel'),
        sourceUrl: String(sourceUrl || 'https://www.youtube.com/watch?v=custom_source'),
        sourceDurationSec: totalDur,
        heatmap,
        moments,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to analyze viral clips.';
      res.status(500).json({ error: message });
    }
  });

  // 4. Static Rendered MP4 Serving (supports HTTP Range scrubbing in <video>)
  const rendersDir = path.resolve(__dirname, 'public/renders');
  await fs.mkdir(rendersDir, { recursive: true });
  app.use('/renders', express.static(rendersDir, { acceptRanges: true, maxAge: '1h' }));

  app.get('/api/demo-video', async (_req, res) => {
    try {
      const mp4Path = path.join(rendersDir, 'bangladesh-x-demo.mp4');
      const metaPath = path.join(rendersDir, 'bangladesh-x-demo.json');
      await fs.access(mp4Path);
      const raw = await fs.readFile(metaPath, 'utf8').catch(() => '');
      if (raw) {
        const meta = JSON.parse(raw);
        res.json({ available: true, ...meta });
        return;
      }
      const stat = await fs.stat(mp4Path);
      res.json({
        available: true,
        videoUrl: '/renders/bangladesh-x-demo.mp4',
        title: 'How to Make Real Internet Money from Bangladesh Using X (90-Day Plan)',
        durationSec: 120,
        width: 1280,
        height: 720,
        fps: 24,
        fileSizeBytes: stat.size,
        hasVoiceover: true,
        voiceName: 'Charon',
        renderedAt: stat.mtime.toISOString(),
        beatCount: 12,
      });
    } catch {
      res.json({ available: false });
    }
  });

  app.post('/api/render-video', async (req, res) => {
    try {
      const body = req.body ?? {};
      const blueprint: VideoBlueprint =
        body.blueprint && Array.isArray(body.blueprint.scenes) && body.blueprint.scenes.length > 0
          ? body.blueprint
          : createInitialBlueprint();
      const voiceName = typeof body.voiceName === 'string' && body.voiceName ? body.voiceName : 'Charon';
      const voiceStyle =
        typeof body.voiceStyle === 'string' && body.voiceStyle
          ? body.voiceStyle
          : 'Measured, grounded editorial documentary narrator with calm authority and natural cadence';
      const fps = Math.max(15, Math.min(30, Number(body.fps) || 24));
      const isVertical = blueprint.aspectRatio === '9:16';
      const width = isVertical ? 540 : 960;
      const height = isVertical ? 960 : 540;
      const hdMode = body.quality === '720p';
      const targetWidth = hdMode ? (isVertical ? 720 : 1280) : width;
      const targetHeight = hdMode ? (isVertical ? 1280 : 720) : height;
      const saveAsDemo = Boolean(body.saveAsDemo);

      const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const fileName = saveAsDemo ? 'bangladesh-x-demo.mp4' : `sovereign-${jobId}.mp4`;
      const outMp4Path = path.join(rendersDir, fileName);
      const videoUrl = `/renders/${fileName}`;

      const jobState: RenderJobState = {
        jobId,
        status: 'running',
        stage: 'Preparing voiceover & vector scene graph...',
        progress: 2,
      };
      renderJobs.set(jobId, jobState);

      // Run render asynchronously so HTTP never times out
      void (async () => {
        try {
          const result: RenderMp4Result = await renderBlueprintToMp4({
            blueprint,
            outputMp4Path: outMp4Path,
            voiceName,
            voiceStyle,
            fps,
            width: targetWidth,
            height: targetHeight,
            includeVoiceover: body.includeVoiceover !== false,
            onProgress: (stage, pct) => {
              const cur = renderJobs.get(jobId);
              if (cur) {
                cur.stage = stage;
                cur.progress = pct;
              }
            },
          });

          const meta = {
            videoUrl,
            title: blueprint.title,
            durationSec: result.durationSec,
            width: result.width,
            height: result.height,
            fps: result.fps,
            fileSizeBytes: result.fileSizeBytes,
            hasVoiceover: result.hasVoiceover,
            voiceName: result.voiceName,
            renderedAt: result.renderedAt,
            beatCount: result.syncedBlueprint.scenes.length,
          };

          if (saveAsDemo) {
            await fs.writeFile(
              path.join(rendersDir, 'bangladesh-x-demo.json'),
              JSON.stringify(meta, null, 2),
              'utf8'
            );
          }

          renderJobs.set(jobId, {
            jobId,
            status: 'done',
            stage: 'Completed MP4 render',
            progress: 100,
            videoUrl,
            meta,
            syncedBlueprint: result.syncedBlueprint,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'MP4 render failed.';
          renderJobs.set(jobId, {
            jobId,
            status: 'error',
            stage: 'Render failed',
            progress: 0,
            error: message,
          });
        }
      })();

      res.status(202).json({ jobId, status: 'running' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start video render.';
      res.status(500).json({ error: message });
    }
  });

  app.get('/api/render-jobs/:jobId', (req, res) => {
    const job = renderJobs.get(req.params.jobId);
    if (!job) {
      res.status(404).json({ error: 'Render job not found.' });
      return;
    }
    res.json(job);
  });

  if (isProduction) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    const mode = isProduction ? 'production' : 'development';
    console.log(`Sovereign Motion server listening on http://localhost:${PORT} (${mode})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
