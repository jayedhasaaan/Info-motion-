import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  INFOGRAPHICS_WORLD_PALETTES,
  type InfographicsWorldPalette,
} from '../engine/infographicsStyleBible';

export const FILM_FPS = 60;
export const TRANSITION_FRAMES = 24; // Silky 0.40s AE Graph Editor smooth transition

// Signature Infographics Show elastic inertia-bounce spring presets
export const SPRING_POP = { damping: 11.5, stiffness: 255, mass: 0.62 };
export const SPRING_SNAPPY = { damping: 15.5, stiffness: 215, mass: 0.75 };
export const SPRING_SMOOTH = { damping: 24, stiffness: 125, mass: 0.95 };
export const SPRING_SLAM = { damping: 10.5, stiffness: 335, mass: 0.52 };

export const FONT_DISPLAY = "'Montserrat', 'Plus Jakarta Sans', system-ui, sans-serif";
export const FONT_CONDENSED = "'Barlow Condensed', 'Montserrat', sans-serif";
export const FONT_BODY = "'Plus Jakarta Sans', 'Montserrat', system-ui, sans-serif";

export const OUTLINE_COLOR = '#18222F';

export interface BeatTimingSpec {
  index: number;
  id: string;
  chapter: string;
  headline: string;
  narration: string;
  startSec: number;
  endSec: number;
  polarity: 'dark' | 'light';
  worldId: keyof typeof INFOGRAPHICS_WORLD_PALETTES;
}

