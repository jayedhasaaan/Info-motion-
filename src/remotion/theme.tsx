import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  INFOGRAPHICS_WORLD_PALETTES,
  type InfographicsWorldPalette,
} from '../engine/infographicsStyleBible';

export const FILM_FPS = 60;
export const TRANSITION_FRAMES = 24; // Silky 0.40s AE Graph Editor smooth transition

// Signature Infographics Show elastic inertia-bounce spring presets
export const SPRING_POP = { damping: 12.5, stiffness: 250, mass: 0.62 };
export const SPRING_SNAPPY = { damping: 16, stiffness: 220, mass: 0.72 };
export const SPRING_SMOOTH = { damping: 24, stiffness: 125, mass: 0.95 };
export const SPRING_SLAM = { damping: 10.5, stiffness: 340, mass: 0.52 };

export const FONT_DISPLAY = "'Montserrat', 'Plus Jakarta Sans', system-ui, sans-serif";
export const FONT_CONDENSED = "'Barlow Condensed', 'Montserrat', sans-serif";
export const FONT_BODY = "'Plus Jakarta Sans', 'Montserrat', system-ui, sans-serif";

// Retained strictly for subtle UI accents & backward exports — v6.0 worlds are LINELESS split-shaded!
export const OUTLINE_COLOR = '#121C2B';

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
      skyTop: '#101E34',
      skyBottom: '#1F3A60',
      horizonFar: '#162C4B',
      horizonNear: '#0D1E36',
      calloutFill: '#FFD166',
      calloutStroke: '#0B1320',
    };
  }
  return base;
}

/**
 * Decaying After Effects camera impact shake helper for slams, stamps, and reveals.
 */
export function getImpactShake(frame: number, triggerFrame: number, intensity = 14): { x: number; y: number } {
  const local = frame - triggerFrame;
  if (local < 0 || local > 26) return { x: 0, y: 0 };
  const decay = Math.exp(-local / 7.5);
  return {
    x: Math.sin(local * 2.7) * intensity * decay,
    y: Math.cos(local * 3.4) * intensity * 0.55 * decay,
  };
}

/**
 * Authentic After Effects 12-spoke lineless geometric ImpactBurst (crisp editorial rays + sparks).
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
  radius = 74,
  color = '#FFD166',
  secondaryColor = '#FFFFFF',
}) => {
  const frame = useCurrentFrame();
  const localF = frame - triggerFrame;
  if (localF < 0 || localF > 24) return null;

  const p = interpolate(localF, [0, 24], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const innerR = interpolate(p, [0, 1], [radius * 0.25, radius * 1.18]);
  const outerR = interpolate(p, [0, 0.42, 1], [radius * 0.48, radius * 1.24, radius * 1.3]);
  const opacity = interpolate(p, [0, 0.18, 0.72, 1], [0, 1, 0.85, 0]);
  const strokeW = interpolate(p, [0, 1], [5.2, 1.2]);
  const ringR = interpolate(p, [0, 1], [radius * 0.2, radius * 1.05]);

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity.toFixed(3)}>
      <circle
        r={ringR.toFixed(1)}
        fill="none"
        stroke={color}
        strokeWidth={(strokeW * 0.65).toFixed(2)}
        opacity={0.55}
      />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        const isMain = idx % 2 === 0;
        const r1 = isMain ? innerR : innerR * 0.82;
        const r2 = isMain ? outerR : outerR * 0.84;
        return (
          <line
            key={deg}
            x1={(Math.cos(rad) * r1).toFixed(1)}
            y1={(Math.sin(rad) * r1).toFixed(1)}
            x2={(Math.cos(rad) * r2).toFixed(1)}
            y2={(Math.sin(rad) * r2).toFixed(1)}
            stroke={isMain ? color : secondaryColor}
            strokeWidth={isMain ? strokeW : strokeW * 0.65}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

/**
 * Sleek 2.3-second broadcast Chapter Sliver that wipes in cleanly at the top-left of each beat.
 */
