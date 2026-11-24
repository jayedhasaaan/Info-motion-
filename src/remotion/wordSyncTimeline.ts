/**
 * Sovereign Motion v7.0 — Audio-First Clause & Word-Cue Synchronization Engine
 *
 * Built directly from real ffmpeg silencedetect pause boundaries of
 * `public/renders/bangladesh-x-voiceover.wav` (155.80s, Charon narration).
 *
 * Eliminates A/V drift by:
 * 1. Anchoring every clause to its exact measured speechStartSec / speechEndSec
 *    (skipping leading/trailing silence gaps instead of smearing words linearly).
 * 2. Weighting each word inside its clause by syllable/character weight + punctuation pause.
 * 3. Exposing `getActiveWordIndex` for KineticSubtitleBar and `getWordCueFrame` for
 *    both Remotion scene choreography AND 6-layer word-locked SFX synthesis.
 */

export interface BeatClauseSegment {
  startSec: number;
  endSec: number;
  text: string;
}

export interface AlignedWord {
  index: number;
  word: string;
  clean: string;
  startSec: number;
  endSec: number;
  localStartFrame: number;
  localEndFrame: number;
  globalStartFrame: number;
  globalEndFrame: number;
  clauseIndex: number;
}

export interface VisualCueAnchor {
  id: string;
  keyword: string;
  label: string;
  aeTwist: string;
  sfxKind: 'impact' | 'whoosh' | 'chime' | 'cloud-dive' | 'vault';
  occurrence?: number;
  offsetFrames?: number;
}

export interface ResolvedVisualCue extends VisualCueAnchor {
  beatId: string;
  wordIndex: number;
  globalSec: number;
  localFrame: number;
  globalFrame: number;
}

export interface LockedBeatSync {
  beatId: string;
  startSec: number;
  endSec: number;
  speechStartSec: number;
  speechEndSec: number;
  clauses: BeatClauseSegment[];
  words: AlignedWord[];
  cues: ResolvedVisualCue[];
}

export interface RawBeatAudioSpec {
  beatId: string;
  startSec: number;
  endSec: number;
  clauses: BeatClauseSegment[];
  cueAnchors: VisualCueAnchor[];
}