// Locked directly to ffmpeg silencedetect pause boundaries in bangladesh-x-voiceover.wav (155.80s)
export const BANGLADESH_X_BEATS: BeatTimingSpec[] = [
  {
    index: 0,
    id: 'bdx-01',
    chapter: '01 · DHAKA TO THE WORLD',
    headline: 'A Desk in Dhaka, Connected Globally',
    narration:
      'You are sitting at a quiet desk in Bangladesh, earning in Taka while paying global prices—yet one glowing window on your screen connects directly to New York, London, and San Francisco.',
    startSec: 0.0,
    endSec: 12.15,
    polarity: 'dark',
    worldId: 'dhaka-twilight',
  },
  {
    index: 1,
    id: 'bdx-02',
    chapter: '02 · SKIP THE $5 PIT',
    headline: 'Leave the Crowded Pit for Open Skyline',
    narration:
      'On crowded freelance marketplaces, ten thousand bids race to the bottom for five dollars. On X, founders and decision-makers read directly in public—with zero gatekeepers between you and them.',
    startSec: 12.15,
    endSec: 25.85,
    polarity: 'light',
    worldId: 'industrial-danger',
  },
  {
    index: 2,
    id: 'bdx-03',
    chapter: '03 · KILL THE AD MYTH',
    headline: 'Pennies vs Real Client Stacks',
    narration:
      'First, kill the illusion: waiting for X ad-revenue payouts from Bangladesh will earn you pennies. Real internet money on X comes from selling one sharp, undeniable skill directly to global clients.',
    startSec: 25.85,
    endSec: 40.0,
    polarity: 'light',
    worldId: 'studio-spotlight',
  },
  {
    index: 3,
    id: 'bdx-04',
    chapter: '04 · ONE SHARP CRAFT',
    headline: 'Four High-Value Global Skills',
    narration:
      'Start by mastering one concrete skill global companies happily pay for: short-form video editing, high-converting UI design, AI workflow automation, or sharp founder ghostwriting.',
    startSec: 40.0,
    endSec: 52.55,
    polarity: 'light',
    worldId: 'creative-workshop',
  },
  {
    index: 4,
    id: 'bdx-05',
    chapter: '05 · REAL STOREFRONT',
    headline: 'Not a Diary — A Corner Storefront',
    narration:
      'Your X profile is not a diary—it is a global storefront. Clear English positioning in your bio, one clean banner showing what you solve, and a pinned case study proving you deliver.',
    startSec: 52.55,
    endSec: 65.05,
    polarity: 'light',
    worldId: 'sunlit-street',
  },
  {
    index: 5,
    id: 'bdx-06',
    chapter: '06 · 30-DAY PROOF ENGINE',
    headline: 'Thirty Days of Public Craft',
    narration:
      'Forget empty motivational quotes. For thirty days straight, post real teardowns, before-and-after redesigns, and thirty-second motion clips showing your craft working in real time.',
    startSec: 65.05,
    endSec: 76.95,
    polarity: 'light',
    worldId: 'studio-spotlight',
  },
  {
    index: 6,
    id: 'bdx-07',
    chapter: '07 · SNIPER REPLIES',
    headline: 'Fifty Replies Across the Ocean',
    narration:
      'With zero followers, nobody sees your posts yet. So spend forty minutes every evening leaving thoughtful, specific replies under fifty US and European startup founders who actively hire.',
    startSec: 76.95,
    endSec: 90.45,
    polarity: 'dark',
    worldId: 'coastal-dusk',
  },
  {
    index: 7,
    id: 'bdx-08',
    chapter: '08 · VALUE-FIRST DM',
    headline: 'Send Proof That Unlocks the Vault',
    narration:
      'Never beg for work with "Sir, give me a job." Send a sixty-second custom sample fixing one real flaw on their landing page or video—and let your work open the conversation.',
    startSec: 90.45,
    endSec: 102.35,
    polarity: 'light',
    worldId: 'sunlit-street',
  },
  {
    index: 8,
    id: 'bdx-09',
    chapter: '09 · USD TO BANGLADESH',
    headline: 'No PayPal Needed — Clean Bank Settlement',
    narration:
      'No PayPal in Bangladesh? No problem. Receive international USD retainers smoothly through Payoneer, Wise, or direct bank wire—and settle cleanly into your Bangladeshi bank account in BDT.',
    startSec: 102.35,
    endSec: 116.0,
    polarity: 'light',
    worldId: 'cargo-skyline',
  },
  {
    index: 9,
    id: 'bdx-10',
    chapter: '10 · HONEST 90-DAY MATH',
    headline: 'Month 1: $0 · Month 2: $300 · Month 3: $1,500',
    narration:
      'Here is the honest ninety-day math: month one builds proof and zero dollars. Month two lands your first three-hundred-dollar test project. Month three stacks three steady clients into fifteen hundred dollars a month.',
    startSec: 116.0,
    endSec: 130.6,
    polarity: 'light',
    worldId: 'sunlit-street',
  },
  {
    index: 10,
    id: 'bdx-11',
    chapter: '11 · 2-HOUR EVENING ENGINE',
    headline: 'Two Focused Hours Every Single Night',
    narration:
      'Two hours every evening after university or work: forty minutes sharpening your craft, forty minutes replying to global builders, forty minutes shipping public proof. Repeat ninety times.',
    startSec: 130.6,
    endSec: 141.9,
    polarity: 'dark',
    worldId: 'coastal-dusk',
  },
  {
    index: 11,
    id: 'bdx-12',
    chapter: '12 · DAY 01 STARTS TONIGHT',
    headline: 'Turn Your Desk Into a Global Studio',
    narration:
      'The internet does not ask what passport you hold—it asks how reliably you solve expensive problems. Build in public on X, stay consistent for ninety days, and turn your desk in Bangladesh into a global studio.',
    startSec: 141.9,
    endSec: 155.85,
    polarity: 'dark',
    worldId: 'padma-sunrise',
  },
];

export function getWorldPalette(
  worldId: keyof typeof INFOGRAPHICS_WORLD_PALETTES,
  mode: 'light' | 'dark' | 'mix'
): InfographicsWorldPalette {
  const base = INFOGRAPHICS_WORLD_PALETTES[worldId] ?? INFOGRAPHICS_WORLD_PALETTES['sunlit-street'];
  if (mode === 'dark' && (worldId === 'studio-spotlight' || worldId === 'sunlit-street')) {
    return {
      ...base,
      skyTop: '#142238',
      skyBottom: '#243C5E',
      horizonFar: '#1C314F',
      horizonNear: '#12223A',
      calloutFill: '#FFD166',
      calloutStroke: '#0E1726',
    };
  }
  return base;
}