export const ChapterSliver: React.FC<{
  chapter: string;
}> = ({ chapter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < 5 || frame > 148) return null;

  const enter = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 18, stiffness: 230, mass: 0.68 },
  });
  const exit = interpolate(frame, [122, 146], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tx = (1 - enter) * -260 - exit * 300;
  const opacity = Math.min(1, enter * 1.45) * (1 - exit);

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
        background: 'rgba(11, 18, 30, 0.78)',
        borderLeft: '4px solid #F5B82E',
        borderRadius: '0 4px 4px 0',
        padding: '6px 14px 6px 12px',
        boxShadow: '0 6px 18px rgba(4, 9, 18, 0.32)',
      }}
    >
      <span
        style={{
          fontFamily: FONT_CONDENSED,
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: '#F8FAFC',
          textTransform: 'uppercase',
        }}
      >
        {chapter}
      </span>
    </div>
  );
};

/**
 * v6.0 Authentic Infographics Show Broadcast Headline:
 * ZERO chunky cartoon black bubble outlines — razor-sharp condensed/display editorial typography
 * with crisp directional cinema shadow, smooth track-matte rise, and animated accent bar.
 */
export const FloatingCallout: React.FC<{
  x: number;
  y: number;
  text: string;
  subtext?: string;
  size?: number;
  fill?: string;
  accent?: string;
  delayFrames?: number;
  align?: 'start' | 'middle' | 'end';
  withBurst?: boolean;
  darkBackdrop?: boolean;
}> = ({
  x,
  y,
  text,
  subtext,
  size = 54,
  fill = '#FFFFFF',
  accent,
  delayFrames = 8,
  align = 'middle',
  withBurst,
  darkBackdrop = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localF = Math.max(0, frame - delayFrames);
  const pop = spring({ frame: localF, fps, config: SPRING_POP });
  const ty = (1 - pop) * 26;
  const floatY = Math.sin(localF * 0.04) * 1.8;

  const accentColor = accent ?? (fill === '#FFD166' || fill === '#F5B82E' ? '#2AD08E' : '#F5B82E');
  const barW = Math.min(240, Math.max(64, text.length * size * 0.36));
  const barP = interpolate(localF, [6, 26], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const barX = align === 'start' ? 0 : align === 'end' ? -barW : -barW / 2;
  const showBurst = withBurst ?? false;
  const shadowColor = darkBackdrop ? 'rgba(6, 11, 20, 0.52)' : 'rgba(12, 20, 34, 0.16)';

  return (
    <g>
      {showBurst && (
        <ImpactBurst
          x={x}
          y={y - size * 0.25}
          triggerFrame={delayFrames + 2}
          radius={Math.min(92, size * 1.3)}
          color={accentColor}
        />
      )}
      <g
        transform={`translate(${x}, ${(y + ty + floatY).toFixed(2)})`}
        opacity={Math.min(1, pop * 1.45)}
      >
        {/* Clean directional broadcast shadow (NO cartoon bubble stroke!) */}
        <text
          x={0}
          y={4}
          textAnchor={align}
          fontFamily={FONT_CONDENSED}
          fontWeight={800}
          fontSize={size * 1.12}
          fill={shadowColor}
          letterSpacing="0.02em"
        >
          {text}
        </text>
        {/* Crisp primary broadcast headline */}
        <text
          x={0}
          y={0}
          textAnchor={align}
          fontFamily={FONT_CONDENSED}
          fontWeight={800}
          fontSize={size * 1.12}
          fill={fill}
          letterSpacing="0.02em"
        >
          {text}
        </text>

        {/* Sleek animated editorial rule */}
        {barP > 0.02 && (
          <rect
            x={barX}
            y={10}
            width={barW * barP}
            height={4}
            rx={2}
            fill={accentColor}
          />
        )}

        {subtext && (
          <>
            <text
              x={0}
              y={size * 0.48 + 14}
              textAnchor={align}
              fontFamily={FONT_BODY}
              fontWeight={800}
              fontSize={Math.max(15, size * 0.28)}
              fill={shadowColor}
              letterSpacing="0.14em"
            >
              {subtext}
            </text>
            <text
              x={0}
              y={size * 0.48 + 12}
              textAnchor={align}
              fontFamily={FONT_BODY}
              fontWeight={800}
              fontSize={Math.max(15, size * 0.28)}
              fill={darkBackdrop ? '#FFD166' : '#334155'}
              letterSpacing="0.14em"
            >
              {subtext}
            </text>
          </>
        )}
      </g>
    </g>
  );
};

/**
 * Signature Infographics Show Animated Leader-Line Pointer:
 * Pulsing target node -> crisp 45-degree elbow + horizontal rule -> bold condensed stat in open air!
 */
export const LeaderCallout: React.FC<{
  targetX: number;
  targetY: number;
  elbowX: number;
  elbowY: number;
  endX: number;
  label: string;
  sublabel?: string;
  accent?: string;
  textColor?: string;
  delayFrames?: number;
}> = ({
  targetX,
  targetY,
  elbowX,
  elbowY,
  endX,
  label,
  sublabel,
  accent = '#FFD166',
  textColor = '#FFFFFF',
  delayFrames = 14,
}) => {
  const frame = useCurrentFrame();
  const localF = Math.max(0, frame - delayFrames);
  const lineP = interpolate(localF, [0, 22], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textP = interpolate(localF, [14, 30], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (localF <= 0) return null;

  const seg1P = Math.min(1, lineP * 2);
  const seg2P = Math.max(0, (lineP - 0.5) * 2);
  const curElbowX = targetX + (elbowX - targetX) * seg1P;
  const curElbowY = targetY + (elbowY - targetY) * seg1P;
  const curEndX = elbowX + (endX - elbowX) * seg2P;
  const alignRight = endX >= elbowX;
  const pulse = 9 + Math.sin(frame * 0.14) * 3.5;

  return (
    <g>
      {/* Pulsing Target Node */}
      <circle cx={targetX} cy={targetY} r={pulse} fill={accent} opacity={0.26} />
      <circle cx={targetX} cy={targetY} r={5} fill={accent} />

      {/* Crisp Vector Elbow Leader Line */}
      <line
        x1={targetX}
        y1={targetY}
        x2={curElbowX}
        y2={curElbowY}
        stroke={accent}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {seg2P > 0 && (
        <line
          x1={elbowX}
          y1={elbowY}
          x2={curEndX}
          y2={elbowY}
          stroke={accent}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )}

      {/* Clean Floating Broadcast Label Above Leader Rule */}
      {textP > 0.01 && (
        <g
          transform={`translate(${endX}, ${(elbowY - 10 + (1 - textP) * 8).toFixed(1)})`}
          opacity={textP}
        >
          <text
            x={0}
            y={2}
            textAnchor={alignRight ? 'end' : 'start'}
            fontFamily={FONT_CONDENSED}
            fontWeight={800}
            fontSize={30}
            fill="rgba(6, 11, 20, 0.45)"
          >
            {label}
          </text>
          <text
            x={0}
            y={0}
            textAnchor={alignRight ? 'end' : 'start'}
            fontFamily={FONT_CONDENSED}
            fontWeight={800}
            fontSize={30}
            fill={textColor}
          >
            {label}
          </text>
          {sublabel && (
            <>
              <text
                x={0}
                y={27.5}
                textAnchor={alignRight ? 'end' : 'start'}
                fontFamily={FONT_BODY}
                fontWeight={700}
                fontSize={12}
                fill="rgba(6, 11, 20, 0.55)"
                letterSpacing="0.1em"
              >
                {sublabel}
              </text>
              <text
                x={0}
                y={26}
                textAnchor={alignRight ? 'end' : 'start'}
                fontFamily={FONT_BODY}
                fontWeight={700}
                fontSize={12}
                fill={accent}
                letterSpacing="0.1em"
              >
                {sublabel}
              </text>
            </>
          )}
        </g>
      )}
    </g>
  );
};

/**
 * Reusable Lineless Split-Shaded Architectural Skyscraper (Infographics Show Broadcast Craft):
 * Lit front facade + 3D shaded side return + cornice cap + reflective window grid + rooftop spire!
 */
export const SplitBuilding: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  litColor: string;
  shadeColor: string;
  windowColor?: string;
  litWindowColor?: string;
  frame?: number;
  litThreshold?: number;
  spire?: boolean;
}> = ({
  x,
  y,
  w,
  h,
  litColor,
  shadeColor,
  windowColor = 'rgba(255,255,255,0.16)',
  litWindowColor = '#FFD166',
  frame = 0,
  litThreshold = 9999,
  spire = false,
}) => {
  const sideW = Math.round(w * 0.24);
  const frontW = w - sideW;
  const cols = Math.max(2, Math.floor((frontW - 18) / 22));
  const rows = Math.max(3, Math.floor((h - 36) / 28));

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Rooftop Penthouse & Spire */}
      {spire && (
        <>
          <rect x={frontW * 0.25} y={-14} width={frontW * 0.5} height={14} fill={shadeColor} />
          <line x1={frontW * 0.5} y1={-14} x2={frontW * 0.5} y2={-48} stroke={litColor} strokeWidth={3} />
          <circle cx={frontW * 0.5} cy={-48} r={3.5} fill="#FF5A5F" opacity={0.55 + 0.45 * Math.sin(frame * 0.12)} />
        </>
      )}
      {/* Sunlit Front Facade */}
      <rect x={0} y={0} width={frontW} height={h} fill={litColor} />
      {/* 3D Shaded Right Return Plane */}
      <rect x={frontW} y={0} width={sideW} height={h} fill={shadeColor} />
      {/* Crisp Top Cornice Highlight */}
      <rect x={-3} y={0} width={w + 6} height={6} fill={litColor} opacity={0.95} />
      <rect x={0} y={6} width={w} height={3} fill="rgba(0,0,0,0.18)" />
      {/* Diagonal Glass Sheen Across Facade */}
      <polygon points={`0,10 ${frontW},10 ${frontW},${Math.min(h, 90)} 0,${Math.min(h, 150)}`} fill="#FFFFFF" opacity={0.07} />

      {/* Crisp Architectural Window Grid */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const wx = 12 + c * ((frontW - 24) / cols);
          const wy = 20 + r * 26;
          const idx = r * cols + c;
          const isWarm = (idx * 7 + Math.round(x)) % 5 === 0 || frame > litThreshold + idx * 14;
          return (
            <rect
              key={`${r}-${c}`}
              x={wx}
              y={wy}
              width={11}
              height={16}
              rx={1.5}
              fill={isWarm ? litWindowColor : windowColor}
              opacity={isWarm ? 0.85 + 0.15 * Math.sin(frame * 0.06 + idx) : 0.72}
            />
          );
        })
      )}
    </g>
  );
};

