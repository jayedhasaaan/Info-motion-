import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { evolvePath } from '@remotion/paths';
import {
  DriftingClouds,
  FloatingCallout,
  FONT_DISPLAY,
  ImpactBurst,
  KineticSubtitleBar,
  OUTLINE_COLOR,
  SPRING_POP,
  SPRING_SLAM,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  getCameraTransform,
  type BeatTimingSpec,
} from '../theme';
import type { InfographicsWorldPalette } from '../../engine/infographicsStyleBible';

export interface WorldSceneProps {
  beat: BeatTimingSpec;
  palette: InfographicsWorldPalette;
  durationInFrames: number;
  subtitlesEnabled: boolean;
}

// ============================================================================
// SCENE 01 · DHAKA TWILIGHT DESK WINDOW -> GLOBAL LANDMARK HORIZON (ZERO BOXES!)
// ============================================================================
export const Scene01GlobalWindow: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Act 1A (0..310): Cozy Dhaka twilight bedroom desk & balcony window overlooking city skyline
  // Act 1B (310..end): Smooth camera zoom THROUGH the glowing laptop into illustrated world skyline arcs!
  const zoomSplit = interpolate(frame, [295, 365], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const deskEntry = spring({ frame: Math.max(0, frame - 4), fps, config: SPRING_SMOOTH });
  const lampSwing = Math.sin(frame * 0.045) * 1.8;
  const steamOffset = (frame * 1.2) % 60;
  const fxRate = Math.round(
    interpolate(frame, [105, 250], [1, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  // World flight arcs (Part 1B)
  const arcLondon = 'M 695 455 Q 505 180 285 295';
  const arcNyc = 'M 695 455 Q 645 140 535 235';
  const arcSf = 'M 695 455 Q 890 155 1030 275';

  const pLon = evolvePath(
    interpolate(frame, [355, 435], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    arcLondon
  );
  const pNyc = evolvePath(
    interpolate(frame, [385, 465], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    arcNyc
  );
  const pSf = evolvePath(
    interpolate(frame, [415, 495], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    arcSf
  );

  const lonPop = spring({ frame: Math.max(0, frame - 425), fps, config: SPRING_POP });
  const nycPop = spring({ frame: Math.max(0, frame - 455), fps, config: SPRING_POP });
  const sfPop = spring({ frame: Math.max(0, frame - 485), fps, config: SPRING_POP });

  // Part A zoom-into-laptop camera transform
  const deskScale = 1 + interpolate(frame, [0, 295], [0, 0.06], { extrapolateRight: 'clamp' }) + zoomSplit * 2.4;
  const worldScale = 0.85 + zoomSplit * 0.15 + interpolate(frame, [365, durationInFrames], [0, 0.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#1E3A5F' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="dhakaSunsetSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B365D" />
            <stop offset="52%" stopColor="#D96857" />
            <stop offset="100%" stopColor="#FFB668" />
          </linearGradient>
          <linearGradient id="globalSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#122B4A" />
            <stop offset="65%" stopColor="#1D4B7A" />
            <stop offset="100%" stopColor="#286B9C" />
          </linearGradient>
          <linearGradient id="lampGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE89E" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#FFE89E" stopOpacity="0" />
          </linearGradient>
          <clipPath id="windowFrameClip">
            <rect x={165} y={62} width={950} height={410} rx={12} />
          </clipPath>
        </defs>

        {/* ===== PART 1A: DHAKA GOLDEN-HOUR STUDIO ROOM & BALCONY WINDOW ===== */}
        {zoomSplit < 0.99 && (
          <g
            transform={`translate(640, 445) scale(${deskScale.toFixed(4)}) translate(-640, -445)`}
            opacity={1 - Math.max(0, (zoomSplit - 0.55) / 0.45)}
          >
            {/* Warm Editorial Teal-Slate Plaster Wall + Wainscoting Molding */}
            <rect width={1280} height={720} fill="#2E4259" />
            <rect x={0} y={0} width={1280} height={36} fill="#213245" />
            <rect x={0} y={482} width={1280} height={24} fill="#233447" stroke={OUTLINE_COLOR} strokeWidth={3} />
            {/* Subtle vertical editorial wallpaper stripes */}
            {[80, 1180].map((sx, i) => (
              <rect key={i} x={sx - 28} y={36} width={56} height={446} fill="#354C66" opacity={0.45} />
            ))}

            {/* Left Wall Prop: Hanging Corkboard with Pinned City Cards & Red String */}
            <g transform="translate(82, 195)">
              <rect x={-58} y={-76} width={116} height={152} rx={6} fill="#C68B59" stroke={OUTLINE_COLOR} strokeWidth={4} />
              <rect x={-48} y={-66} width={96} height={132} rx={3} fill="#DDA874" />
              {/* Pinned Postcards */}
              <rect x={-36} y={-50} width={44} height={34} rx={2} fill="#FFFDF6" stroke={OUTLINE_COLOR} strokeWidth={2.5} transform="rotate(-6 -14 -33)" />
              <circle cx={-16} cy={-48} r={4.5} fill="#E63946" stroke={OUTLINE_COLOR} strokeWidth={1.8} />
              <rect x={-4} y={2} width={44} height={36} rx={2} fill="#FFF3C4" stroke={OUTLINE_COLOR} strokeWidth={2.5} transform="rotate(5 18 20)" />
              <circle cx={18} cy={4} r={4.5} fill="#2AD08E" stroke={OUTLINE_COLOR} strokeWidth={1.8} />
              <line x1={-16} y1={-48} x2={18} y2={4} stroke="#E63946" strokeWidth={2.5} strokeDasharray="4 3" />
            </g>

            {/* Right Wall Prop: Hanging Brass Studio Wall Clock + Shelf Books */}
            <g transform="translate(1196, 170)">
              <circle r={42} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={4} />
              <circle r={33} fill="#FFFDF6" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <line x1={0} y1={0} x2={0} y2={-20} stroke={OUTLINE_COLOR} strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${(frame * 0.25).toFixed(1)})`} />
              <line x1={0} y1={0} x2={15} y2={6} stroke="#E63946" strokeWidth={2.5} strokeLinecap="round" transform={`rotate(${(frame * 1.4).toFixed(1)})`} />
              <circle r={4} fill={OUTLINE_COLOR} />
            </g>
            {/* Right Floating Wall Bookshelf */}
            <g transform="translate(1196, 330)">
              <rect x={-56} y={0} width={112} height={12} rx={3} fill="#B87A4B" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <rect x={-44} y={-52} width={18} height={52} rx={2} fill="#E85D4A" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <rect x={-24} y={-62} width={20} height={62} rx={2} fill="#2EC4B6" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <rect x={-2} y={-46} width={18} height={46} rx={2} fill="#FFD166" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <rect x={20} y={-56} width={18} height={56} rx={2} fill="#4DA6E8" stroke={OUTLINE_COLOR} strokeWidth={2.5} transform="rotate(10 29 -28)" />
            </g>

            {/* Large Balcony Window Looking Out Over Vibrant Golden-Hour Dhaka */}
            <g clipPath="url(#windowFrameClip)">
              <rect x={165} y={62} width={950} height={410} fill="url(#dhakaSunsetSky)" />
              {/* Warm radiant setting sun + crisp flat halo rings (Infographics Show signature!) */}
              <circle cx={640} cy={308} r={145} fill="#FFD166" opacity={0.18} />
              <circle cx={640} cy={308} r={108} fill="#FFE082" opacity={0.34} />
              <circle cx={640} cy={308} r={76} fill="#FFF5C2" stroke="#FFD166" strokeWidth={3} />

              <DriftingClouds frame={frame} tint="#FFE4C4" opacity={0.86} speed={0.48} />

              {/* Gliding Evening Birds in Sky */}
              {[0, 1, 2].map((bi) => {
                const bx = 220 + ((frame * (1.1 + bi * 0.25) + bi * 210) % 880);
                const by = 135 + bi * 32;
                const wing = Math.sin(frame * 0.22 + bi) * 5;
                return (
                  <path
                    key={bi}
                    d={`M ${bx - 12} ${by + wing} Q ${bx - 4} ${by - 6} ${bx} ${by} Q ${bx + 4} ${by - 6} ${bx + 12} ${by + wing}`}
                    fill="none"
                    stroke="#26384F"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Far Dhaka Skyline Layer with Mosque Dome, Minaret & Geometric Parliament Silhouette */}
              <path
                d="M 165 472 L 165 335 L 222 335 L 222 292 L 268 292 L 268 345 L 318 345 L 318 265 L 385 265 L 385 332 L 428 332 Q 465 272 502 332 L 516 332 L 516 248 L 528 248 L 528 332 L 560 332 L 560 282 L 620 282 L 620 350 L 700 350 L 700 278 L 762 278 L 762 338 L 818 338 L 818 254 L 884 254 L 884 322 L 948 322 L 948 288 L 1022 288 L 1022 344 L 1115 344 L 1115 472 Z"
                fill="#395270"
                stroke="#1E2F44"
                strokeWidth={2.5}
              />
              {/* Near Dhaka Apartment Rooftops with Water Tanks & Warm Lit Windows */}
              <path
                d="M 165 472 L 165 372 L 250 372 L 250 344 L 342 344 L 342 396 L 442 396 L 442 358 L 548 358 L 548 408 L 732 408 L 732 354 L 856 354 L 856 388 L 966 388 L 966 342 L 1115 342 L 1115 472 Z"
                fill="#1D2D42"
                stroke={OUTLINE_COLOR}
                strokeWidth={3}
              />
              {/* Rooftop water tank detail */}
              <rect x={274} y={320} width={38} height={24} rx={4} fill="#2A3E57" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <rect x={988} y={318} width={40} height={24} rx={4} fill="#2A3E57" stroke={OUTLINE_COLOR} strokeWidth={2.5} />

              {/* Warm twinkling apartment window lights */}
              {[
                [268, 366], [292, 366], [316, 366], [268, 396], [316, 396],
                [464, 378], [488, 378], [512, 378],
                [756, 374], [782, 374], [808, 374], [756, 404], [808, 404],
                [990, 364], [1020, 364], [1050, 364], [1020, 394],
              ].map(([wx, wy], i) => (
                <rect
                  key={i}
                  x={wx}
                  y={wy}
                  width={13}
                  height={17}
                  rx={2}
                  fill="#FFD166"
                  opacity={0.72 + 0.28 * Math.sin(frame * 0.08 + i)}
                />
              ))}
            </g>

            {/* Wooden Window Frame, Sill & Mullions with Cel-Shaded Trim */}
            <rect
              x={165}
              y={62}
              width={950}
              height={410}
              rx={12}
              fill="none"
              stroke={OUTLINE_COLOR}
              strokeWidth={12}
            />
            <rect
              x={165}
              y={62}
              width={950}
              height={410}
              rx={12}
              fill="none"
              stroke="#4A627D"
              strokeWidth={4}
            />
            <line x1={482} y1={62} x2={482} y2={472} stroke={OUTLINE_COLOR} strokeWidth={8} />
            <line x1={798} y1={62} x2={798} y2={472} stroke={OUTLINE_COLOR} strokeWidth={8} />
            {/* Window sill ledge */}
            <rect x={148} y={468} width={984} height={16} rx={4} fill="#5C4433" stroke={OUTLINE_COLOR} strokeWidth={3.5} />

            {/* Floating Open-Sky Callout (NO BOX!) */}
            <FloatingCallout
              x={640}
              y={156}
              text={`$1 = ৳${fxRate}`}
              subtext="DHAKA DESK · GLOBAL LEVERAGE"
              size={66}
              fill="#FFFFFF"
              delayFrames={55}
            />

            {/* Solid Warm Cel-Shaded Wooden Desk Surface + Props */}
            <g transform={`translate(0, ${(1 - deskEntry) * 90})`}>
              <polygon
                points="0,505 1280,505 1280,720 0,720"
                fill="#C48A52"
                stroke={OUTLINE_COLOR}
                strokeWidth={4}
              />
              {/* 2-Tone Sunlit Wood Edge & Plank Grain Lines */}
              <rect x={0} y={505} width={1280} height={20} fill="#E4B17C" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              <line x1={80} y1={562} x2={340} y2={562} stroke="#A8703E" strokeWidth={3} strokeLinecap="round" opacity={0.55} />
              <line x1={910} y1={592} x2={1210} y2={592} stroke="#A8703E" strokeWidth={3} strokeLinecap="round" opacity={0.55} />

              {/* Crisp Cel-Shaded Contact Shadows */}
              <ellipse cx={640} cy={558} rx={220} ry={22} fill="rgba(24,34,47,0.28)" />
              <ellipse cx={925} cy={556} rx={48} ry={13} fill="rgba(24,34,47,0.24)" />
              <ellipse cx={1105} cy={546} rx={68} ry={16} fill="rgba(24,34,47,0.22)" />

              {/* Left Foreground Prop: Lush Potted Tropical Plant Swaying Gently */}
              <g transform="translate(115, 535)">
                <g transform={`rotate(${(Math.sin(frame * 0.04) * 2.5).toFixed(2)})`}>
                  <path d="M 0 -54 Q -52 -118 -72 -88 Q -42 -62 0 -54 Z" fill="#27AE60" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                  <path d="M 0 -58 Q -28 -144 8 -138 Q 22 -96 0 -58 Z" fill="#2ECC71" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                  <path d="M 4 -54 Q 62 -112 72 -76 Q 38 -56 4 -54 Z" fill="#1E8449" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                </g>
                {/* Terracotta Ceramic Pot */}
                <polygon points="-38,-56 38,-56 28,12 -28,12" fill="#D96B43" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                <rect x={-44} y={-68} width={88} height={16} rx={4} fill="#E87D55" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              </g>

              {/* Classic Brass Architect Desk Lamp */}
              <g transform={`translate(265, 535) rotate(${lampSwing.toFixed(2)})`}>
                <path
                  d="M -42 18 L 42 18 L 32 0 L -32 0 Z"
                  fill="#E5A93B"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3.5}
                />
                <path
                  d="M 0 0 L -36 -115 L 44 -188"
                  fill="none"
                  stroke="#D1952B"
                  strokeWidth={11}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 0 0 L -36 -115 L 44 -188"
                  fill="none"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx={-36} cy={-115} r={8} fill="#FFD166" stroke={OUTLINE_COLOR} strokeWidth={3} />
                <polygon points="30,-168 250,35 -50,35" fill="url(#lampGlow)" />
                <path
                  d="M 16 -196 Q 55 -216 86 -175 L 20 -158 Z"
                  fill="#F5B82E"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3.5}
                />
              </g>

              {/* Center Hero: Open Glowing Silver Laptop (The Global Window!) */}
              <g transform="translate(640, 445)">
                <rect
                  x={-172}
                  y={-124}
                  width={344}
                  height={212}
                  rx={14}
                  fill="#263242"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={4.5}
                />
                <rect x={-156} y={-108} width={312} height={180} rx={6} fill="#184770" />
                {/* Subtle screen top glass reflection */}
                <polygon points="-156,-108 16,-108 -72,72 -156,72" fill="#FFFFFF" opacity={0.07} />
                {/* Stylized glowing mini world arcs + live pulsing USD ping badges inside laptop */}
                <circle cx={0} cy={-18} r={58} fill="none" stroke="#64C4ED" strokeWidth={2.5} opacity={0.75} />
                <ellipse cx={0} cy={-18} rx={28} ry={58} fill="none" stroke="#64C4ED" strokeWidth={2} opacity={0.62} />
                <line x1={-58} y1={-18} x2={58} y2={-18} stroke="#64C4ED" strokeWidth={2} opacity={0.5} />
                <path d="M 0 -10 Q -52 -62 -98 -34" fill="none" stroke="#FFD166" strokeWidth={4} strokeLinecap="round" />
                <path d="M 0 -10 Q 54 -68 100 -28" fill="none" stroke="#2AD08E" strokeWidth={4} strokeLinecap="round" />
                <circle cx={0} cy={-10} r={6 + Math.sin(frame * 0.2) * 2} fill="#FFD166" />
                <circle cx={-98} cy={-34} r={7} fill="#FFD166" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
                <circle cx={100} cy={-28} r={7} fill="#2AD08E" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
                {/* Silver laptop base with cel highlight */}
                <polygon
                  points="-180,88 180,88 220,118 -220,118"
                  fill="#D6DEE8"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={4}
                />
                <polygon points="-164,92 164,92 184,104 -184,104" fill="#9FB0C4" opacity={0.55} />
                <rect x={-52} y={106} width={104} height={7} rx={3.5} fill="#7B8FA6" />
              </g>

              {/* Steaming Clay Tea Cup ("Cha") */}
              <g transform="translate(925, 510)">
                {[0, 1].map((sIdx) => {
                  const sy = -((steamOffset + sIdx * 30) % 60);
                  const sop = Math.sin((((steamOffset + sIdx * 30) % 60) / 60) * Math.PI);
                  return (
                    <path
                      key={sIdx}
                      d={`M ${-8 + sIdx * 16} ${sy - 14} Q ${-18 + sIdx * 16} ${sy - 32} ${-4 + sIdx * 16} ${sy - 48}`}
                      fill="none"
                      stroke="#FFF6E5"
                      strokeWidth={4}
                      strokeLinecap="round"
                      opacity={sop * 0.78}
                    />
                  );
                })}
                <path
                  d="M -28 -8 L 28 -8 L 22 40 Q 20 48 0 48 Q -20 48 -22 40 Z"
                  fill="#D96B43"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3.5}
                />
                {/* Highlight rim stripe on cup */}
                <path d="M -18 2 L -14 38" stroke="#F09874" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
                <path
                  d="M 26 2 Q 44 4 42 20 Q 40 34 24 32"
                  fill="none"
                  stroke="#D96B43"
                  strokeWidth={7}
                  strokeLinecap="round"
                />
                <ellipse cx={0} cy={-8} rx={28} ry={8} fill="#7B3F22" stroke={OUTLINE_COLOR} strokeWidth={3} />
              </g>

              {/* Right Desk Prop: Spiral Sketchbook + Yellow Pencil */}
              <g transform="translate(1105, 534) rotate(-6)">
                <rect x={-62} y={-24} width={124} height={46} rx={5} fill="#FFFDF6" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                <line x1={-44} y1={-8} x2={38} y2={-8} stroke="#94A3B8" strokeWidth={3.5} strokeLinecap="round" />
                <line x1={-44} y1={6} x2={24} y2={6} stroke="#94A3B8" strokeWidth={3.5} strokeLinecap="round" />
                <rect x={-52} y={24} width={104} height={9} rx={3} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              </g>
            </g>
          </g>
        )}

        {/* ===== PART 1B: ILLUSTRATED GLOBAL MAP & ICONIC LANDMARKS ===== */}
        {zoomSplit > 0.02 && (
          <g
            transform={`translate(640, 360) scale(${worldScale.toFixed(4)}) translate(-640, -360)`}
            opacity={zoomSplit}
          >
            <rect width={1280} height={720} fill="url(#globalSky)" />

            {/* Crisp Editorial Ocean Latitude / Longitude Grid */}
            <g stroke="#4DA6E8" strokeWidth={1.5} opacity={0.2}>
              {[180, 320, 460, 600].map((gy) => (
                <line key={gy} x1={0} y1={gy} x2={1280} y2={gy} />
              ))}
              {[220, 440, 660, 880, 1100].map((gx) => (
                <line key={gx} x1={gx} y1={0} x2={gx} y2={720} />
              ))}
            </g>

            {/* Stylized Flat-Vector Continents with Cel-Shaded Coastal Drop Shadow */}
            <g transform="translate(5, 7)" fill="#0F2D45" opacity={0.45}>
              <path d="M 85 170 L 285 155 L 330 235 L 250 325 L 175 310 L 125 255 Z" />
              <path d="M 435 160 L 585 148 L 620 228 L 535 270 L 460 250 Z" />
              <path d="M 615 165 L 1060 155 L 1125 275 L 990 420 L 820 435 L 705 475 L 645 390 L 590 275 Z" />
              <path d="M 465 290 L 605 295 L 625 465 L 545 555 L 485 450 Z" />
              <path d="M 245 360 L 345 380 L 325 545 L 265 575 L 220 445 Z" />
            </g>
            <g fill="#2C8299" stroke={OUTLINE_COLOR} strokeWidth={3.5} strokeLinejoin="round">
              <path d="M 85 170 L 285 155 L 330 235 L 250 325 L 175 310 L 125 255 Z" />
              <path d="M 435 160 L 585 148 L 620 228 L 535 270 L 460 250 Z" />
              <path d="M 615 165 L 1060 155 L 1125 275 L 990 420 L 820 435 L 705 475 L 645 390 L 590 275 Z" />
              <path d="M 465 290 L 605 295 L 625 465 L 545 555 L 485 450 Z" />
              <path d="M 245 360 L 345 380 L 325 545 L 265 575 L 220 445 Z" />
            </g>

            {/* Curved Glowing Flight Signal Trails from Dhaka */}
            <path
              d={arcLondon}
              fill="none"
              stroke="#FFD166"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={pLon.strokeDasharray}
              strokeDashoffset={pLon.strokeDashoffset}
            />
            <path
              d={arcNyc}
              fill="none"
              stroke="#2AD08E"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={pNyc.strokeDasharray}
              strokeDashoffset={pNyc.strokeDashoffset}
            />
            <path
              d={arcSf}
              fill="none"
              stroke="#FF7B54"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={pSf.strokeDasharray}
              strokeDashoffset={pSf.strokeDashoffset}
            />

            {/* Dhaka Origin Beacon Pin */}
            <g transform="translate(695, 455)">
              <circle r={24 + Math.sin(frame * 0.16) * 7} fill="#2AD08E" opacity={0.28} />
              <circle r={12} fill="#2AD08E" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              <FloatingCallout x={0} y={56} text="DHAKA" size={30} fill="#2AD08E" delayFrames={345} />
            </g>

            {/* Illustrated Landmark 1: LONDON (Big Ben Tower — NO BOX!) */}
            <g transform={`translate(285, 295) scale(${Math.max(0.001, lonPop)})`}>
              <rect x={-16} y={-88} width={32} height={90} fill="#E5B973" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <polygon points="-22,-88 0,-128 22,-88" fill="#3B4D61" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <circle cx={0} cy={-62} r={11} fill="#FFF7E0" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <FloatingCallout x={0} y={42} text="LONDON" size={28} fill="#FFFFFF" delayFrames={425} />
            </g>

            {/* Illustrated Landmark 2: NEW YORK (Empire State Spire — NO BOX!) */}
            <g transform={`translate(535, 235) scale(${Math.max(0.001, nycPop)})`}>
              <rect x={-20} y={-78} width={40} height={80} fill="#CBD5E1" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <rect x={-12} y={-106} width={24} height={28} fill="#E2E8F0" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <line x1={0} y1={-106} x2={0} y2={-136} stroke="#FFD166" strokeWidth={4} strokeLinecap="round" />
              <FloatingCallout x={0} y={42} text="NEW YORK" size={28} fill="#FFD166" delayFrames={455} />
            </g>

            {/* Illustrated Landmark 3: SAN FRANCISCO (Golden Gate Bridge — NO BOX!) */}
            <g transform={`translate(1030, 275) scale(${Math.max(0.001, sfPop)})`}>
              <rect x={-48} y={-68} width={10} height={70} fill="#E64B35" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <rect x={38} y={-68} width={10} height={70} fill="#E64B35" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <path d="M -78 -16 Q -43 -66 0 -16 Q 43 -66 78 -16" fill="none" stroke="#E64B35" strokeWidth={4} />
              <rect x={-82} y={-18} width={164} height={10} fill="#C93A27" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <FloatingCallout x={0} y={42} text="SAN FRANCISCO" size={26} fill="#FFFFFF" delayFrames={485} />
            </g>

            <FloatingCallout
              x={640}
              y={88}
              text="ONE GLOBAL WINDOW"
              size={48}
              fill="#FFFFFF"
              delayFrames={360}
            />
          </g>
        )}
      </svg>

      <KineticSubtitleBar
        narration={beat.narration}
        durationInFrames={durationInFrames}
        enabled={subtitlesEnabled}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 02 · CROWDED $5 CONVEYOR PIT vs SUNLIT FOUNDER SKYLINE BEACON
// ============================================================================
export const Scene02BiddingVsX: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth Infographics Show iris/wipe reveal switching from chaotic $5 pit to sunlit X rooftop beacon
  const revealX = interpolate(frame, [355, 430], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const beltOffset = (frame * 5.5) % 80;
  const bidCount = Math.round(
    interpolate(frame, [20, 260], [120, 10000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const redSlash = spring({ frame: Math.max(0, frame - 275), fps, config: SPRING_SLAM });
  const beaconPulse = (frame * 2.2) % 160;
  const towerPop = spring({ frame: Math.max(0, frame - 415), fps, config: SPRING_POP });

  return (
    <AbsoluteFill style={{ backgroundColor: '#3A1C24' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="pitSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2D161D" />
            <stop offset="100%" stopColor="#6D2832" />
          </linearGradient>
          <linearGradient id="sunlitSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E78C8" />
            <stop offset="70%" stopColor="#67C2F0" />
            <stop offset="100%" stopColor="#CBEFFF" />
          </linearGradient>
          <clipPath id="scene02Wipe">
            <rect x={0} y={0} width={1280 * revealX} height={720} />
          </clipPath>
        </defs>

        {/* ===== PART 2A: CHAOTIC $5 MARKETPLACE CONVEYOR PIT ===== */}
        <g transform={getCameraTransform(frame, 380, 'push')}>
          <rect width={1280} height={720} fill="url(#pitSky)" />
          {/* Industrial concrete factory silhouettes */}
          <path
            d="M 0 540 L 0 260 L 140 260 L 140 200 L 185 200 L 185 260 L 320 260 L 320 320 L 960 320 L 960 220 L 1060 220 L 1060 170 L 1110 170 L 1110 220 L 1280 220 L 1280 540 Z"
            fill="#241318"
          />
          {/* Overhead Steel Funnel Dumping Paper $5 Price Tags */}
          <polygon
            points="510,40 770,40 705,190 575,190"
            fill="#4F5A69"
            stroke={OUTLINE_COLOR}
            strokeWidth={4}
          />
          <rect x={495} y={24} width={290} height={24} rx={6} fill="#667385" stroke={OUTLINE_COLOR} strokeWidth={4} />

          {/* Falling avalanche of $5 / $4 / $3 tags */}
          {[
            { x: 590, speed: 6.5, label: '$5', rot: -18, phase: 0 },
            { x: 645, speed: 7.4, label: '$4', rot: 14, phase: 45 },
            { x: 695, speed: 5.8, label: '$3', rot: -26, phase: 90 },
            { x: 615, speed: 6.9, label: '$5', rot: 22, phase: 140 },
            { x: 675, speed: 8.1, label: '$2', rot: -12, phase: 190 },
          ].map((tag, i) => {
            const ty = 195 + ((frame * tag.speed + tag.phase) % 270);
            return (
              <g key={i} transform={`translate(${tag.x}, ${ty}) rotate(${tag.rot + frame * 0.4})`}>
                <polygon
                  points="-34,-18 22,-18 36,0 22,18 -34,18"
                  fill="#FFF2D6"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3}
                />
                <circle cx={20} cy={0} r={4} fill="#E63946" />
                <text
                  x={-8}
                  y={7}
                  textAnchor="middle"
                  fontFamily={FONT_DISPLAY}
                  fontWeight={900}
                  fontSize={20}
                  fill="#C82834"
                >
                  {tag.label}
                </text>
              </g>
            );
          })}

          {/* Heavy Steel Conveyor Belt Running Left */}
          <rect x={-40} y={470} width={1360} height={74} rx={36} fill="#364150" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
          <rect x={-40} y={484} width={1360} height={46} fill="#252E3A" />
          {/* Moving conveyor rollers & hazard chevrons */}
          {Array.from({ length: 18 }, (_, i) => {
            const rx = ((i * 80 - beltOffset) + 1440) % 1440 - 80;
            return (
              <g key={i} transform={`translate(${rx}, 507)`}>
                <circle r={18} fill="#7A8699" stroke={OUTLINE_COLOR} strokeWidth={3} />
                <circle r={6} fill="#FFD166" />
              </g>
            );
          })}

          {/* Open-Sky Bold Counter (NO BOX!) */}
          <FloatingCallout
            x={255}
            y={180}
            text={`${bidCount.toLocaleString()} BIDS`}
            subtext="RACE TO $5"
            size={52}
            fill="#FF6B6B"
            delayFrames={15}
          />

          {/* Giant Slamming Red X Slash over the Bidding Pit */}
          {frame >= 275 && (
            <g transform={`translate(640, 355) scale(${Math.max(0.001, redSlash)})`}>
              <line x1={-220} y1={-150} x2={220} y2={150} stroke="#FF3B47" strokeWidth={34} strokeLinecap="round" />
              <line x1={220} y1={-150} x2={-220} y2={150} stroke="#FF3B47" strokeWidth={34} strokeLinecap="round" />
              <line x1={-220} y1={-150} x2={220} y2={150} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.35} />
            </g>
          )}
          <ImpactBurst x={640} y={355} triggerFrame={275} color="#FFD166" radius={148} />
        </g>

        {/* ===== PART 2B: SUNLIT OPEN SKYLINE & DIRECT X SIGNAL TOWER (WIPED IN!) ===== */}
        {revealX > 0.005 && (
          <g clipPath="url(#scene02Wipe)">
            <rect width={1280} height={720} fill="url(#sunlitSky)" />
            <DriftingClouds frame={frame} tint="#FFFFFF" opacity={0.92} speed={0.55} />

            {/* Bright Modern Glass Founder Skyline in 2.5D Parallax */}
            <g transform={`translate(${(1 - revealX) * 80}, 0)`}>
              {/* Far sunlit skyscrapers */}
              <rect x={90} y={290} width={110} height={340} fill="#74B2DC" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <rect x={225} y={240} width={135} height={390} fill="#5C9ECA" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <rect x={920} y={260} width={130} height={370} fill="#5C9ECA" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <rect x={1075} y={310} width={115} height={320} fill="#74B2DC" stroke={OUTLINE_COLOR} strokeWidth={3} />

              {/* Rooftop Terrace Foreground */}
              <rect x={0} y={535} width={1280} height={185} fill="#2A3E52" stroke={OUTLINE_COLOR} strokeWidth={4} />
              <rect x={0} y={535} width={1280} height={18} fill="#46627D" stroke={OUTLINE_COLOR} strokeWidth={3} />

              {/* Hero Center: Gleaming X Broadcast Beacon Tower (Zero Gatekeepers!) */}
              <g transform={`translate(640, 535) scale(${Math.max(0.001, towerPop)})`}>
                {/* Expanding broadcast radio waves */}
                {[0, 1, 2].map((w) => {
                  const r = 46 + ((beaconPulse + w * 54) % 160);
                  const op = Math.max(0, 1 - r / 206);
                  return (
                    <circle
                      key={w}
                      cx={0}
                      cy={-285}
                      r={r}
                      fill="none"
                      stroke="#FFD166"
                      strokeWidth={6}
                      opacity={op * 0.85}
                    />
                  );
                })}
                {/* Steel architectural tower spire */}
                <polygon
                  points="-72,0 -22,-275 22,-275 72,0"
                  fill="#F5F7FA"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={4}
                />
                <line x1={-56} y1={-60} x2={56} y2={-60} stroke={OUTLINE_COLOR} strokeWidth={4} />
                <line x1={-42} y1={-135} x2={42} y2={-135} stroke={OUTLINE_COLOR} strokeWidth={4} />
                <line x1={-30} y1={-205} x2={30} y2={-205} stroke={OUTLINE_COLOR} strokeWidth={4} />
                {/* Glowing Gold X Crown */}
                <circle cx={0} cy={-285} r={44} fill="#18222F" stroke="#FFD166" strokeWidth={5} />
                <text
                  x={0}
                  y={-268}
                  textAnchor="middle"
                  fontFamily={FONT_DISPLAY}
                  fontWeight={900}
                  fontSize={46}
                  fill="#FFD166"
                >
                  𝕏
                </text>
              </g>

              {/* Direct Signal Beams Linking to Sunlit Founder Rooftops */}
              <line x1={594} y1={250} x2={292} y2={265} stroke="#FFD166" strokeWidth={5} strokeDasharray="12 10" />
              <line x1={686} y1={250} x2={985} y2={285} stroke="#2AD08E" strokeWidth={5} strokeDasharray="12 10" />
              <circle cx={292} cy={265} r={14} fill="#2AD08E" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <circle cx={985} cy={285} r={14} fill="#2AD08E" stroke={OUTLINE_COLOR} strokeWidth={3} />

              <FloatingCallout
                x={640}
                y={104}
                text="ZERO GATEKEEPERS"
                subtext="DIRECT TO DECISION-MAKERS ON X"
                size={54}
                fill="#FFFFFF"
                delayFrames={435}
              />
            </g>
          </g>
        )}
      </svg>

      <KineticSubtitleBar
        narration={beat.narration}
        durationInFrames={durationInFrames}
        enabled={subtitlesEnabled}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 03 · TINY PENNY PIGGY BANK (STAMPED OUT!) vs TOWERING $1,500 CASH STACKS
// ============================================================================
export const Scene03KillAdMyth: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera smoothly pans right cleanly past the piggy bank onto towering stacks of green $100 bills!
  const panShift = interpolate(frame, [320, 415], [0, -840], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const stampSlam = spring({ frame: Math.max(0, frame - 210), fps, config: SPRING_SLAM });
  const shake =
    frame >= 210 && frame < 238
      ? Math.sin(frame * 2.4) * (1 - (frame - 210) / 28) * 14
      : 0;

  const pennyDropY = (frame * 6) % 190;
  const retainerVal = Math.round(
    interpolate(frame, [420, 620], [0, 1500], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  // 3 physical stacks of crisp green $100 bills rising one by one
  const stack1 = spring({ frame: Math.max(0, frame - 400), fps, config: SPRING_POP });
  const stack2 = spring({ frame: Math.max(0, frame - 445), fps, config: SPRING_POP });
  const stack3 = spring({ frame: Math.max(0, frame - 490), fps, config: SPRING_POP });

  const renderBillStack = (x: number, bills: number, progress: number) => {
    const visibleBills = Math.round(bills * Math.min(1, progress));
    return (
      <g transform={`translate(${x}, 500)`}>
        <ellipse cx={0} cy={14} rx={88} ry={16} fill="rgba(24,34,47,0.22)" />
        {Array.from({ length: visibleBills }, (_, idx) => {
          const y = -idx * 14;
          return (
            <g key={idx} transform={`translate(0, ${y})`}>
              <rect
                x={-78}
                y={-22}
                width={156}
                height={34}
                rx={4}
                fill="#27AE60"
                stroke={OUTLINE_COLOR}
                strokeWidth={3}
              />
              <rect x={-64} y={-14} width={128} height={18} rx={2} fill="#58D68D" />
              {/* Gold currency wrapper band */}
              <rect x={-18} y={-22} width={36} height={34} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <text
                x={0}
                y={2}
                textAnchor="middle"
                fontFamily={FONT_DISPLAY}
                fontWeight={900}
                fontSize={16}
                fill={OUTLINE_COLOR}
              >
                $100
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#F5EDE0' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="creamStudioWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF3E7" />
            <stop offset="100%" stopColor="#E4D4BA" />
          </linearGradient>
        </defs>

        <rect width={1280} height={720} fill="url(#creamStudioWall)" />

        {/* Subtle radial spotlight cone from top */}
        <polygon points="340,0 940,0 1160,720 120,720" fill="#FFFFFF" opacity={0.32} />

        {/* Panoramic Physical Tabletop Sliding Smoothly Left -> Right */}
        <g transform={`translate(${(panShift + shake).toFixed(1)}, ${shake * 0.4})`}>
          {/* Long Mahogany Wood Tabletop */}
          <rect x={-100} y={505} width={2200} height={215} fill="#8D5B3A" stroke={OUTLINE_COLOR} strokeWidth={4} />
          <rect x={-100} y={505} width={2200} height={22} fill="#B57B52" stroke={OUTLINE_COLOR} strokeWidth={3} />

          {/* ===== LEFT SIDE: TINY PENNY PIGGY BANK (X AD PAYOUT MYTH) ===== */}
          <g transform="translate(560, 0)">
            {/* Single tiny copper penny clinking down slowly */}
            <circle
              cx={0}
              cy={170 + pennyDropY}
              r={16}
              fill="#D97B48"
              stroke={OUTLINE_COLOR}
              strokeWidth={3}
            />
            <text
              x={0}
              y={176 + pennyDropY}
              textAnchor="middle"
              fontFamily={FONT_DISPLAY}
              fontWeight={900}
              fontSize={14}
              fill="#FFF3E0"
            >
              1¢
            </text>

            {/* Illustrated Pink/Coral Ceramic Piggy Bank */}
            <g transform="translate(0, 440)">
              <ellipse cx={0} cy={68} rx={96} ry={16} fill="rgba(24,34,47,0.22)" />
              {/* Legs */}
              <rect x={-52} y={32} width={24} height={36} rx={6} fill="#E78A88" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              <rect x={28} y={32} width={24} height={36} rx={6} fill="#E78A88" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              {/* Body */}
              <ellipse cx={0} cy={0} rx={88} ry={62} fill="#F4A5A2" stroke={OUTLINE_COLOR} strokeWidth={4} />
              {/* Coin slot */}
              <rect x={-22} y={-50} width={44} height={8} rx={4} fill={OUTLINE_COLOR} />
              {/* Snout */}
              <ellipse cx={86} cy={4} rx={18} ry={24} fill="#E78A88" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              <circle cx={82} cy={-2} r={3.5} fill={OUTLINE_COLOR} />
              <circle cx={90} cy={-2} r={3.5} fill={OUTLINE_COLOR} />
              {/* Ear */}
              <polygon points="35,-50 56,-84 68,-44" fill="#F4A5A2" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            </g>

            <FloatingCallout
              x={0}
              y={128}
              text="$0.12 AD PAYOUT"
              subtext="THE VIRAL ILLUSION"
              size={50}
              fill="#E63946"
              delayFrames={18}
            />

            {/* Giant Physical Red Rubber Stamp "MYTH!" Slamming Down */}
            {frame >= 210 && (
              <g transform={`translate(0, 395) rotate(-14) scale(${Math.max(0.001, stampSlam)})`}>
                <rect
                  x={-165}
                  y={-52}
                  width={330}
                  height={104}
                  rx={14}
                  fill="rgba(230, 57, 70, 0.14)"
                  stroke="#D62828"
                  strokeWidth={10}
                />
                <text
                  x={0}
                  y={22}
                  textAnchor="middle"
                  fontFamily={FONT_DISPLAY}
                  fontWeight={900}
                  fontSize={64}
                  fill="#D62828"
                  letterSpacing="0.06em"
                >
                  MYTH
                </text>
              </g>
            )}
            <ImpactBurst x={0} y={395} triggerFrame={210} color="#E63946" radius={140} />
          </g>

          {/* ===== RIGHT SIDE: TOWERING GREEN $100 BILL STACKS + SEALED CONTRACT ===== */}
          <g transform="translate(1450, 0)">
            {renderBillStack(-175, 8, stack1)}
            {renderBillStack(0, 12, stack2)}
            {renderBillStack(175, 16, stack3)}
            <ImpactBurst x={175} y={272} triggerFrame={490} color="#F5B82E" radius={112} />

            {/* Gleaming Wax-Sealed Client Retainer Scroll on Right */}
            <g
              transform={`translate(365, 455) scale(${Math.max(0.001, stack3)})`}
            >
              <rect
                x={-68}
                y={-96}
                width={136}
                height={150}
                rx={8}
                fill="#FFFDF6"
                stroke={OUTLINE_COLOR}
                strokeWidth={3.5}
              />
              <line x1={-44} y1={-62} x2={44} y2={-62} stroke="#94A3B8" strokeWidth={5} strokeLinecap="round" />
              <line x1={-44} y1={-38} x2={34} y2={-38} stroke="#94A3B8" strokeWidth={5} strokeLinecap="round" />
              <line x1={-44} y1={-14} x2={40} y2={-14} stroke="#94A3B8" strokeWidth={5} strokeLinecap="round" />
              {/* Gold Wax Seal */}
              <circle cx={26} cy={22} r={22} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <polygon points="18,40 12,68 26,56 40,68 34,40" fill="#D62828" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
            </g>

            <FloatingCallout
              x={40}
              y={128}
              text={`$${retainerVal.toLocaleString()}/MO`}
              subtext="DIRECT GLOBAL CLIENT SKILL"
              size={66}
              fill="#239B56"
              delayFrames={405}
            />
          </g>
        </g>
      </svg>

      <KineticSubtitleBar
        narration={beat.narration}
        durationInFrames={durationInFrames}
        enabled={subtitlesEnabled}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 04 · 4 REAL-WORLD PHYSICAL WORKBENCHES (CAMERA DOLLY PAN — ZERO BOXES!)
// ============================================================================
export const Scene04OneCraft: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth continuous 2.5D horizontal dolly across 4 vibrant physical workbench zones
  const dollyX = interpolate(frame, [0, durationInFrames], [0, -1920], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const gearRot = frame * 1.9;
  const clapAngle = -24 + Math.abs(Math.sin(frame * 0.14)) * 22;
  const paperRise = Math.min(95, Math.max(0, (frame - 480) * 0.55));
  const stylusX = Math.sin(frame * 0.09) * 55;
  const stylusY = Math.cos(frame * 0.12) * 32;

  return (
    <AbsoluteFill style={{ backgroundColor: '#247BA0' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="workshopBg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1D6F96" />
            <stop offset="33%" stopColor="#2A8C78" />
            <stop offset="66%" stopColor="#3B4D80" />
            <stop offset="100%" stopColor="#9C513B" />
          </linearGradient>
        </defs>

        {/* Continuous panoramic wall & wooden workbench */}
        <g transform={`translate(${dollyX.toFixed(1)}, 0)`}>
          <rect x={0} y={0} width={3200} height={720} fill="url(#workshopBg)" />
          {/* Architectural studio wall wainscot & subtle vertical studio panels */}
          <rect x={0} y={485} width={3200} height={30} fill="rgba(18, 28, 42, 0.28)" stroke={OUTLINE_COLOR} strokeWidth={3} />
          {[180, 860, 1560, 2260, 2960].map((px) => (
            <line key={px} x1={px} y1={0} x2={px} y2={485} stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
          ))}
          {/* Hanging Brass Pendant Studio Lamps illuminating each craft station */}
          {[520, 1220, 1920, 2640].map((lx) => (
            <g key={lx} transform={`translate(${lx}, 0)`}>
              <line x1={0} y1={0} x2={0} y2={48} stroke={OUTLINE_COLOR} strokeWidth={4} />
              <polygon points="-22,64 22,64 12,48 -12,48" fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              <polygon points="-20,64 20,64 230,515 -230,515" fill="#FFF7D6" opacity={0.07} />
            </g>
          ))}
          {/* Long continuous wooden studio workbench */}
          <rect x={0} y={515} width={3200} height={205} fill="#D9A066" stroke={OUTLINE_COLOR} strokeWidth={4} />
          <rect x={0} y={515} width={3200} height={20} fill="#F0BC82" stroke={OUTLINE_COLOR} strokeWidth={3} />
          {[140, 740, 1460, 2140, 2780].map((gx) => (
            <line key={gx} x1={gx} y1={585} x2={gx + 260} y2={585} stroke="#B87E48" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
          ))}

          {/* ===== STATION 1 (x=520): SHORT-FORM VIDEO EDITING (CLAPPERBOARD & SPINNING REEL) ===== */}
          <g transform="translate(520, 0)">
            <FloatingCallout x={0} y={132} text="VIDEO EDITING" size={54} fill="#FFFFFF" delayFrames={8} />
            {/* Spinning cinema film reel */}
            <g transform={`translate(-130, 375) rotate(${gearRot.toFixed(1)})`}>
              <circle r={88} fill="#2C3E50" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
              {[0, 72, 144, 216, 288].map((a) => (
                <circle
                  key={a}
                  cx={Math.cos((a * Math.PI) / 180) * 48}
                  cy={Math.sin((a * Math.PI) / 180) * 48}
                  r={18}
                  fill="#F5F7FA"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3}
                />
              ))}
              <circle r={20} fill="#FFD166" stroke={OUTLINE_COLOR} strokeWidth={3} />
            </g>
            {/* Unspooling orange filmstrip */}
            <path
              d="M -60 445 Q 70 495 190 430"
              fill="none"
              stroke="#18222F"
              strokeWidth={32}
              strokeLinecap="round"
            />
            <path
              d="M -60 445 Q 70 495 190 430"
              fill="none"
              stroke="#FFD166"
              strokeWidth={18}
              strokeDasharray="16 14"
            />
            {/* Clapperboard */}
            <g transform="translate(95, 395)">
              <rect x={-90} y={-20} width={180} height={130} rx={8} fill="#1E293B" stroke={OUTLINE_COLOR} strokeWidth={4} />
              <line x1={-70} y1={24} x2={70} y2={24} stroke="#94A3B8" strokeWidth={4} />
              <line x1={-70} y1={58} x2={45} y2={58} stroke="#94A3B8" strokeWidth={4} />
              {/* Hinged clapping slate arm */}
              <g transform={`translate(-90, -20) rotate(${clapAngle.toFixed(1)})`}>
                <rect x={0} y={-28} width={180} height={28} rx={4} fill="#FFFFFF" stroke={OUTLINE_COLOR} strokeWidth={4} />
                {[10, 56, 102, 148].map((sx) => (
                  <polygon key={sx} points={`${sx},-28 ${sx + 24},-28 ${sx + 10},0 ${sx - 14},0`} fill={OUTLINE_COLOR} />
                ))}
              </g>
            </g>
          </g>

          {/* ===== STATION 2 (x=1220): UI DESIGN (DRAFTING COMPASS & FLOATING GEOMETRY) ===== */}
          <g transform="translate(1220, 0)">
            <FloatingCallout x={0} y={132} text="UI DESIGN" size={54} fill="#FFD166" delayFrames={150} />
            {/* Sleek Tilted Drawing Tablet on Stand */}
            <g transform="translate(0, 415)">
              <rect x={-165} y={-110} width={330} height={205} rx={16} fill="#1E293B" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
              <rect x={-148} y={-94} width={296} height={172} rx={8} fill="#F8FAFC" />
              {/* Clean geometric design primitives assembling inside tablet */}
              <rect x={-122} y={-72} width={112} height={128} rx={10} fill="#2EC4B6" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <circle cx={62} cy={-30} r={36} fill="#FF6B4A" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <rect x={16} y={24} width={104} height={28} rx={8} fill="#FFD166" stroke={OUTLINE_COLOR} strokeWidth={3} />
              {/* Animated Illustrator Pen Stylus gliding over canvas */}
              <g transform={`translate(${stylusX.toFixed(1)}, ${stylusY.toFixed(1)}) rotate(-38)`}>
                <rect x={-9} y={-110} width={18} height={95} rx={6} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                <polygon points="-9,-15 9,-15 0,10" fill="#18222F" />
              </g>
            </g>
          </g>

          {/* ===== STATION 3 (x=1920): AI AUTOMATION (INTERLOCKING FACTORY GEARS & ENERGY PIPES) ===== */}
          <g transform="translate(1920, 0)">
            <FloatingCallout x={0} y={132} text="AI AUTOMATION" size={54} fill="#2AD08E" delayFrames={315} />
            {/* Copper Pipe Conduit */}
            <path d="M -220 455 L -95 455 L -95 365 L 220 365" fill="none" stroke="#18222F" strokeWidth={28} strokeLinejoin="round" />
            <path d="M -220 455 L -95 455 L -95 365 L 220 365" fill="none" stroke="#E59866" strokeWidth={18} strokeLinejoin="round" />
            {/* Flowing glowing automation energy orb */}
            <circle cx={-160 + ((frame * 5) % 380)} cy={365} r={12} fill="#2AD08E" stroke={OUTLINE_COLOR} strokeWidth={3} />
            {/* Interlocking Brass Gear 1 */}
            <g transform={`translate(-55, 365) rotate(${gearRot.toFixed(1)})`}>
              <circle r={72} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={4} />
              {Array.from({ length: 8 }, (_, t) => (
                <rect
                  key={t}
                  x={-13}
                  y={-92}
                  width={26}
                  height={24}
                  rx={4}
                  fill="#F5B82E"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3.5}
                  transform={`rotate(${t * 45})`}
                />
              ))}
              <circle r={26} fill="#3B4D80" stroke={OUTLINE_COLOR} strokeWidth={4} />
            </g>
            {/* Counter-rotating Teal Gear 2 */}
            <g transform={`translate(95, 425) rotate(${(-gearRot * 1.25).toFixed(1)})`}>
              <circle r={54} fill="#2AD08E" stroke={OUTLINE_COLOR} strokeWidth={4} />
              {Array.from({ length: 8 }, (_, t) => (
                <rect
                  key={t}
                  x={-10}
                  y={-70}
                  width={20}
                  height={20}
                  rx={3}
                  fill="#2AD08E"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3}
                  transform={`rotate(${t * 45})`}
                />
              ))}
              <circle r={18} fill="#3B4D80" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            </g>
          </g>

          {/* ===== STATION 4 (x=2640): FOUNDER GHOSTWRITING (CLASSIC BRASS TYPEWRITER) ===== */}
          <g transform="translate(2640, 0)">
            <FloatingCallout x={0} y={132} text="GHOSTWRITING" size={54} fill="#FFFFFF" delayFrames={480} />
            <g transform="translate(0, 445)">
              {/* Scrolling crisp white paper rising from roller */}
              <g transform={`translate(0, ${-paperRise.toFixed(1)})`}>
                <rect x={-95} y={-155} width={190} height={160} rx={4} fill="#FFFDF7" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                {[0, 1, 2, 3].map((ln) => (
                  <line
                    key={ln}
                    x1={-72}
                    y1={-122 + ln * 26}
                    x2={72 - (ln === 3 ? 45 : 0)}
                    y2={-122 + ln * 26}
                    stroke="#18222F"
                    strokeWidth={6}
                    strokeLinecap="round"
                  />
                ))}
              </g>
              {/* Typewriter carriage roller */}
              <rect x={-148} y={-52} width={296} height={28} rx={12} fill="#2C3E50" stroke={OUTLINE_COLOR} strokeWidth={4} />
              {/* Vintage Emerald & Brass Typewriter Body */}
              <path
                d="M -135 -24 L 135 -24 L 165 72 L -165 72 Z"
                fill="#1D8A6B"
                stroke={OUTLINE_COLOR}
                strokeWidth={4.5}
              />
              {/* Round Mechanical Keys Popping */}
              {[-95, -57, -19, 19, 57, 95].map((kx, ki) => {
                const pressed = Math.floor(frame / 6) % 6 === ki ? 4 : 0;
                return (
                  <circle
                    key={ki}
                    cx={kx}
                    cy={28 + pressed}
                    r={13}
                    fill="#FFF6E0"
                    stroke={OUTLINE_COLOR}
                    strokeWidth={3}
                  />
                );
              })}
            </g>
          </g>
        </g>
      </svg>

      <KineticSubtitleBar
        narration={beat.narration}
        durationInFrames={durationInFrames}
        enabled={subtitlesEnabled}
      />
    </AbsoluteFill>
  );
};