/**
 * Authentic After Effects 8-spoke radial ImpactBurst (tiny vector accent lines + diamonds).
 * Fires for ~18 frames on hero stamps, cash reveals, and major callout pops — zero blur overhead.
 */
export const ImpactBurst: React.FC<{
  x: number;
  y: number;
  triggerFrame: number;
  radius?: number;
  color?: string;
  secondaryColor?: string;
}> = ({
  x,
  y,
  triggerFrame,
  radius = 68,
  color = '#FFD166',
  secondaryColor = '#FFFFFF',
}) => {
  const frame = useCurrentFrame();
  const localF = frame - triggerFrame;
  if (localF < 0 || localF > 22) return null;

  const p = interpolate(localF, [0, 22], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const innerR = interpolate(p, [0, 1], [radius * 0.22, radius * 1.15]);
  const outerR = interpolate(p, [0, 0.45, 1], [radius * 0.42, radius * 1.18, radius * 1.24]);
  const opacity = interpolate(p, [0, 0.2, 0.72, 1], [0, 1, 0.85, 0]);
  const strokeW = interpolate(p, [0, 1], [5.5, 1.5]);

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity.toFixed(3)}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = Math.cos(rad) * innerR;
        const y1 = Math.sin(rad) * innerR;
        const x2 = Math.cos(rad) * outerR;
        const y2 = Math.sin(rad) * outerR;
        const isMain = idx % 2 === 0;
        return (
          <g key={deg}>
            <line
              x1={x1.toFixed(1)}
              y1={y1.toFixed(1)}
              x2={x2.toFixed(1)}
              y2={y2.toFixed(1)}
              stroke={OUTLINE_COLOR}
              strokeWidth={strokeW + 2.5}
              strokeLinecap="round"
            />
            <line
              x1={x1.toFixed(1)}
              y1={y1.toFixed(1)}
              x2={x2.toFixed(1)}
              y2={y2.toFixed(1)}
              stroke={isMain ? color : secondaryColor}
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </g>
  );
};

/**
 * Brief 2.2-second animated broadcast Chapter Sliver that glides smoothly in when a beat begins
 * and exits cleanly so it never clutters the illustrated frame.
 */
export const ChapterSliver: React.FC<{
  chapter: string;
}> = ({ chapter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < 6 || frame > 142) return null;

  const enter = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 16, stiffness: 220, mass: 0.7 },
  });
  const exit = interpolate(frame, [118, 140], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tx = (1 - enter) * -280 - exit * 320;
  const opacity = Math.min(1, enter * 1.4) * (1 - exit);

  return (
    <div
      style={{
        position: 'absolute',
        top: 22,
        left: 26,
        zIndex: 35,
        pointerEvents: 'none',
        transform: `translate3d(${tx.toFixed(1)}px, 0, 0)`,
        opacity: opacity.toFixed(3),
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(18, 28, 42, 0.88)',
        borderLeft: '4px solid #F5B82E',
        borderRadius: '0 6px 6px 0',
        padding: '6px 14px 6px 12px',
        boxShadow: '0 4px 0 rgba(14, 21, 31, 0.45)',
      }}
    >
      <span
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: '0.09em',
          color: '#FFFFFF',
          textTransform: 'uppercase',
        }}
      >
        {chapter}
      </span>
    </div>
  );
};

/**
 * Floating open-sky bold kinetic callout (The Infographics Show Ultra style — ZERO box borders!)
 * Enhanced with elastic squash-and-stretch settle, AE ImpactBurst spark accent, living float, and accent underline.
 */