/**
 * Authentic Infographics Show Two-Tone Lineless Flat-Bottomed Cumulus Clouds.
 */
export const DriftingClouds: React.FC<{
  frame: number;
  tint?: string;
  shadeTint?: string;
  opacity?: number;
  speed?: number;
}> = ({ frame, tint = '#FFFFFF', shadeTint, opacity = 0.88, speed = 0.42 }) => {
  const clouds = [
    { base: 140, y: 168, s: 1.05, spd: 1.05, op: 0.92 },
    { base: 560, y: 148, s: 0.78, spd: 0.65, op: 0.7 },
    { base: 980, y: 182, s: 1.12, spd: 1.26, op: 0.88 },
    { base: 1340, y: 156, s: 0.86, spd: 0.84, op: 0.78 },
  ];
  const under = shadeTint ?? 'rgba(30, 58, 95, 0.14)';

  return (
    <g opacity={opacity}>
      {clouds.map((c, i) => {
        const cx = ((c.base + frame * speed * c.spd) % 1620) - 180;
        const bob = Math.sin(frame * 0.018 + i * 1.4) * 2.4;
        return (
          <g
            key={i}
            opacity={c.op}
            transform={`translate(${cx.toFixed(1)}, ${(c.y + bob).toFixed(1)}) scale(${c.s})`}
          >
            {/* Main sunlit fluffy silhouette (LINELESS!) */}
            <path
              d="M -78 20 Q -80 -6 -48 -8 Q -36 -38 -4 -32 Q 24 -46 46 -18 Q 76 -16 76 10 Q 76 22 58 22 L -64 22 Q -78 22 -78 20 Z"
              fill={tint}
            />
            {/* Crisp flat-bottom shadowed cloud underside */}
            <path
              d="M -74 14 Q -40 10 0 13 Q 40 10 74 14 Q 74 22 58 22 L -64 22 Q -74 22 -74 14 Z"
              fill={under}
            />
          </g>
        );
      })}
    </g>
  );
};

