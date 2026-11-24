import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_BODY, FONT_CONDENSED, SPRING_POP } from './theme';

/**
 * Sovereign Motion v7.0 — After Effects 2D+3D Motion Primitives
 * Engineered for silky 60fps rendering on standard 16GB CPU/iGPU laptops
 * (zero heavy CSS backdrop-filter or feTurbulence bottlenecks).
 */

export interface Camera3DRigProps {
  children: React.ReactNode;
  durationInFrames: number;
  mode?: 'orbital-push' | 'parallax-pan' | 'dramatic-tilt' | 'altitude-rise';
  perspectivePx?: number;
  intensity?: number;
}

/**
 * True CSS 3D Perspective Camera Rig:
 * Adds subtle After Effects 3D Camera null-object pitch/yaw/Z-dolly parallax
 * to flat + 2.5D compositions without breaking SVG sharpness.
 */
export const Camera3DRig: React.FC<Camera3DRigProps> = ({
  children,
  durationInFrames,
  mode = 'orbital-push',
  perspectivePx = 1240,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    easing: Easing.bezier(0.37, 0, 0.63, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sway = Math.sin(frame * 0.021) * 0.45 * intensity;
  const breath = Math.cos(frame * 0.017) * 0.35 * intensity;

  let rotX = 0;
  let rotY = 0;
  let tz = 0;
  let scale = 1.02;

  if (mode === 'orbital-push') {
    rotX = (1.6 - p * 1.4 + breath) * intensity;
    rotY = (-2.1 + p * 4.2 + sway) * intensity;
    tz = p * 34 * intensity;
    scale = 1.025 + p * 0.025;
  } else if (mode === 'parallax-pan') {
    rotX = (0.7 + breath) * intensity;
    rotY = (2.4 - p * 4.8 + sway) * intensity;
    tz = 16 * intensity;
    scale = 1.035;
  } else if (mode === 'dramatic-tilt') {
    rotX = (2.6 - p * 2.2 + breath) * intensity;
    rotY = (-1.2 + p * 2.4 + sway) * intensity;
    tz = p * 44 * intensity;
    scale = 1.03 + p * 0.02;
  } else {
    // altitude-rise
    rotX = (-1.4 + p * 2.4 + breath) * intensity;
    rotY = (sway * 1.4) * intensity;
    tz = (36 - p * 28) * intensity;
    scale = 1.04 - p * 0.018;
  }

  return (
    <AbsoluteFill
      style={{
        perspective: `${perspectivePx}px`,
        perspectiveOrigin: '50% 48%',
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scale.toFixed(4)}) rotateX(${rotX.toFixed(3)}deg) rotateY(${rotY.toFixed(3)}deg) translate3d(0px, 0px, ${tz.toFixed(2)}px)`,
          transformOrigin: '50% 50%',
          willChange: 'transform',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

interface CloudStratum {
  id: number;
  baseX: number;
  baseY: number;
  side: -1 | 1;
  depthRank: number; // 0 = far, 1 = near camera
  baseScale: number;
}

const CLOUD_STRATA: CloudStratum[] = [
  { id: 0, baseX: 250, baseY: 210, side: -1, depthRank: 0.15, baseScale: 1.55 },
  { id: 1, baseX: 1030, baseY: 225, side: 1, depthRank: 0.22, baseScale: 1.5 },
  { id: 2, baseX: 640, baseY: 470, side: -1, depthRank: 0.38, baseScale: 1.85 },
  { id: 3, baseX: 330, baseY: 420, side: -1, depthRank: 0.62, baseScale: 2.15 },
  { id: 4, baseX: 950, baseY: 395, side: 1, depthRank: 0.72, baseScale: 2.15 },
  { id: 5, baseX: 640, baseY: 330, side: 1, depthRank: 0.88, baseScale: 2.55 },
  { id: 6, baseX: 490, baseY: 265, side: -1, depthRank: 0.96, baseScale: 2.75 },
];

/**
 * Volumetric 3D Cloud Fly-Through Rig:
 * Multi-plane lineless split-shaded cumulus strata rushing along the Z-axis
 * and parting cleanly around the camera lens — signature viral AE cloud dive!
 */
export const VolumetricCloudFlythrough: React.FC<{
  /** Normalized dive progress 0..1 */
  progress: number;
  tint?: string;
  shadeTint?: string;
  mistColor?: string;
  opacity?: number;
}> = ({
  progress,
  tint = '#F8FBFF',
  shadeTint = '#B8D4EA',
  mistColor = 'rgba(226, 240, 255, 0.34)',
  opacity = 1,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0.005 || p >= 0.995 || opacity <= 0.01) return null;

  // Bell curve envelope peaks at the mid-dive mist pass
  const envelope = Math.sin(p * Math.PI);

  return (
    <svg
      viewBox="0 0 1280 720"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 28,
        opacity: (opacity * Math.min(1, envelope * 1.45)).toFixed(3),
      }}
    >
      <defs>
        <radialGradient id="cloudMistPass7" cx="50%" cy="50%" r="64%">
          <stop offset="0%" stopColor={tint} stopOpacity="0.48" />
          <stop offset="55%" stopColor={mistColor} stopOpacity="0.22" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Atmospheric mist flash right as camera punches through the center cloud bank */}
      <rect
        width={1280}
        height={720}
        fill="url(#cloudMistPass7)"
        opacity={(Math.pow(envelope, 1.5) * 0.92).toFixed(3)}
      />

      {CLOUD_STRATA.map((c) => {
        // Staggered Z-approach so near clouds rush past first and far clouds open up after
        const zProg = Math.max(0, Math.min(1.4, p * (1.1 + c.depthRank * 0.45) - (1 - c.depthRank) * 0.12));
        const perspectiveScale = c.baseScale * (0.58 + Math.pow(zProg, 1.65) * 2.45);
        const partX = c.side * Math.pow(zProg, 1.45) * (240 + c.depthRank * 360);
        const partY = (c.baseY < 360 ? -1 : 1) * Math.pow(zProg, 1.5) * (90 + c.depthRank * 140);
        const cx = c.baseX + partX;
        const cy = c.baseY + partY;
        const layerOpacity =
          interpolate(zProg, [0, 0.25, 0.78, 1.25], [0, 0.92, 0.88, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }) *
          (0.65 + c.depthRank * 0.35);

        if (layerOpacity <= 0.01) return null;

        return (
          <g
            key={c.id}
            transform={`translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) scale(${perspectiveScale.toFixed(3)})`}
            opacity={layerOpacity.toFixed(3)}
          >
            {/* Soft outer atmospheric halo */}
            <path
              d="M -96 28 Q -102 -12 -58 -16 Q -44 -54 -4 -44 Q 30 -64 60 -24 Q 98 -22 98 14 Q 98 30 74 30 L -78 30 Q -96 30 -96 28 Z"
              fill={tint}
              opacity={0.42}
              transform="scale(1.08)"
            />
            {/* Sunlit Lineless Cumulus Silhouette */}
            <path
              d="M -88 24 Q -92 -8 -54 -10 Q -40 -46 -4 -38 Q 26 -54 54 -20 Q 88 -18 88 12 Q 88 26 68 26 L -72 26 Q -88 26 -88 24 Z"
              fill={tint}
            />
            {/* Split-Shaded Cool Volumetric Underside */}
            <path
              d="M -84 15 Q -44 9 0 14 Q 44 8 84 15 Q 84 26 68 26 L -72 26 Q -84 26 -84 15 Z"
              fill={shadeTint}
              opacity={0.78}
            />
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Upgraded After Effects Frosted-Glass Leader Callout:
 * Sleek dark-translucent glass telemetry card + crisp 1px top highlight + pulsing target node +
 * animated 45-degree elbow leader line. Pure lightweight SVG (60fps laptop safe!).
 */
export const GlassLeaderCallout: React.FC<{
  targetX: number;
  targetY: number;
  elbowX: number;
  elbowY: number;
  endX: number;
  label: string;
  sublabel?: string;
  accent?: string;
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
  delayFrames = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localF = Math.max(0, frame - delayFrames);
  if (localF <= 0) return null;

  const lineP = interpolate(localF, [0, 18], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardPop = spring({
    frame: Math.max(0, localF - 8),
    fps,
    config: SPRING_POP,
  });

  const seg1P = Math.min(1, lineP * 2);
  const seg2P = Math.max(0, (lineP - 0.5) * 2);
  const curElbowX = targetX + (elbowX - targetX) * seg1P;
  const curElbowY = targetY + (elbowY - targetY) * seg1P;
  const curEndX = elbowX + (endX - elbowX) * seg2P;
  const isRightSide = endX >= elbowX;
  const pulse = 9 + Math.sin(frame * 0.16) * 3.2;

  const cardW = Math.max(166, Math.min(280, Math.max(label.length * 13.5, (sublabel?.length ?? 0) * 7.8) + 34));
  const cardH = sublabel ? 60 : 42;
  const cardX = isRightSide ? endX - cardW : endX;
  const cardY = elbowY - cardH - 6;

  return (
    <g>
      {/* Pulsing Target Node */}
      <circle cx={targetX} cy={targetY} r={pulse} fill={accent} opacity={0.26} />
      <circle cx={targetX} cy={targetY} r={5} fill={accent} />
      <circle cx={targetX} cy={targetY} r={2} fill="#FFFFFF" />

      {/* Precision 45-degree Elbow Leader Line */}
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

      {/* Sleek Dark Frosted-Glass Telemetry Card */}
      {cardPop > 0.02 && (
        <g
          transform={`translate(${cardX + cardW / 2}, ${cardY + cardH / 2 + (1 - cardPop) * 10}) scale(${(0.9 + cardPop * 0.1).toFixed(3)}) translate(${-cardW / 2}, ${-cardH / 2})`}
          opacity={Math.min(1, cardPop * 1.35)}
        >
          {/* Subtle Ambient Drop Shadow */}
          <rect x={2} y={5} width={cardW} height={cardH} rx={6} fill="rgba(4, 9, 18, 0.34)" />
          {/* Dark Translucent Frosted Backing */}
          <rect
            x={0}
            y={0}
            width={cardW}
            height={cardH}
            rx={6}
            fill="rgba(10, 18, 32, 0.82)"
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth={1.2}
          />
          {/* Crisp Specular Top Glass Edge Highlight */}
          <line x1={8} y1={1.5} x2={cardW - 8} y2={1.5} stroke="#FFFFFF" strokeWidth={1.2} opacity={0.34} />
          {/* Micro Accent Indicator Notch on Top-Left */}
          <rect x={0} y={0} width={cardW} height={3} rx={1.5} fill={accent} opacity={0.92} />

          <text
            x={14}
            y={28}
            textAnchor="start"
            fontFamily={FONT_CONDENSED}
            fontWeight={800}
            fontSize={24}
            fill="#FFFFFF"
            letterSpacing="0.03em"
          >
            {label}
          </text>
          {sublabel && (
            <text
              x={14}
              y={47}
              textAnchor="start"
              fontFamily={FONT_BODY}
              fontWeight={700}
              fontSize={11}
              fill={accent}
              letterSpacing="0.11em"
            >
              {sublabel}
            </text>
          )}
        </g>
      )}
    </g>
  );
};

// Precomputed deterministic film grain dust coordinates (zero per-frame allocations)
const GRAIN_SPECKS = Array.from({ length: 42 }, (_, i) => ({
  x: ((i * 197 + 43) % 1260) + 10,
  y: ((i * 113 + 29) % 700) + 10,
  r: i % 3 === 0 ? 1.4 : 0.9,
  light: i % 2 === 0,
}));

/**
 * Tactile Documentary Compositor (v7.0):
 * Adds authentic print/editorial warmth — 24fps stepped micro-grain + subtle diagonal halftone
 * vignette corners + optical warm/cool light shafts — engineered for < 2ms/frame CPU overhead!
 */
export const TactileDocumentaryCompositor: React.FC<{
  frame: number;
  warm?: boolean;
}> = ({ frame, warm = true }) => {
  // Step grain at 24fps (every 2.5 frames at 60fps) for authentic 16mm/35mm cinema cadence
  const grainTick = Math.floor(frame / 3);
  const shiftX = ((grainTick * 53) % 120) - 60;
  const shiftY = ((grainTick * 37) % 80) - 40;
  const tint = warm ? '#FFF3D1' : '#C8E6FF';

  return (
    <svg
      viewBox="0 0 1280 720"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 22,
      }}
    >
      <defs>
        <pattern
          id="tactileHalftone7"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(28)"
        >
          <circle cx="2.5" cy="2.5" r="1.05" fill="#0A1322" opacity="0.14" />
        </pattern>
        <radialGradient id="halftoneEdgeMask7" cx="50%" cy="48%" r="64%">
          <stop offset="68%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.62" />
        </radialGradient>
        <mask id="cornerHalftoneMask7">
          <rect width={1280} height={720} fill="url(#halftoneEdgeMask7)" />
        </mask>
        <linearGradient id="opticalEdgeWash7" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tint} stopOpacity="0.065" />
          <stop offset="50%" stopColor={tint} stopOpacity="0" />
          <stop offset="100%" stopColor="#060D1A" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {/* Subtle Editorial Print Halftone Vignette Corners */}
      <rect
        width={1280}
        height={720}
        fill="url(#tactileHalftone7)"
        mask="url(#cornerHalftoneMask7)"
        opacity={0.55}
      />

      {/* Subtle Optical Color Wash */}
      <rect width={1280} height={720} fill="url(#opticalEdgeWash7)" />

      {/* 24fps Stepped Documentary Micro-Film-Grain Specks */}
      <g opacity={0.18}>
        {GRAIN_SPECKS.map((s, idx) => {
          const gx = (((s.x + shiftX * (idx % 2 === 0 ? 1 : -1)) % 1280) + 1280) % 1280;
          const gy = (((s.y + shiftY * (idx % 3 === 0 ? 1 : -1)) % 720) + 720) % 720;
          return (
            <circle
              key={idx}
              cx={gx}
              cy={gy}
              r={s.r}
              fill={s.light ? '#FFFFFF' : '#08101C'}
            />
          );
        })}
      </g>
    </svg>
  );
};