export const FloatingCallout: React.FC<{
  x: number;
  y: number;
  text: string;
  subtext?: string;
  size?: number;
  fill?: string;
  stroke?: string;
  delayFrames?: number;
  align?: 'start' | 'middle' | 'end';
  withBurst?: boolean;
}> = ({
  x,
  y,
  text,
  subtext,
  size = 54,
  fill = '#FFFFFF',
  stroke = OUTLINE_COLOR,
  delayFrames = 8,
  align = 'middle',
  withBurst,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localF = Math.max(0, frame - delayFrames);
  const pop = spring({ frame: localF, fps, config: SPRING_POP });
  const ty = (1 - pop) * 28;

  // Subtle squash-and-stretch during the first 24 frames of entrance + calm breathing float after
  const settleEnergy = Math.exp(-localF / 12) * Math.sin(localF * 0.45);
  const sx = Math.max(0.001, pop * (1 + settleEnergy * 0.08));
  const sy = Math.max(0.001, pop * (1 - settleEnergy * 0.06));
  const floatY = Math.sin(localF * 0.045) * 2.2;

  // Subtle editorial accent underline sweeps smoothly under hero callouts
  const underlineW = Math.min(220, Math.max(72, text.length * size * 0.42));
  const underlineP = interpolate(localF, [10, 30], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineStartX = align === 'start' ? 0 : align === 'end' ? -underlineW : -underlineW / 2;
  const showBurst = withBurst ?? (size >= 52 && align === 'middle');

  return (
    <g>
      {showBurst && (
        <ImpactBurst
          x={x}
          y={y - size * 0.28}
          triggerFrame={delayFrames + 2}
          radius={Math.min(95, size * 1.35)}
          color={fill === '#FFD166' ? '#2AD08E' : '#FFD166'}
        />
      )}
      <g
        transform={`translate(${x}, ${(y + ty + floatY).toFixed(2)}) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`}
        opacity={Math.min(1, pop * 1.45)}
      >
        {/* Crisp hard flat drop-shadow copy */}
        <text
          x={4}
          y={5.5}
          textAnchor={align}
          fontFamily={FONT_DISPLAY}
          fontWeight={900}
          fontSize={size}
          fill="rgba(16, 24, 36, 0.36)"
          letterSpacing="-0.02em"
        >
          {text}
        </text>
        {/* Outlined hero typography floating freely in open air */}
        <text
          x={0}
          y={0}
          textAnchor={align}
          fontFamily={FONT_DISPLAY}
          fontWeight={900}
          fontSize={size}
          fill={fill}
          stroke={stroke}
          strokeWidth={Math.max(5.5, size * 0.135)}
          paintOrder="stroke fill"
          strokeLinejoin="round"
          letterSpacing="-0.02em"
        >
          {text}
        </text>
        {/* Crisp animated accent underline bar (when no subtext sits right beneath) */}
        {!subtext && size >= 44 && underlineP > 0.02 && (
          <rect
            x={lineStartX}
            y={11}
            width={underlineW * underlineP}
            height={5}
            rx={2.5}
            fill={fill === '#FFD166' ? '#2AD08E' : '#FFD166'}
            stroke={stroke}
            strokeWidth={2}
          />
        )}
        {subtext && (
          <text
            x={0}
            y={size * 0.54}
            textAnchor={align}
            fontFamily={FONT_DISPLAY}
            fontWeight={800}
            fontSize={Math.max(18, size * 0.36)}
            fill="#FFD166"
            stroke={stroke}
            strokeWidth={4.5}
            paintOrder="stroke fill"
            strokeLinejoin="round"
            letterSpacing="0.06em"
          >
            {subtext}
          </text>
        )}
      </g>
    </g>
  );
};

/**
 * Reusable flat-vector drifting cloud bank with dual-depth parallax speed for 2.5D skies.
 */
export const DriftingClouds: React.FC<{
  frame: number;
  tint?: string;
  opacity?: number;
  speed?: number;
}> = ({ frame, tint = '#FFFFFF', opacity = 0.85, speed = 0.42 }) => {
  const clouds = [
    { base: 140, y: 112, s: 1.08, spd: 1.05, op: 1 },
    { base: 560, y: 78, s: 0.78, spd: 0.65, op: 0.78 },
    { base: 980, y: 130, s: 1.18, spd: 1.28, op: 0.95 },
    { base: 1340, y: 94, s: 0.88, spd: 0.82, op: 0.84 },
  ];
  return (
    <g opacity={opacity}>
      {clouds.map((c, i) => {
        const cx = ((c.base + frame * speed * c.spd) % 1580) - 170;
        const bob = Math.sin(frame * 0.02 + i * 1.4) * 2.5;
        return (
          <g
            key={i}
            opacity={c.op}
            transform={`translate(${cx.toFixed(1)}, ${(c.y + bob).toFixed(1)}) scale(${c.s})`}
          >
            <path
              d="M -68 18 Q -70 -6 -44 -8 Q -34 -34 -4 -30 Q 22 -42 42 -16 Q 68 -14 68 10 Q 68 22 52 22 L -56 22 Q -68 22 -68 18 Z"
              fill={tint}
            />
          </g>
        );
      })}
    </g>
  );
};

/**
 * Lightweight cinema atmosphere layer (subtle drifting sunlit motes, editorial + sparkles & key-light shaft).
 * Uses 100% pure vector opacity primitives (zero CSS blur) so 60fps renders remain blazing fast.
 */
export const AmbientAtmosphere: React.FC<{
  frame: number;
  warm?: boolean;
}> = ({ frame, warm = true }) => {
  const motes = [
    { x: 180, y: 180, r: 3.0, spx: 0.35, spy: -0.22, ph: 0.2, kind: 'dot' as const },
    { x: 460, y: 290, r: 2.5, spx: 0.24, spy: -0.18, ph: 1.4, kind: 'plus' as const },
    { x: 760, y: 160, r: 3.4, spx: 0.42, spy: -0.25, ph: 2.6, kind: 'dot' as const },
    { x: 1060, y: 240, r: 2.8, spx: 0.3, spy: -0.2, ph: 3.9, kind: 'plus' as const },
  ];
  const moteColor = warm ? '#FFF5D6' : '#CFE9FF';

  return (
    <svg
      viewBox="0 0 1280 720"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* Crisp subtle sunlit key-light shaft (pure solid low-opacity polygon = instant render) */}
      <polygon points="0,0 440,0 140,720 0,720" fill={moteColor} opacity={0.045} />

      {/* Gently drifting ambient atmospheric motes & editorial sparkles */}
      {motes.map((m, idx) => {
        const mx = (m.x + frame * m.spx) % 1280;
        const my = (((m.y + frame * m.spy) % 600) + 600) % 600;
        const pulse = 0.22 + 0.2 * Math.sin(frame * 0.055 + m.ph);
        if (m.kind === 'plus') {
          return (
            <g
              key={idx}
              transform={`translate(${mx.toFixed(1)}, ${my.toFixed(1)}) rotate(${((frame * 0.4 + idx * 30) % 360).toFixed(1)})`}
              opacity={pulse.toFixed(3)}
            >
              <line x1={-5} y1={0} x2={5} y2={0} stroke={moteColor} strokeWidth={2} strokeLinecap="round" />
              <line x1={0} y1={-5} x2={0} y2={5} stroke={moteColor} strokeWidth={2} strokeLinecap="round" />
            </g>
          );
        }
        return (
          <circle
            key={idx}
            cx={mx.toFixed(1)}
            cy={my.toFixed(1)}
            r={m.r}
            fill={moteColor}
            opacity={pulse.toFixed(3)}
          />
        );
      })}
    </svg>
  );
};

const POWER_WORD_PATTERN =
  /^(\$[\d,.]+|taka|usd|bdt|x|bangladesh|ninety|thirty|fifty|five|three-hundred-dollar|fifteen|hundred|payoneer|wise|storefront|global|proof|real|zero)\b/i;

/**
 * Authentic Infographics Show broadcast subtitles:
 * ZERO dark floating pill box — crisp bold outlined typography with semantic power-word accents
 * and generous 14px spacing so popped active words never crowd neighbors.
 */
export const KineticSubtitleBar: React.FC<{
  narration: string;
  durationInFrames: number;
  enabled: boolean;
}> = ({ narration, durationInFrames, enabled }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!enabled) return null;
  const words = narration.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return null;

  const speechFrames = Math.max(30, durationInFrames * 0.93);
  const progress = Math.max(0, Math.min(0.999, frame / speechFrames));
  const activeIdx = Math.min(words.length - 1, Math.floor(progress * words.length));

  const groupSize = 6;
  const groupStart = Math.floor(activeIdx / groupSize) * groupSize;
  const chunk = words.slice(groupStart, groupStart + groupSize);

  const wordDuration = speechFrames / words.length;
  const localWordFrame = Math.max(0, frame - activeIdx * wordDuration);
  const pop = spring({
    frame: localWordFrame,
    fps,
    config: { damping: 14, stiffness: 300, mass: 0.42 },
  });

  const strokeShadow =
    '-2.5px -2.5px 0 #141D29, 2.5px -2.5px 0 #141D29, -2.5px 2.5px 0 #141D29, 2.5px 2.5px 0 #141D29, 0 4px 0 #141D29';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 24,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '4px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 14,
          maxWidth: '90%',
        }}
      >
        {chunk.map((word, idx) => {
          const globalIdx = groupStart + idx;
          const isCurrent = globalIdx === activeIdx;
          const isSpoken = globalIdx < activeIdx;
          const cleanToken = word.replace(/^["'“”‘’]+|["'“”‘’,.:;!?—-]+$/g, '');
          const isPowerWord = POWER_WORD_PATTERN.test(cleanToken);
          const activeColor = isPowerWord ? '#2AD08E' : '#FFD166';
          return (
            <span
              key={`${groupStart}-${idx}`}
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: '-0.01em',
                color: isCurrent ? activeColor : isSpoken ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                textShadow: strokeShadow,
                transform: isCurrent
                  ? `scale(${(0.98 + pop * 0.12).toFixed(3)}) translateY(${(-pop * 3.0).toFixed(1)}px)`
                  : 'scale(1)',
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Organic documentary camera breathing transform (AE ease-in-out + gentle micro-float so every frame breathes smoothly).
 */
export function getCameraTransform(
  frame: number,
  durationInFrames: number,
  mode: 'push' | 'pull' | 'pan-right' | 'pan-left'
): string {
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.bezier(0.37, 0, 0.63, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Subtle documentary organic breathing micro-drift (never dizzy, always alive)
  const breathY = Math.sin(frame * 0.022) * 2.6;
  const breathRot = Math.sin(frame * 0.015) * 0.16;

  if (mode === 'push') {
    const s = 1.0 + p * 0.072;
    return `translate(640, ${(360 + breathY).toFixed(2)}) rotate(${breathRot.toFixed(3)}) scale(${s.toFixed(4)}) translate(-640, -360)`;
  }
  if (mode === 'pull') {
    const s = 1.075 - p * 0.072;
    return `translate(640, ${(360 + breathY).toFixed(2)}) rotate(${(-breathRot).toFixed(3)}) scale(${s.toFixed(4)}) translate(-640, -360)`;
  }
  if (mode === 'pan-right') {
    const tx = 20 - p * 40;
    return `translate(${tx.toFixed(2)}, ${breathY.toFixed(2)}) translate(640, 360) scale(1.045) translate(-640, -360)`;
  }
  const tx = -20 + p * 40;
  return `translate(${tx.toFixed(2)}, ${breathY.toFixed(2)}) translate(640, 360) scale(1.045) translate(-640, -360)`;
}