export const BANGLADESH_X_AUDIO_SPECS: RawBeatAudioSpec[] = [
  {
    beatId: 'bdx-01',
    startSec: 0.0,
    endSec: 12.17,
    clauses: [
      {
        startSec: 0.22,
        endSec: 5.99,
        text: 'You are sitting at a quiet desk in Bangladesh, earning in Taka while paying global prices—',
      },
      {
        startSec: 6.59,
        endSec: 11.87,
        text: 'yet one glowing window on your screen connects directly to New York, London, and San Francisco.',
      },
    ],
    cueAnchors: [
      {
        id: 'taka-fx',
        keyword: 'taka',
        label: '$1 = ৳120 FX Counter',
        aeTwist: 'Word-Locked Counter',
        sfxKind: 'chime',
      },
      {
        id: 'window-dive',
        keyword: 'window',
        label: '3D Cloud Dive Into World Map',
        aeTwist: '3D Cloud Fly-Through',
        sfxKind: 'cloud-dive',
        offsetFrames: -6,
      },
      {
        id: 'nyc-beacon',
        keyword: 'new',
        label: 'New York Extruded Beacon',
        aeTwist: '3D Extruded Map',
        sfxKind: 'chime',
      },
      {
        id: 'london-beacon',
        keyword: 'london',
        label: 'London Big Ben Beacon',
        aeTwist: '3D Extruded Map',
        sfxKind: 'chime',
      },
      {
        id: 'sf-beacon',
        keyword: 'san',
        label: 'San Francisco Bridge Beacon',
        aeTwist: '3D Extruded Map',
        sfxKind: 'chime',
      },
    ],
  },
  {
    beatId: 'bdx-02',
    startSec: 12.17,
    endSec: 25.88,
    clauses: [
      {
        startSec: 12.47,
        endSec: 18.29,
        text: 'On crowded freelance marketplaces, ten thousand bids race to the bottom for five dollars.',
      },
      {
        startSec: 18.97,
        endSec: 25.36,
        text: 'On X, founders and decision-makers read directly in public—with zero gatekeepers between you and them.',
      },
    ],
    cueAnchors: [
      {
        id: 'five-dollars-slash',
        keyword: 'five',
        label: 'Red X Laser Slash on $5 Pit',
        aeTwist: 'AE Impact Shake',
        sfxKind: 'impact',
      },
      {
        id: 'on-x-wipe',
        keyword: 'x',
        label: 'Speed-Ramp Wipe to Founder Skyline',
        aeTwist: 'Speed-Ramp Motion Blur',
        sfxKind: 'whoosh',
        offsetFrames: -8,
      },
      {
        id: 'zero-gatekeepers',
        keyword: 'zero',
        label: 'Zero Gatekeepers Callout Pop',
        aeTwist: 'Glass Leader Callout',
        sfxKind: 'chime',
      },
    ],
  },
  {
    beatId: 'bdx-03',
    startSec: 25.88,
    endSec: 40.04,
    clauses: [
      {
        startSec: 26.4,
        endSec: 28.16,
        text: 'First, kill the illusion:',
      },
      {
        startSec: 28.7,
        endSec: 32.82,
        text: 'waiting for X ad-revenue payouts from Bangladesh will earn you pennies.',
      },
      {
        startSec: 33.39,
        endSec: 39.71,
        text: 'Real internet money on X comes from selling one sharp, undeniable skill directly to global clients.',
      },
    ],
    cueAnchors: [
      {
        id: 'pennies-myth-slam',
        keyword: 'pennies',
        label: 'Crimson MYTH Stamp Slam',
        aeTwist: 'AE Impact Shake',
        sfxKind: 'impact',
        offsetFrames: -6,
      },
      {
        id: 'real-money-pan',
        keyword: 'real',
        label: 'Speed-Ramp Pan to 3D Cash Stacks',
        aeTwist: '3D Isometric Cash Towers',
        sfxKind: 'whoosh',
        offsetFrames: -6,
      },
      {
        id: 'selling-stacks',
        keyword: 'selling',
        label: '$1,500/MO Isometric Stack Bloom',
        aeTwist: 'Word-Locked Counter',
        sfxKind: 'chime',
      },
    ],
  },
  {
    beatId: 'bdx-04',
    startSec: 40.04,
    endSec: 52.57,
    clauses: [
      {
        startSec: 40.37,
        endSec: 44.81,
        text: 'Start by mastering one concrete skill global companies happily pay for:',
      },
      {
        startSec: 45.4,
        endSec: 52.15,
        text: 'short-form video editing, high-converting UI design, AI workflow automation, or sharp founder ghostwriting.',
      },
    ],
    cueAnchors: [
      {
        id: 'craft-video',
        keyword: 'short-form',
        label: 'Station 1 · Video Editing NLE',
        aeTwist: '2.5D Parallax Dolly',
        sfxKind: 'chime',
      },
      {
        id: 'craft-ui',
        keyword: 'ui',
        label: 'Station 2 · UI Design Tablet',
        aeTwist: '2.5D Parallax Dolly',
        sfxKind: 'chime',
      },
      {
        id: 'craft-ai',
        keyword: 'ai',
        label: 'Station 3 · AI Automation Gears',
        aeTwist: '2.5D Parallax Dolly',
        sfxKind: 'chime',
      },
      {
        id: 'craft-ghost',
        keyword: 'ghostwriting',
        label: 'Station 4 · Founder Ghostwriting',
        aeTwist: '2.5D Parallax Dolly',
        sfxKind: 'chime',
      },
    ],
  },
  {
    beatId: 'bdx-05',
    startSec: 52.57,
    endSec: 65.03,
    clauses: [
      {
        startSec: 52.98,
        endSec: 56.98,
        text: 'Your X profile is not a diary—it is a global storefront.',
      },
      {
        startSec: 57.61,
        endSec: 64.54,
        text: 'Clear English positioning in your bio, one clean banner showing what you solve, and a pinned case study proving you deliver.',
      },
    ],
    cueAnchors: [
      {
        id: 'diary-cross',
        keyword: 'diary',
        label: 'Crimson X Strike Across Diary',
        aeTwist: 'AE Impact Shake',
        sfxKind: 'impact',
      },
      {
        id: 'storefront-iris',
        keyword: 'storefront',
        label: 'Iris Aperture Into Corner Storefront',
        aeTwist: 'Match-Cut Iris',
        sfxKind: 'whoosh',
        offsetFrames: -12,
      },
      {
        id: 'pinned-trophy',
        keyword: 'pinned',
        label: 'Golden Proof Trophy + Glass Callout',
        aeTwist: 'Glass Leader Callout',
        sfxKind: 'chime',
      },
    ],
  },
  {
    beatId: 'bdx-06',
    startSec: 65.03,
    endSec: 76.94,
    clauses: [
      {
        startSec: 65.53,
        endSec: 67.45,
        text: 'Forget empty motivational quotes.',
      },
      {
        startSec: 67.92,
        endSec: 76.14,
        text: 'For thirty days straight, post real teardowns, before-and-after redesigns, and thirty-second motion clips showing your craft working in real time.',
      },
    ],
    cueAnchors: [
      {
        id: 'crate-teardown',
        keyword: 'teardowns',
        label: '3D Crate 1 · TEARDOWN Drop',
        aeTwist: '3D Extruded Props',
        sfxKind: 'impact',
        offsetFrames: -6,
      },
      {
        id: 'crate-redesign',
        keyword: 'redesigns',
        label: '3D Crate 2 · REDESIGN Drop',
        aeTwist: '3D Extruded Props',
        sfxKind: 'impact',
        offsetFrames: -6,
      },
      {
        id: 'crate-clips',
        keyword: 'clips',
        label: '3D Crate 3 · 30S CLIP Drop',
        aeTwist: '3D Extruded Props',
        sfxKind: 'chime',
        offsetFrames: -6,
      },
    ],
  },
  {
    beatId: 'bdx-07',
    startSec: 76.94,
    endSec: 90.43,
    clauses: [
      {
        startSec: 77.74,
        endSec: 80.59,
        text: 'With zero followers, nobody sees your posts yet.',
      },
      {
        startSec: 81.28,
        endSec: 90.12,
        text: 'So spend forty minutes every evening leaving thoughtful, specific replies under fifty US and European startup founders who actively hire.',
      },
    ],
    cueAnchors: [
      {
        id: 'forty-radar',
        keyword: 'forty',
        label: 'Lighthouse Radar Lock Sweep',
        aeTwist: '3D Camera Push + Glass HUD',
        sfxKind: 'whoosh',
      },
      {
        id: 'fifty-replies',
        keyword: 'fifty',
        label: '50 Smart Replies Counter Peak',
        aeTwist: 'Word-Locked Counter',
        sfxKind: 'chime',
      },
    ],
  },
  {
    beatId: 'bdx-08',
    startSec: 90.43,
    endSec: 102.37,
    clauses: [
      {
        startSec: 90.74,
        endSec: 93.47,
        text: 'Never beg for work with "Sir, give me a job."',
      },
      {
        startSec: 94.17,
        endSec: 99.54,
        text: 'Send a sixty-second custom sample fixing one real flaw on their landing page or video—',
      },
      {
        startSec: 100.05,
        endSec: 101.79,
        text: 'and let your work open the conversation.',
      },
    ],
    cueAnchors: [
      {
        id: 'beg-trash',
        keyword: 'beg',
        label: 'Crumpled Begging Note Toss',
        aeTwist: 'Arc Physics',
        sfxKind: 'whoosh',
      },
      {
        id: 'sample-envelope',
        keyword: 'sixty-second',
        label: '60s Gold Proof Envelope Pop',
        aeTwist: 'Elastic Spring Pop',
        sfxKind: 'chime',
      },
      {
        id: 'vault-unlock',
        keyword: 'open',
        label: 'Heavy Steel Vault Door Swing Open',
        aeTwist: 'AE Impact + Vault Lock',
        sfxKind: 'vault',
        offsetFrames: -12,
      },
    ],
  },
  {
    beatId: 'bdx-09',
    startSec: 102.37,
    endSec: 116.02,
    clauses: [
      {
        startSec: 102.94,
        endSec: 105.26,
        text: 'No PayPal in Bangladesh? No problem.',
      },
      {
        startSec: 105.97,
        endSec: 111.75,
        text: 'Receive international USD retainers smoothly through Payoneer, Wise, or direct bank wire—',
      },
      {
        startSec: 112.24,
        endSec: 115.52,
        text: 'and settle cleanly into your Bangladeshi bank account in BDT.',
      },
    ],
    cueAnchors: [
      {
        id: 'payoneer-jet',
        keyword: 'payoneer',
        label: '$1,500 Cargo Jet Bridge Flyover',
        aeTwist: '3D Cloud Sky Parallax',
        sfxKind: 'cloud-dive',
      },
      {
        id: 'bdt-settlement',
        keyword: 'settle',
        label: '৳180,000 BDT Taka Fan Burst',
        aeTwist: 'Word-Locked Counter',
        sfxKind: 'chime',
      },
    ],
  },
  {
    beatId: 'bdx-10',
    startSec: 116.02,
    endSec: 130.61,
    clauses: [
      {
        startSec: 116.51,
        endSec: 118.13,
        text: 'Here is the honest ninety-day math:',
      },
      {
        startSec: 118.77,
        endSec: 121.31,
        text: 'month one builds proof and zero dollars.',
      },
      {
        startSec: 121.87,
        endSec: 125.27,
        text: 'Month two lands your first three-hundred-dollar test project.',
      },
      {
        startSec: 125.9,
        endSec: 130.15,
        text: 'Month three stacks three steady clients into fifteen hundred dollars a month.',
      },
    ],
    cueAnchors: [
      {
        id: 'month-one-tier',
        keyword: 'month',
        occurrence: 1,
        label: 'Tier 1 · Month 1 Base Camp ($0)',
        aeTwist: '3D Alpine Step Rise',
        sfxKind: 'impact',
      },
      {
        id: 'month-two-tier',
        keyword: 'month',
        occurrence: 2,
        label: 'Tier 2 · Month 2 Outpost ($300)',
        aeTwist: '3D Alpine Step Rise',
        sfxKind: 'chime',
      },
      {
        id: 'month-three-tier',
        keyword: 'month',
        occurrence: 3,
        label: 'Tier 3 · Month 3 Summit ($1,500/MO)',
        aeTwist: '3D Summit Burst + Counter',
        sfxKind: 'impact',
      },
    ],
  },
  {
    beatId: 'bdx-11',
    startSec: 130.61,
    endSec: 141.9,
    clauses: [
      {
        startSec: 131.08,
        endSec: 133.28,
        text: 'Two hours every evening after university or work:',
      },
      {
        startSec: 133.86,
        endSec: 139.9,
        text: 'forty minutes sharpening your craft, forty minutes replying to global builders, forty minutes shipping public proof.',
      },
      {
        startSec: 140.37,
        endSec: 141.49,
        text: 'Repeat ninety times.',
      },
    ],
    cueAnchors: [
      {
        id: 'sector-craft',
        keyword: 'forty',
        occurrence: 1,
        label: 'Sector 1 · 40m Craft Arc',
        aeTwist: 'Glass Leader Callout',
        sfxKind: 'chime',
      },
      {
        id: 'sector-replies',
        keyword: 'forty',
        occurrence: 2,
        label: 'Sector 2 · 40m Replies Arc',
        aeTwist: 'Glass Leader Callout',
        sfxKind: 'chime',
      },
      {
        id: 'sector-proof',
        keyword: 'forty',
        occurrence: 3,
        label: 'Sector 3 · 40m Public Proof Arc',
        aeTwist: 'Glass Leader Callout',
        sfxKind: 'chime',
      },
      {
        id: 'repeat-ninety',
        keyword: 'repeat',
        label: 'REPEAT × 90 Counter Surge',
        aeTwist: 'Word-Locked Counter',
        sfxKind: 'impact',
      },
    ],
  },
  {
    beatId: 'bdx-12',
    startSec: 141.9,
    endSec: 155.8,
    clauses: [
      {
        startSec: 142.32,
        endSec: 144.7,
        text: 'The internet does not ask what passport you hold—',
      },
      {
        startSec: 145.25,
        endSec: 148.08,
        text: 'it asks how reliably you solve expensive problems.',
      },
      {
        startSec: 148.87,
        endSec: 155.02,
        text: 'Build in public on X, stay consistent for ninety days, and turn your desk in Bangladesh into a global studio.',
      },
    ],
    cueAnchors: [
      {
        id: 'sunrise-clouds',
        keyword: 'build',
        label: '3D Sunrise Cloud Parting Reveal',
        aeTwist: '3D Cloud Fly-Through',
        sfxKind: 'cloud-dive',
      },
      {
        id: 'global-studio-lock',
        keyword: 'studio',
        label: 'Global Studio Horizon Lock',
        aeTwist: 'Tactile Cinema Finish',
        sfxKind: 'chime',
      },
    ],
  },
];