/**
 * Cinema Broadcast Compositor Overlay:
 * Subtle radial edge vignette + volumetric diagonal light shafts + ambient floating motes.
 * Zero heavy CSS blur — 100% pure lightweight SVG for silky 60fps rendering.
 */
export const AmbientAtmosphere: React.FC<{
  frame: number;
  warm?: boolean;
}> = ({ frame, warm = true }) => {
  const motes = [
    { x: 160, y: 190, r: 2.6, spx: 0.32, spy: -0.2, ph: 0.2 },
    { x: 480, y: 310, r: 2.1, spx: 0.22, spy: -0.16, ph: 1.5 },
    { x: 780, y: 150, r: 3.0, spx: 0.38, spy: -0.22, ph: 2.8 },
    { x: 1080, y: 260, r: 2.4, spx: 0.28, spy: -0.18, ph: 4.1 },
    { x: 320, y: 460, r: 2.0, spx: 0.25, spy: -0.14, ph: 5.2 },
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
      <defs>
        <radialGradient id="cinemaVignette" cx="50%" cy="48%" r="68%">
          <stop offset="58%" stopColor="#050A14" stopOpacity="0" />
          <stop offset="100%" stopColor="#050A14" stopOpacity="0.38" />
        </radialGradient>
        <linearGradient id="volumetricBeam" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={moteColor} stopOpacity="0.10" />
          <stop offset="100%" stopColor={moteColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Subtle volumetric diagonal sunlight/moonlight rays */}
      <polygon points="0,0 380,0 120,720 0,720" fill="url(#volumetricBeam)" />
      <polygon points="440,0 590,0 340,720 210,720" fill="url(#volumetricBeam)" opacity={0.55} />

      {/* Gently drifting atmospheric light dust */}
      {motes.map((m, idx) => {
        const mx = (m.x + frame * m.spx) % 1280;
        const my = (((m.y + frame * m.spy) % 620) + 620) % 620;
        const pulse = 0.2 + 0.18 * Math.sin(frame * 0.05 + m.ph);
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

      {/* Editorial Cinema Edge Vignette */}
      <rect width={1280} height={720} fill="url(#cinemaVignette)" />
    </svg>
  );
};

const POWER_WORD_PATTERN =
  /^(\$[\d,.]+|taka|usd|bdt|x|bangladesh|ninety|thirty|fifty|five|three-hundred-dollar|fifteen|hundred|payoneer|wise|storefront|global|proof|real|zero)\b/i;

/**
 * v6.0 Broadcast Documentary Captions:
 * Clean editorial cinema legibility — subtle dark bottom scrim + crisp drop-shadowed typography
 * (ZERO TikTok pill box, ZERO chunky cartoon black sticker outline!).
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
    config: { damping: 16, stiffness: 310, mass: 0.42 },
  });

  const broadcastShadow =
    '0 2px 10px rgba(4, 9, 18, 0.92), 0 1px 3px rgba(4, 9, 18, 0.98), 0 0 22px rgba(4, 9, 18, 0.55)';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 34,
        paddingBottom: 22,
        background:
          'linear-gradient(180deg, rgba(6, 11, 20, 0) 0%, rgba(6, 11, 20, 0.54) 100%)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '2px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 11,
          maxWidth: '88%',
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
                fontFamily: FONT_BODY,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: isCurrent
                  ? activeColor
                  : isSpoken
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.84)',
                textShadow: broadcastShadow,
                transform: isCurrent
                  ? `scale(${(1 + pop * 0.08).toFixed(3)}) translateY(${(-pop * 2.2).toFixed(1)}px)`
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
 * Organic documentary camera breathing transform (AE ease-in-out + gentle micro-float).
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
  const breathY = Math.sin(frame * 0.022) * 2.4;
  const breathRot = Math.sin(frame * 0.015) * 0.14;

  if (mode === 'push') {
    const s = 1.0 + p * 0.082;
    return `translate(640, ${(360 + breathY).toFixed(2)}) rotate(${breathRot.toFixed(3)}) scale(${s.toFixed(4)}) translate(-640, -360)`;
  }
  if (mode === 'pull') {
    const s = 1.085 - p * 0.082;
    return `translate(640, ${(360 + breathY).toFixed(2)}) rotate(${(-breathRot).toFixed(3)}) scale(${s.toFixed(4)}) translate(-640, -360)`;
  }
  if (mode === 'pan-right') {
    const tx = 22 - p * 44;
    return `translate(${tx.toFixed(2)}, ${breathY.toFixed(2)}) translate(640, 360) scale(1.05) translate(-640, -360)`;
  }
  const tx = -22 + p * 44;
  return `translate(${tx.toFixed(2)}, ${breathY.toFixed(2)}) translate(640, 360) scale(1.05) translate(-640, -360)`;
}