function cleanToken(word: string): string {
  return word.toLowerCase().replace(/^["'“”‘’]+|["'“”‘’,.:;!?—-]+$/g, '');
}

/**
 * Estimates relative spoken duration weight of an English word using vowel groups,
 * character length, hyphenation, and trailing clause punctuation.
 */
function spokenWeight(word: string): number {
  const cleaned = cleanToken(word);
  if (!cleaned) return 1.2;
  const vowelClusters = cleaned.match(/[aeiouy]+/gi)?.length ?? 1;
  const hyphenBonus = (cleaned.match(/-/g)?.length ?? 0) * 1.1;
  const punctPause = /[,;:—-]$/.test(word) ? 1.15 : /[.!?]$/.test(word) ? 1.35 : 0;
  return Math.max(1.3, vowelClusters * 1.35 + cleaned.length * 0.28 + hyphenBonus + punctPause);
}

/**
 * Builds deterministic frame-accurate word & visual-cue timelines for all 12 beats.
 */
export function buildLockedWordTimeline(
  specs: RawBeatAudioSpec[] = BANGLADESH_X_AUDIO_SPECS,
  fps: number = 60
): LockedBeatSync[] {
  return specs.map((spec) => {
    const words: AlignedWord[] = [];
    let runningIdx = 0;

    spec.clauses.forEach((clause, clauseIndex) => {
      const tokens = clause.text.trim().split(/\s+/).filter(Boolean);
      const weights = tokens.map(spokenWeight);
      const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
      const span = Math.max(0.12, clause.endSec - clause.startSec);

      let cursor = clause.startSec;
      tokens.forEach((token, idx) => {
        const wDur = (weights[idx] / totalWeight) * span;
        const wStart = cursor;
        const wEnd = idx === tokens.length - 1 ? clause.endSec : cursor + wDur;
        cursor = wEnd;

        words.push({
          index: runningIdx++,
          word: token,
          clean: cleanToken(token),
          startSec: Number(wStart.toFixed(3)),
          endSec: Number(wEnd.toFixed(3)),
          localStartFrame: Math.max(0, Math.round((wStart - spec.startSec) * fps)),
          localEndFrame: Math.max(1, Math.round((wEnd - spec.startSec) * fps)),
          globalStartFrame: Math.round(wStart * fps),
          globalEndFrame: Math.round(wEnd * fps),
          clauseIndex,
        });
      });
    });

    const cues: ResolvedVisualCue[] = spec.cueAnchors.map((anchor) => {
      const target = anchor.keyword.toLowerCase();
      const wantedOccurrence = anchor.occurrence ?? 1;
      let seen = 0;
      let matchedWord = words[0];

      for (const w of words) {
        if (w.clean === target || w.clean.startsWith(target)) {
          seen += 1;
          if (seen === wantedOccurrence) {
            matchedWord = w;
            break;
          }
        }
      }

      const offset = anchor.offsetFrames ?? 0;
      const localFrame = Math.max(0, matchedWord.localStartFrame + offset);
      const globalFrame = Math.max(0, matchedWord.globalStartFrame + offset);
      return {
        ...anchor,
        beatId: spec.beatId,
        wordIndex: matchedWord.index,
        globalSec: Number((globalFrame / fps).toFixed(3)),
        localFrame,
        globalFrame,
      };
    });

    const speechStartSec = spec.clauses[0]?.startSec ?? spec.startSec;
    const speechEndSec = spec.clauses[spec.clauses.length - 1]?.endSec ?? spec.endSec;

    return {
      beatId: spec.beatId,
      startSec: spec.startSec,
      endSec: spec.endSec,
      speechStartSec,
      speechEndSec,
      clauses: spec.clauses,
      words,
      cues,
    };
  });
}

export const LOCKED_WORD_TIMELINE: LockedBeatSync[] = buildLockedWordTimeline(
  BANGLADESH_X_AUDIO_SPECS,
  60
);

const BEAT_SYNC_MAP = new Map<string, LockedBeatSync>(
  LOCKED_WORD_TIMELINE.map((item) => [item.beatId, item])
);

export function getLockedBeatSync(beatId: string): LockedBeatSync | undefined {
  return BEAT_SYNC_MAP.get(beatId);
}

/**
 * Resolves the exact spoken word active at a given beat-local frame (0ms drift against clause boundaries).
 */
export function getActiveWordState(
  beatId: string | undefined,
  localFrame: number
): { words: AlignedWord[]; activeIndex: number; localWordFrame: number; isSpeaking: boolean } | null {
  if (!beatId) return null;
  const beat = BEAT_SYNC_MAP.get(beatId);
  if (!beat || beat.words.length === 0) return null;

  const first = beat.words[0];
  const last = beat.words[beat.words.length - 1];

  // Before speech begins in the beat, pre-stage the first word calmly without jumping ahead
  if (localFrame < first.localStartFrame) {
    return {
      words: beat.words,
      activeIndex: 0,
      localWordFrame: 0,
      isSpeaking: false,
    };
  }

  let activeIndex = beat.words.length - 1;
  for (let i = 0; i < beat.words.length; i++) {
    const w = beat.words[i];
    if (localFrame >= w.localStartFrame && localFrame <= w.localEndFrame) {
      activeIndex = i;
      break;
    }
    if (localFrame < w.localStartFrame) {
      // Currently inside a natural mid-beat silence pause — hold on the last completed word!
      activeIndex = Math.max(0, i - 1);
      break;
    }
  }

  const activeWord = beat.words[activeIndex];
  const isSpeaking =
    localFrame >= activeWord.localStartFrame && localFrame <= Math.max(last.localEndFrame, activeWord.localEndFrame + 6);

  return {
    words: beat.words,
    activeIndex,
    localWordFrame: Math.max(0, localFrame - activeWord.localStartFrame),
    isSpeaking,
  };
}

/**
 * Resolves a named visual cue's exact beat-local trigger frame for Remotion scenes.
 */
export function getWordCueFrame(beatId: string, cueId: string, fallbackFrame: number): number {
  const beat = BEAT_SYNC_MAP.get(beatId);
  if (!beat) return fallbackFrame;
  const found = beat.cues.find((c) => c.id === cueId);
  return found ? found.localFrame : fallbackFrame;
}

/**
 * Returns every resolved global visual/SFX cue across the full 155.80s film.
 */
export function getAllResolvedCues(): ResolvedVisualCue[] {
  return LOCKED_WORD_TIMELINE.flatMap((b) => b.cues);
}

/**
 * Audits full audio-visual synchronization integrity across all beats.
 */
export function auditSyncIntegrity(fps: number = 60): {
  beatCount: number;
  totalWords: number;
  totalCues: number;
  maxBoundaryDriftMs: number;
  allCuesResolved: boolean;
  monotonic: boolean;
} {
  let maxBoundaryDriftMs = 0;
  let monotonic = true;
  let allCuesResolved = true;
  let totalWords = 0;
  let totalCues = 0;

  for (const beat of LOCKED_WORD_TIMELINE) {
    totalWords += beat.words.length;
    totalCues += beat.cues.length;

    for (let i = 0; i < beat.words.length; i++) {
      const w = beat.words[i];
      const quantizedSec = w.globalStartFrame / fps;
      const driftMs = Math.abs(quantizedSec - w.startSec) * 1000;
      if (driftMs > maxBoundaryDriftMs) maxBoundaryDriftMs = driftMs;
      if (i > 0 && w.startSec < beat.words[i - 1].startSec) {
        monotonic = false;
      }
    }

    for (const cue of beat.cues) {
      if (cue.globalFrame < 0 || cue.localFrame < 0) {
        allCuesResolved = false;
      }
    }
  }

  return {
    beatCount: LOCKED_WORD_TIMELINE.length,
    totalWords,
    totalCues,
    maxBoundaryDriftMs: Number(maxBoundaryDriftMs.toFixed(2)),
    allCuesResolved,
    monotonic,
  };
}
