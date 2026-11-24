import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { evolvePath } from '@remotion/paths';
import {
  DriftingClouds,
  FloatingCallout,
  FONT_BODY,
  FONT_CONDENSED,
  FONT_DISPLAY,
  ImpactBurst,
  KineticSubtitleBar,
  LeaderCallout,
  SPRING_POP,
  SPRING_SLAM,
  SPRING_SMOOTH,
  SplitBuilding,
  getCameraTransform,
  getImpactShake,
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
// SCENE 01 · DHAKA TWILIGHT STUDIO -> DIVE INTO GLOBAL INTELLIGENCE MAP (LINELESS v6.0)
// ============================================================================
export const Scene01GlobalWindow: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat 1A (0..300f): Rich twilight Dhaka studio overlooking multi-plane sunset skyline
  // Beat 1B (300..end): Silky 2.6x camera dive through laptop screen into World Intelligence Map!
  const zoomSplit = interpolate(frame, [288, 362], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const deskEntry = spring({ frame: Math.max(0, frame - 2), fps, config: SPRING_SMOOTH });
  const lampSwing = Math.sin(frame * 0.04) * 1.4;
  const steamOffset = (frame * 1.15) % 64;
  const fxRate = Math.round(
    interpolate(frame, [75, 235], [1, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  // World signal flight arcs (Part 1B)
  const arcLondon = 'M 742 425 Q 535 165 362 242';
  const arcNyc = 'M 742 425 Q 485 110 250 268';
  const arcSf = 'M 742 425 Q 920 140 1072 270';

  const pLon = evolvePath(
    interpolate(frame, [345, 425], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    arcLondon
  );
  const pNyc = evolvePath(
    interpolate(frame, [375, 455], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    arcNyc
  );
  const pSf = evolvePath(
    interpolate(frame, [405, 485], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    arcSf
  );

  const lonPop = spring({ frame: Math.max(0, frame - 418), fps, config: SPRING_POP });
  const nycPop = spring({ frame: Math.max(0, frame - 448), fps, config: SPRING_POP });
  const sfPop = spring({ frame: Math.max(0, frame - 478), fps, config: SPRING_POP });

  const deskScale =
    1 +
    interpolate(frame, [0, 288], [0, 0.075], { extrapolateRight: 'clamp' }) +
    zoomSplit * 2.55;
  const worldScale =
    0.86 +
    zoomSplit * 0.14 +
    interpolate(frame, [362, durationInFrames], [0, 0.06], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <AbsoluteFill style={{ backgroundColor: '#132238' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="dhakaSunsetSky6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12264A" />
            <stop offset="36%" stopColor="#463E7A" />
            <stop offset="68%" stopColor="#D65A58" />
            <stop offset="100%" stopColor="#FFBA6B" />
          </linearGradient>
          <linearGradient id="roomWall6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3048" />
            <stop offset="100%" stopColor="#132033" />
          </linearGradient>
          <linearGradient id="deskTop6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B87A4B" />
            <stop offset="100%" stopColor="#85512D" />
          </linearGradient>
          <linearGradient id="lampBeam6" x1="0.15" y1="0" x2="0.65" y2="1">
            <stop offset="0%" stopColor="#FFE699" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#FFE699" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="screenGlow6" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0E2E52" />
            <stop offset="100%" stopColor="#071930" />
          </linearGradient>
          <radialGradient id="globalOcean6" cx="55%" cy="46%" r="65%">
            <stop offset="0%" stopColor="#15406B" />
            <stop offset="55%" stopColor="#0D2949" />
            <stop offset="100%" stopColor="#081930" />
          </radialGradient>
          <clipPath id="windowPaneClip6">
            <rect x={156} y={54} width={968} height={418} rx={6} />
          </clipPath>
        </defs>

        {/* ===== PART 1A: LINELESS SPLIT-SHADED DHAKA STUDIO OVERLOOKING GOLDEN SKYLINE ===== */}
        {zoomSplit < 0.99 && (
          <g
            transform={`translate(640, 442) scale(${deskScale.toFixed(4)}) translate(-640, -442)`}
            opacity={1 - Math.max(0, (zoomSplit - 0.55) / 0.45)}
          >
            {/* Architectural Deep Navy Acoustic Studio Wall */}
            <rect width={1280} height={720} fill="url(#roomWall6)" />
            {/* Vertical Architectural Wall Fluting */}
            {[28, 56, 84, 112, 1168, 1196, 1224, 1252].map((vx) => (
              <rect key={vx} x={vx} y={0} width={10} height={500} fill="#18273B" opacity={0.7} />
            ))}
            {/* Warm Ceiling Shadow & Chair Rail */}
            <rect x={0} y={0} width={1280} height={24} fill="#0D1726" />
            <rect x={0} y={474} width={1280} height={28} fill="#101B2B" />

            {/* Left Wall: Editorial Cork Pinboard with Split Shadow */}
            <g transform="translate(76, 198)">
              <rect x={-48} y={-68} width={104} height={144} rx={4} fill="rgba(7,12,22,0.34)" />
              <rect x={-54} y={-74} width={104} height={144} rx={4} fill="#9E6B40" />
              <rect x={-46} y={-66} width={88} height={128} rx={2} fill="#C68E5D" />
              <rect x={-36} y={-50} width={38} height={30} rx={2} fill="#FFFDF6" transform="rotate(-5 -17 -35)" />
              <rect x={-2} y={-2} width={38} height={34} rx={2} fill="#FFE9A3" transform="rotate(6 17 15)" />
              <line x1={-18} y1={-46} x2={16} y2={2} stroke="#FF5A5F" strokeWidth={2} strokeDasharray="4 3" />
              <circle cx={-18} cy={-46} r={3.5} fill="#FF5A5F" />
              <circle cx={16} cy={2} r={3.5} fill="#2AD08E" />
            </g>

            {/* Right Wall: Minimalist Brass Wall Clock + Floating Book Shelf */}
            <g transform="translate(1204, 162)">
              <circle cx={4} cy={6} r={38} fill="rgba(7,12,22,0.34)" />
              <circle r={38} fill="#D99B26" />
              <circle r={32} fill="#FAF6EE" />
              <path d="M 0 -32 A 32 32 0 0 1 32 0 L 0 0 Z" fill="#EFE7D6" opacity={0.6} />
              <line x1={0} y1={0} x2={0} y2={-19} stroke="#1B2A40" strokeWidth={3} strokeLinecap="round" transform={`rotate(${(frame * 0.25).toFixed(1)})`} />
              <line x1={0} y1={0} x2={14} y2={5} stroke="#E63946" strokeWidth={2} strokeLinecap="round" transform={`rotate(${(frame * 1.5).toFixed(1)})`} />
              <circle r={3.5} fill="#1B2A40" />
            </g>
            <g transform="translate(1204, 326)">
              <rect x={-50} y={4} width={104} height={10} fill="rgba(7,12,22,0.32)" />
              <rect x={-52} y={0} width={104} height={10} rx={2} fill="#8C5932" />
              <rect x={-42} y={-50} width={16} height={50} fill="#E05A47" />
              <rect x={-34} y={-50} width={8} height={50} fill="#BA4130" />
              <rect x={-24} y={-60} width={18} height={60} fill="#219E8A" />
              <rect x={-14} y={-60} width={8} height={60} fill="#167868" />
              <rect x={-4} y={-44} width={16} height={44} fill="#F5B82E" />
              <rect x={16} y={-54} width={16} height={54} fill="#3B82C4" transform="rotate(10 24 -27)" />
            </g>

            {/* PANORAMIC BALCONY WINDOW OVERLOOKING GOLDEN-HOUR DHAKA */}
            <g clipPath="url(#windowPaneClip6)">
              <rect x={156} y={54} width={968} height={418} fill="url(#dhakaSunsetSky6)" />
              {/* Radiant Sunset Halo Rings */}
              <circle cx={640} cy={312} r={210} fill="#FFCC70" opacity={0.12} />
              <circle cx={640} cy={312} r={148} fill="#FFD685" opacity={0.22} />
              <circle cx={640} cy={312} r={92} fill="#FFF3C4" opacity={0.92} />

              <DriftingClouds frame={frame} tint="#FFE7CC" shadeTint="#D97E6A" opacity={0.86} speed={0.44} />

              {/* Gliding Evening Birds */}
              {[0, 1, 2, 3].map((bi) => {
                const bx = 210 + ((frame * (1.05 + bi * 0.22) + bi * 215) % 900);
                const by = 132 + bi * 26;
                const wing = Math.sin(frame * 0.22 + bi) * 4.5;
                return (
                  <path
                    key={bi}
                    d={`M ${bx - 11} ${by + wing} Q ${bx - 4} ${by - 5} ${bx} ${by} Q ${bx + 4} ${by - 5} ${bx + 11} ${by + wing}`}
                    fill="none"
                    stroke="#2A2648"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Plane 1 (Far Atmospheric Haze Dhaka Skyline + Iconic Mosque Dome & Minaret) */}
              <path
                d="M 156 472 L 156 348 L 210 348 L 210 302 L 256 302 L 256 340 L 315 340 L 315 268 L 372 268 L 372 330 L 420 330 Q 458 265 496 330 L 512 330 L 512 238 L 522 238 L 522 330 L 560 330 L 560 288 L 620 288 L 620 346 L 706 346 L 706 276 L 765 276 L 765 332 L 826 332 L 826 250 L 892 250 L 892 318 L 964 318 L 964 282 L 1032 282 L 1032 338 L 1124 338 L 1124 472 Z"
                fill="#59416B"
                opacity={0.72}
              />

              {/* Plane 2 (Midground Split-Shaded Dhaka Towers with Glowing Amber Windows) */}
              <SplitBuilding x={174} y={332} w={92} h={140} litColor="#2D3E5E" shadeColor="#1D2A42" frame={frame} spire />
              <SplitBuilding x={294} y={298} w={84} h={174} litColor="#273754" shadeColor="#1A263C" frame={frame} />
              <SplitBuilding x={402} y={356} w={74} h={116} litColor="#2D3E5E" shadeColor="#1D2A42" frame={frame} />
              <SplitBuilding x={804} y={316} w={86} h={156} litColor="#273754" shadeColor="#1A263C" frame={frame} spire />
              <SplitBuilding x={914} y={288} w={94} h={184} litColor="#2D3E5E" shadeColor="#1D2A42" frame={frame} />
              <SplitBuilding x={1028} y={338} w={82} h={134} litColor="#25344E" shadeColor="#182336" frame={frame} />

              {/* Subtle Sunset Horizon Glow Mist */}
              <rect x={156} y={422} width={968} height={50} fill="#FFBA6B" opacity={0.14} />
            </g>

            {/* Sleek Architectural Window Frame & Mullions (Lineless Shadowed Aluminum!) */}
            <rect x={156} y={54} width={968} height={418} rx={6} fill="none" stroke="#101B2B" strokeWidth={14} />
            <rect x={162} y={60} width={956} height={406} rx={3} fill="none" stroke="#364C68" strokeWidth={2.5} />
            <rect x={476} y={54} width={8} height={418} fill="#101B2B" />
            <rect x={796} y={54} width={8} height={418} fill="#101B2B" />
            {/* Split-shaded Walnut Window Sill */}
            <rect x={140} y={468} width={1000} height={14} rx={2} fill="#6B4730" />
            <rect x={140} y={478} width={1000} height={5} fill="#442B1B" />

            {/* Clean Broadcast Headline Floating in Open Sunset Sky */}
            <FloatingCallout
              x={640}
              y={144}
              text={`$1 = ৳${fxRate}`}
              subtext="DHAKA DESK · GLOBAL DOLLAR LEVERAGE"
              size={64}
              fill="#FFFFFF"
              accent="#FFD166"
              delayFrames={42}
            />

            {/* FOREGROUND: WARM WALNUT ARCHITECTURAL DESK & SPLIT-SHADED HERO PROPS */}
            <g transform={`translate(0, ${(1 - deskEntry) * 84})`}>
              <rect x={0} y={502} width={1280} height={218} fill="url(#deskTop6)" />
              {/* Crisp Lit Front Desk Bevel Edge */}
              <rect x={0} y={502} width={1280} height={14} fill="#D89E68" />
              <rect x={0} y={516} width={1280} height={5} fill="#6B4122" opacity={0.45} />

              {/* Hard Diagonal 45-Degree Cast Shadows Across Desk (Infographics Show Signature!) */}
              <polygon points="468,554 812,554 875,612 520,612" fill="rgba(16,24,38,0.28)" />
              <polygon points="894,548 952,548 986,582 920,582" fill="rgba(16,24,38,0.24)" />
              <polygon points="1038,546 1168,546 1196,574 1066,574" fill="rgba(16,24,38,0.22)" />
              <polygon points="222,554 306,554 352,592 256,592" fill="rgba(16,24,38,0.24)" />

              {/* Left Foreground Prop: Split-Shaded Lush Potted Plant */}
              <g transform="translate(114, 534)">
                <g transform={`rotate(${(Math.sin(frame * 0.04) * 2.2).toFixed(2)})`}>
                  <path d="M 0 -52 Q -56 -124 -76 -88 Q -42 -60 0 -52 Z" fill="#1F8A5B" />
                  <path d="M 0 -58 Q -28 -148 8 -140 Q 22 -96 0 -58 Z" fill="#2AD08E" />
                  <path d="M 0 -58 Q 8 -140 8 -140 Q 22 -96 0 -58 Z" fill="#1DA872" />
                  <path d="M 4 -52 Q 66 -114 76 -74 Q 40 -54 4 -52 Z" fill="#166E48" />
                </g>
                {/* Split-Shaded Terracotta Pot */}
                <polygon points="-38,-56 38,-56 28,14 -28,14" fill="#D96B43" />
                <polygon points="0,-56 38,-56 28,14 0,14" fill="#B5502C" />
                <rect x={-44} y={-68} width={88} height={15} rx={3} fill="#EB825A" />
                <rect x={0} y={-68} width={44} height={15} rx={2} fill="#C9603B" />
              </g>

              {/* Split-Shaded Brass Architect Desk Lamp Casting Volumetric Warm Cone */}
              <g transform={`translate(264, 538) rotate(${lampSwing.toFixed(2)})`}>
                <polygon points="32,-166 286,44 -54,44" fill="url(#lampBeam6)" />
                <path d="M -40 16 L 40 16 L 30 0 L -30 0 Z" fill="#E8AE38" />
                <path d="M 0 16 L 40 16 L 30 0 L 0 0 Z" fill="#C48B20" />
                <path d="M 0 0 L -38 -116 L 42 -186" fill="none" stroke="#D99B26" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 0 0 L -38 -116 L 42 -186" fill="none" stroke="#FFE082" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
                <circle cx={-38} cy={-116} r={9} fill="#1B2A40" />
                <circle cx={-38} cy={-116} r={4.5} fill="#FFD166" />
                <path d="M 14 -194 Q 56 -218 88 -174 L 18 -156 Z" fill="#F5B82E" />
                <path d="M 48 -196 Q 72 -192 88 -174 L 46 -163 Z" fill="#C98D1C" />
                <ellipse cx={53} cy={-165} rx={32} ry={8} fill="#FFF3C4" transform="rotate(-14 53 -165)" />
              </g>

              {/* CENTER HERO: BRUSHED-ALUMINUM LAPTOP (THE GLOBAL WINDOW!) */}
              <g transform="translate(640, 442)">
                {/* Outer Split-Shaded Anodized Bezel */}
                <rect x={-176} y={-126} width={352} height={214} rx={12} fill="#1E293B" />
                <rect x={-176} y={-126} width={352} height={4} rx={2} fill="#475569" />
                {/* Luminous Deep-Blue Global Map Screen */}
                <rect x={-160} y={-110} width={320} height={182} rx={5} fill="url(#screenGlow6)" />
                {/* Subtle Glass Reflection Streak */}
                <polygon points="-160,-110 24,-110 -68,72 -160,72" fill="#FFFFFF" opacity={0.055} />
                {/* Animated Global Meridian + Pulsing Arcs inside Screen */}
                <circle cx={0} cy={-18} r={62} fill="none" stroke="#38BDF8" strokeWidth={1.6} opacity={0.45} />
                <ellipse cx={0} cy={-18} rx={30} ry={62} fill="none" stroke="#38BDF8" strokeWidth={1.4} opacity={0.38} />
                <line x1={-62} y1={-18} x2={62} y2={-18} stroke="#38BDF8" strokeWidth={1.2} opacity={0.35} />
                <path d="M 0 -8 Q -56 -66 -104 -34" fill="none" stroke="#FFD166" strokeWidth={3.5} strokeLinecap="round" />
                <path d="M 0 -8 Q 56 -70 106 -28" fill="none" stroke="#2AD08E" strokeWidth={3.5} strokeLinecap="round" />
                <circle cx={0} cy={-8} r={7 + Math.sin(frame * 0.2) * 2.2} fill="#FFD166" opacity={0.35} />
                <circle cx={0} cy={-8} r={4.5} fill="#FFD166" />
                <circle cx={-104} cy={-34} r={5.5} fill="#FFD166" />
                <circle cx={106} cy={-28} r={5.5} fill="#2AD08E" />
                {/* Brushed-Aluminum Split-Shaded Keyboard Deck */}
                <polygon points="-182,88 182,88 224,118 -224,118" fill="#CBD5E1" />
                <polygon points="0,88 182,88 224,118 0,118" fill="#B6C4D4" />
                <polygon points="-224,118 224,118 220,124 -220,124" fill="#64748B" />
                <polygon points="-156,92 156,92 174,104 -174,104" fill="#334155" opacity={0.6} />
                <rect x={-46} y={107} width={92} height={6} rx={3} fill="#94A3B8" />
              </g>

              {/* Leader-Line Callout Pointing Directly to Laptop Global Window */}
              <LeaderCallout
                targetX={754}
                targetY={412}
                elbowX={812}
                elbowY={356}
                endX={1020}
                label="ONE GLOWING WINDOW"
                sublabel="DIRECT TO GLOBAL MARKETS"
                accent="#2AD08E"
                delayFrames={92}
              />

              {/* Split-Shaded Terracotta Clay Tea Cup ("Cha") with Translucent Steam */}
              <g transform="translate(924, 512)">
                {[0, 1].map((sIdx) => {
                  const sy = -((steamOffset + sIdx * 32) % 64);
                  const sop = Math.sin((((steamOffset + sIdx * 32) % 64) / 64) * Math.PI);
                  return (
                    <path
                      key={sIdx}
                      d={`M ${-7 + sIdx * 14} ${sy - 14} Q ${-17 + sIdx * 14} ${sy - 32} ${-3 + sIdx * 14} ${sy - 50}`}
                      fill="none"
                      stroke="#FFF6E5"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      opacity={sop * 0.68}
                    />
                  );
                })}
                <path d="M 24 2 Q 42 4 40 20 Q 38 33 22 31" fill="none" stroke="#B5502C" strokeWidth={7} strokeLinecap="round" />
                <path d="M -27 -8 L 27 -8 L 21 40 Q 19 48 0 48 Q -19 48 -21 40 Z" fill="#D96B43" />
                <path d="M 0 -8 L 27 -8 L 21 40 Q 19 48 0 48 Z" fill="#B5502C" />
                <ellipse cx={0} cy={-8} rx={27} ry={7.5} fill="#6E361B" />
                <path d="M -17 4 L -13 36" stroke="#F49D7A" strokeWidth={3.5} strokeLinecap="round" opacity={0.65} />
              </g>

              {/* Right Desk Prop: Split-Shaded Notebook + Drafting Pencil */}
              <g transform="translate(1102, 536) rotate(-5)">
                <rect x={-62} y={-22} width={124} height={44} rx={4} fill="#F8F5EC" />
                <rect x={-62} y={-22} width={16} height={44} rx={3} fill="#1E3A5F" />
                <line x1={-36} y1={-6} x2={44} y2={-6} stroke="#94A3B8" strokeWidth={3} strokeLinecap="round" />
                <line x1={-36} y1={7} x2={26} y2={7} stroke="#CBD5E1" strokeWidth={3} strokeLinecap="round" />
                <rect x={-52} y={24} width={104} height={8} rx={3} fill="#F5B82E" />
                <polygon points="52,24 66,28 52,32" fill="#E8C39E" />
              </g>
            </g>
          </g>
        )}

        {/* ===== PART 1B: AUTHENTIC INFOGRAPHICS SHOW GLOBAL INTELLIGENCE MAP ===== */}
        {zoomSplit > 0.02 && (
          <g
            transform={`translate(640, 360) scale(${worldScale.toFixed(4)}) translate(-640, -360)`}
            opacity={zoomSplit}
          >
            <rect width={1280} height={720} fill="url(#globalOcean6)" />

            {/* Precision Geopolitical Map Latitude/Longitude Grid */}
            <g stroke="#38BDF8" strokeWidth={1} opacity={0.16}>
              {[120, 220, 320, 420, 520, 620].map((gy) => (
                <line key={gy} x1={0} y1={gy} x2={1280} y2={gy} />
              ))}
              {[160, 320, 480, 640, 800, 960, 1120].map((gx) => (
                <line key={gx} x1={gx} y1={0} x2={gx} y2={720} />
              ))}
            </g>

            {/* Detailed Multi-Point Lineless Continents with Deep 3D Extrusion Shelf */}
            <g transform="translate(0, 10)" fill="#071B30" opacity={0.7}>
              {/* North America */}
              <path d="M 62 162 L 188 134 L 288 158 L 326 215 L 274 275 L 236 332 L 194 316 L 148 264 L 94 226 Z" />
              {/* South America */}
              <path d="M 244 366 L 312 378 L 352 448 L 316 558 L 266 592 L 246 492 L 222 424 Z" />
              {/* Europe */}
              <path d="M 432 168 L 520 138 L 602 156 L 616 218 L 552 256 L 478 248 L 444 212 Z" />
              {/* Africa */}
              <path d="M 468 278 L 578 276 L 634 342 L 606 462 L 542 548 L 494 456 L 456 356 Z" />
              {/* Asia + South Asia / Bengal Delta */}
              <path d="M 616 154 L 834 134 L 1032 162 L 1118 256 L 1054 348 L 962 396 L 856 412 L 774 446 L 732 454 L 692 384 L 622 316 L 594 242 Z" />
              {/* Australia */}
              <path d="M 944 472 L 1068 462 L 1112 536 L 1044 584 L 952 554 Z" />
            </g>
            <g fill="#1E6B7B">
              <path d="M 62 162 L 188 134 L 288 158 L 326 215 L 274 275 L 236 332 L 194 316 L 148 264 L 94 226 Z" />
              <path d="M 244 366 L 312 378 L 352 448 L 316 558 L 266 592 L 246 492 L 222 424 Z" />
              <path d="M 432 168 L 520 138 L 602 156 L 616 218 L 552 256 L 478 248 L 444 212 Z" />
              <path d="M 468 278 L 578 276 L 634 342 L 606 462 L 542 548 L 494 456 L 456 356 Z" />
              <path d="M 616 154 L 834 134 L 1032 162 L 1118 256 L 1054 348 L 962 396 L 856 412 L 774 446 L 732 454 L 692 384 L 622 316 L 594 242 Z" />
              <path d="M 944 472 L 1068 462 L 1112 536 L 1044 584 L 952 554 Z" />
            </g>
            {/* Sunlit Topographical Ridge Highlights on Continents */}
            <g fill="#28899C" opacity={0.48}>
              <path d="M 95 168 L 195 148 L 272 172 L 220 226 L 122 214 Z" />
              <path d="M 638 170 L 842 152 L 1012 184 L 952 276 L 748 290 L 638 232 Z" />
            </g>

            {/* Glowing Flight/Data Signal Arcs From Dhaka (Dual Glow + Crisp Core) */}
            <path d={arcLondon} fill="none" stroke="#FFD166" strokeWidth={11} strokeLinecap="round" opacity={0.22} strokeDasharray={pLon.strokeDasharray} strokeDashoffset={pLon.strokeDashoffset} />
            <path d={arcLondon} fill="none" stroke="#FFD166" strokeWidth={4} strokeLinecap="round" strokeDasharray={pLon.strokeDasharray} strokeDashoffset={pLon.strokeDashoffset} />

            <path d={arcNyc} fill="none" stroke="#2AD08E" strokeWidth={11} strokeLinecap="round" opacity={0.22} strokeDasharray={pNyc.strokeDasharray} strokeDashoffset={pNyc.strokeDashoffset} />
            <path d={arcNyc} fill="none" stroke="#2AD08E" strokeWidth={4} strokeLinecap="round" strokeDasharray={pNyc.strokeDasharray} strokeDashoffset={pNyc.strokeDashoffset} />

            <path d={arcSf} fill="none" stroke="#FF7B54" strokeWidth={11} strokeLinecap="round" opacity={0.22} strokeDasharray={pSf.strokeDasharray} strokeDashoffset={pSf.strokeDashoffset} />
            <path d={arcSf} fill="none" stroke="#FF7B54" strokeWidth={4} strokeLinecap="round" strokeDasharray={pSf.strokeDasharray} strokeDashoffset={pSf.strokeDashoffset} />

            {/* Dhaka Origin Radar Beacon */}
            <g transform="translate(742, 425)">
              <circle r={34 + Math.sin(frame * 0.14) * 10} fill="none" stroke="#2AD08E" strokeWidth={2.5} opacity={0.45} />
              <circle r={18 + Math.sin(frame * 0.14) * 5} fill="#2AD08E" opacity={0.26} />
              <circle r={9} fill="#2AD08E" />
              <circle r={4} fill="#FFFFFF" />
            </g>
            <LeaderCallout
              targetX={742}
              targetY={425}
              elbowX={784}
              elbowY={488}
              endX={922}
              label="DHAKA HUB"
              sublabel="ORIGIN · UTC+6"
              accent="#2AD08E"
              delayFrames={342}
            />

            {/* Landmark 1: LONDON (Split-Shaded Big Ben Tower) */}
            <g transform={`translate(362, 242) scale(${Math.max(0.001, lonPop)})`}>
              <circle r={22} fill="#FFD166" opacity={0.2} />
              <rect x={-14} y={-80} width={16} height={80} fill="#E8BE74" />
              <rect x={2} y={-80} width={12} height={80} fill="#C4964B" />
              <polygon points="-20,-80 0,-122 0,-80" fill="#3B536E" />
              <polygon points="0,-122 20,-80 0,-80" fill="#23364B" />
              <circle cx={0} cy={-56} r={9} fill="#FFF8DC" />
              <text x={0} y={28} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={26} fill="#FFFFFF" letterSpacing="0.06em">
                LONDON
              </text>
            </g>

            {/* Landmark 2: NEW YORK (Split-Shaded Empire State) */}
            <g transform={`translate(250, 268) scale(${Math.max(0.001, nycPop)})`}>
              <circle r={22} fill="#2AD08E" opacity={0.2} />
              <rect x={-18} y={-74} width={20} height={74} fill="#E2E8F0" />
              <rect x={2} y={-74} width={16} height={74} fill="#94A3B8" />
              <rect x={-10} y={-100} width={20} height={26} fill="#F1F5F9" />
              <line x1={0} y1={-100} x2={0} y2={-132} stroke="#FFD166" strokeWidth={3.5} strokeLinecap="round" />
              <text x={0} y={28} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={26} fill="#2AD08E" letterSpacing="0.06em">
                NEW YORK
              </text>
            </g>

            {/* Landmark 3: SAN FRANCISCO (Lineless Golden Gate Bridge) */}
            <g transform={`translate(1072, 270) scale(${Math.max(0.001, sfPop)})`}>
              <circle r={22} fill="#FF7B54" opacity={0.2} />
              <rect x={-44} y={-64} width={9} height={64} fill="#E85D4A" />
              <rect x={35} y={-64} width={9} height={64} fill="#C74332" />
              <path d="M -76 -14 Q -40 -62 0 -14 Q 40 -62 76 -14" fill="none" stroke="#FF7B54" strokeWidth={3.5} />
              <rect x={-80} y={-16} width={160} height={8} fill="#D94A38" />
              <text x={0} y={28} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={26} fill="#FFFFFF" letterSpacing="0.06em">
                SAN FRANCISCO
              </text>
            </g>

            <FloatingCallout
              x={640}
              y={78}
              text="ONE GLOBAL WINDOW"
              subtext="BORDERLESS CLIENT NETWORK"
              size={48}
              fill="#FFFFFF"
              accent="#2AD08E"
              delayFrames={356}
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
// SCENE 02 · INDUSTRIAL $5 FACTORY PIT vs ULTRA-MODERN GLASS FOUNDER METROPOLIS
// ============================================================================
export const Scene02BiddingVsX: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealX = interpolate(frame, [350, 425], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const beltOffset = (frame * 5.8) % 80;
  const gearRot = frame * 1.1;
  const bidCount = Math.round(
    interpolate(frame, [16, 260], [120, 10000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const redSlash = spring({ frame: Math.max(0, frame - 275), fps, config: SPRING_SLAM });
  const shake = getImpactShake(frame, 275, 16);
  const beaconPulse = (frame * 2.4) % 180;
  const towerPop = spring({ frame: Math.max(0, frame - 405), fps, config: SPRING_POP });

  return (
    <AbsoluteFill style={{ backgroundColor: '#241017' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="factoryBg6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B0D14" />
            <stop offset="58%" stopColor="#3B1622" />
            <stop offset="100%" stopColor="#591E2B" />
          </linearGradient>
          <radialGradient id="alarmGlow6" cx="50%" cy="18%" r="55%">
            <stop offset="0%" stopColor="#FF3B47" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#FF3B47" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="metropolisSky6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E4B8A" />
            <stop offset="56%" stopColor="#3693D6" />
            <stop offset="100%" stopColor="#B4E4FF" />
          </linearGradient>
          <clipPath id="scene02DiagWipe6">
            <polygon
              points={`0,0 ${(revealX * 1440).toFixed(1)},0 ${(revealX * 1440 - 160).toFixed(1)},720 0,720`}
            />
          </clipPath>
        </defs>

        {/* ===== PART 2A: RICH INDUSTRIAL FACTORY CONVEYOR PIT (EDGE-TO-EDGE!) ===== */}
        <g transform={`translate(${shake.x.toFixed(1)}, ${shake.y.toFixed(1)})`}>
          <g transform={getCameraTransform(frame, 380, 'push')}>
            <rect width={1280} height={720} fill="url(#factoryBg6)" />
            <rect width={1280} height={720} fill="url(#alarmGlow6)" />

            {/* Overhead Industrial Warehouse Steel Roof Trusses */}
            <g stroke="#29121B" strokeWidth={8}>
              <line x1={0} y1={52} x2={1280} y2={52} strokeWidth={14} />
              {[0, 160, 320, 480, 640, 800, 960, 1120].map((tx) => (
                <g key={tx}>
                  <line x1={tx} y1={0} x2={tx + 80} y2={52} />
                  <line x1={tx + 80} y1={52} x2={tx + 160} y2={0} />
                </g>
              ))}
            </g>

            {/* Giant Background Turning Industrial Gears (Depth Layer) */}
            <g transform={`translate(185, 360) rotate(${gearRot.toFixed(1)})`} opacity={0.42}>
              <circle r={115} fill="#2D131C" />
              {Array.from({ length: 10 }, (_, t) => (
                <rect key={t} x={-16} y={-142} width={32} height={32} rx={3} fill="#2D131C" transform={`rotate(${t * 36})`} />
              ))}
              <circle r={48} fill="#3B1622" />
            </g>
            <g transform={`translate(1095, 315) rotate(${(-gearRot * 0.85).toFixed(1)})`} opacity={0.42}>
              <circle r={136} fill="#2D131C" />
              {Array.from({ length: 12 }, (_, t) => (
                <rect key={t} x={-16} y={-166} width={32} height={34} rx={3} fill="#2D131C" transform={`rotate(${t * 30})`} />
              ))}
              <circle r={56} fill="#3B1622" />
            </g>

            {/* Background Factory Silos, Exhaust Pipes & Flickering Red Warning Beacons */}
            <rect x={42} y={140} width={118} height={340} fill="#261119" />
            <rect x={160} y={205} width={88} height={275} fill="#1E0D14" />
            <rect x={1015} y={165} width={110} height={315} fill="#261119" />
            <rect x={1125} y={118} width={115} height={362} fill="#1E0D14" />
            {[100, 1180].map((bx, i) => (
              <g key={i} transform={`translate(${bx}, 118)`}>
                <circle r={34} fill="#FF3B47" opacity={0.22 + 0.18 * Math.sin(frame * 0.2 + i)} />
                <rect x={-12} y={-18} width={24} height={22} rx={6} fill="#FF4757" />
                <rect x={-16} y={2} width={32} height={8} fill="#4A5568" />
              </g>
            ))}

            {/* Industrial Overhead Steel Hopper Chute (Split-Shaded 3D!) */}
            <g>
              <polygon points="486,42 794,42 716,196 564,196" fill="#475569" />
              <polygon points="640,42 794,42 716,196 640,196" fill="#334155" />
              <rect x={470} y={28} width={340} height={22} rx={4} fill="#64748B" />
              <rect x={640} y={28} width={170} height={22} rx={3} fill="#475569" />
              {/* Rivets along hopper lip */}
              {[502, 548, 594, 686, 732, 778].map((rx) => (
                <circle key={rx} cx={rx} cy={39} r={3.5} fill="#94A3B8" />
              ))}
              {/* Yellow-Black Warning Stripes on Chute Collar */}
              <rect x={558} y={184} width={164} height={16} fill="#F5B82E" />
              {[566, 598, 630, 662, 694].map((hx) => (
                <polygon key={hx} points={`${hx},184 ${hx + 16},184 ${hx + 6},200 ${hx - 10},200`} fill="#1B222D" />
              ))}
            </g>

            {/* Torrent of Falling $5 / $4 / $3 / $2 Price Tags */}
            {[
              { x: 562, speed: 6.4, label: '$5', rot: -22, phase: 0 },
              { x: 612, speed: 7.2, label: '$4', rot: 16, phase: 42 },
              { x: 658, speed: 5.9, label: '$3', rot: -15, phase: 88 },
              { x: 702, speed: 7.8, label: '$5', rot: 24, phase: 132 },
              { x: 586, speed: 6.8, label: '$2', rot: -28, phase: 174 },
              { x: 676, speed: 6.2, label: '$4', rot: 12, phase: 220 },
              { x: 632, speed: 8.2, label: '$3', rot: -8, phase: 264 },
            ].map((tag, i) => {
              const ty = 204 + ((frame * tag.speed + tag.phase) % 270);
              return (
                <g key={i} transform={`translate(${tag.x}, ${ty}) rotate(${tag.rot + frame * 0.45})`}>
                  <polygon points="-32,-17 20,-17 34,0 20,17 -32,17" fill="#FFF1D6" />
                  <polygon points="-32,4 30,4 20,17 -32,17" fill="#E8D2B0" />
                  <circle cx={19} cy={0} r={4} fill="#DC2626" />
                  <text x={-8} y={6} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={22} fill="#B91C1C">
                    {tag.label}
                  </text>
                </g>
              );
            })}

            {/* Heavy Split-Shaded Factory Conveyor Belt + Support Legs */}
            {[160, 480, 800, 1120].map((lx) => (
              <g key={lx}>
                <rect x={lx - 14} y={548} width={28} height={172} fill="#1E293B" />
                <rect x={lx} y={548} width={14} height={172} fill="#0F172A" />
              </g>
            ))}
            <rect x={-40} y={468} width={1360} height={82} rx={38} fill="#334155" />
            <rect x={-40} y={468} width={1360} height={14} fill="#475569" />
            <rect x={-40} y={486} width={1360} height={46} fill="#1E293B" />
            {Array.from({ length: 18 }, (_, i) => {
              const rx = ((i * 80 - beltOffset) + 1440) % 1440 - 80;
              return (
                <g key={i} transform={`translate(${rx}, 509)`}>
                  <circle r={17} fill="#64748B" />
                  <circle r={11} fill="#334155" />
                  <circle r={5} fill="#F5B82E" />
                </g>
              );
            })}

            {/* Wall-Mounted Glowing Industrial Counter on Left */}
            <FloatingCallout
              x={248}
              y={178}
              text={`${bidCount.toLocaleString()} BIDS`}
              subtext="CROWDED $5 MARKETPLACE PIT"
              size={58}
              fill="#FF6B6B"
              accent="#F5B82E"
              delayFrames={12}
            />

            {/* Blazing Red X Laser Slash + Impact Burst */}
            {frame >= 275 && (
              <g transform={`translate(640, 356) scale(${Math.max(0.001, redSlash)})`}>
                <line x1={-240} y1={-155} x2={240} y2={155} stroke="#FF3B47" strokeWidth={46} strokeLinecap="round" opacity={0.28} />
                <line x1={240} y1={-155} x2={-240} y2={155} stroke="#FF3B47" strokeWidth={46} strokeLinecap="round" opacity={0.28} />
                <line x1={-228} y1={-148} x2={228} y2={148} stroke="#FF3B47" strokeWidth={28} strokeLinecap="round" />
                <line x1={228} y1={-148} x2={-228} y2={148} stroke="#FF3B47" strokeWidth={28} strokeLinecap="round" />
                <line x1={-228} y1={-148} x2={228} y2={148} stroke="#FFE4E6" strokeWidth={7} strokeLinecap="round" opacity={0.55} />
              </g>
            )}
            <ImpactBurst x={640} y={356} triggerFrame={275} color="#FFD166" radius={162} />
          </g>
        </g>

        {/* ===== PART 2B: ULTRA-MODERN SUNLIT GLASS METROPOLIS (DIAGONAL WIPE!) ===== */}
        {revealX > 0.005 && (
          <g clipPath="url(#scene02DiagWipe6)">
            <rect width={1280} height={720} fill="url(#metropolisSky6)" />
            <DriftingClouds frame={frame} tint="#FFFFFF" shadeTint="#B3DCF2" opacity={0.92} speed={0.55} />

            {/* Far Atmospheric Skyline Silhouette */}
            <path
              d="M 0 545 L 0 385 L 68 385 L 68 310 L 142 310 L 142 368 L 220 368 L 220 278 L 316 278 L 316 392 L 964 392 L 964 288 L 1052 288 L 1052 355 L 1142 355 L 1142 305 L 1220 305 L 1220 370 L 1280 370 L 1280 545 Z"
              fill="#6AB3E0"
              opacity={0.58}
            />

            {/* Multi-Plane Lineless Split-Shaded Glass Founder Skyscrapers */}
            <g transform={`translate(${(1 - revealX) * 70}, 0)`}>
              <SplitBuilding x={52} y={295} w={118} h={265} litColor="#3B8AC4" shadeColor="#25679B" windowColor="rgba(255,255,255,0.28)" litWindowColor="#FFE599" frame={frame} />
              <SplitBuilding x={196} y={218} w={146} h={342} litColor="#2B74B0" shadeColor="#1B5282" windowColor="rgba(255,255,255,0.24)" litWindowColor="#FFD166" frame={frame} spire />
              <SplitBuilding x={936} y={232} w={146} h={328} litColor="#2B74B0" shadeColor="#1B5282" windowColor="rgba(255,255,255,0.24)" litWindowColor="#FFD166" frame={frame} spire />
              <SplitBuilding x={1108} y={304} w={122} h={256} litColor="#3B8AC4" shadeColor="#25679B" windowColor="rgba(255,255,255,0.28)" litWindowColor="#FFE599" frame={frame} />

              {/* Sleek Modern Rooftop Broadcast Terrace Foreground */}
              <rect x={0} y={536} width={1280} height={184} fill="#1E3046" />
              <rect x={0} y={536} width={1280} height={14} fill="#385475" />

              {/* Direct Emerald/Gold Signal Beams Into Founder Boardrooms */}
              <line x1={594} y1={246} x2={268} y2={252} stroke="#FFD166" strokeWidth={4} strokeDasharray="10 8" />
              <line x1={686} y1={246} x2={1008} y2={268} stroke="#2AD08E" strokeWidth={4} strokeDasharray="10 8" />
              <circle cx={268} cy={252} r={16} fill="#FFD166" opacity={0.28} />
              <circle cx={268} cy={252} r={7} fill="#FFD166" />
              <circle cx={1008} cy={268} r={16} fill="#2AD08E" opacity={0.28} />
              <circle cx={1008} cy={268} r={7} fill="#2AD08E" />

              {/* HERO CENTER: SPLIT-SHADED X ARCHITECTURAL BROADCAST SPIRE */}
              <g transform={`translate(640, 536) scale(${Math.max(0.001, towerPop)})`}>
                {/* Concentric Radio Signal Waves */}
                {[0, 1, 2].map((w) => {
                  const r = 48 + ((beaconPulse + w * 60) % 180);
                  const op = Math.max(0, 1 - r / 228);
                  return (
                    <circle key={w} cx={0} cy={-290} r={r} fill="none" stroke="#FFFFFF" strokeWidth={4.5} opacity={op * 0.72} />
                  );
                })}
                {/* Architectural Tapered Steel Spire (Split Lit/Shaded) */}
                <polygon points="-76,0 -22,-278 0,-278 0,0" fill="#F8FAFC" />
                <polygon points="0,-278 22,-278 76,0 0,0" fill="#CBD5E1" />
                <rect x={-56} y={-72} width={112} height={8} fill="#64748B" />
                <rect x={-42} y={-146} width={84} height={8} fill="#64748B" />
                <rect x={-28} y={-216} width={56} height={8} fill="#64748B" />
                {/* Dark Obsidian & Gold X Crown Disc */}
                <circle cx={0} cy={-290} r={48} fill="#0F172A" />
                <circle cx={0} cy={-290} r={42} fill="none" stroke="#FFD166" strokeWidth={4} />
                <text x={0} y={-273} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={46} fill="#FFD166">
                  𝕏
                </text>
              </g>

              <FloatingCallout
                x={640}
                y={96}
                text="ZERO GATEKEEPERS"
                subtext="FOUNDERS READ DIRECTLY IN PUBLIC ON X"
                size={54}
                fill="#FFFFFF"
                accent="#FFD166"
                delayFrames={426}
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
// SCENE 03 · STUDIO SPOTLIGHT: PENNY MYTH vs ISOMETRIC 3D $100 CASH TOWERS
// ============================================================================
export const Scene03KillAdMyth: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panShift = interpolate(frame, [315, 412], [0, -860], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const stampSlam = spring({ frame: Math.max(0, frame - 210), fps, config: SPRING_SLAM });
  const shake = getImpactShake(frame, 210, 15);
  const pennyDropY = (frame * 6.2) % 192;
  const retainerVal = Math.round(
    interpolate(frame, [415, 620], [0, 1500], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  const stack1 = spring({ frame: Math.max(0, frame - 398), fps, config: SPRING_POP });
  const stack2 = spring({ frame: Math.max(0, frame - 442), fps, config: SPRING_POP });
  const stack3 = spring({ frame: Math.max(0, frame - 486), fps, config: SPRING_POP });

  // Authentic 3D Isometric Extruded Crisp Green $100 Bill Stacks (NO flat 2D rectangles!)
  const renderIsometricStack = (x: number, bills: number, progress: number) => {
    const visible = Math.round(bills * Math.min(1, progress));
    return (
      <g transform={`translate(${x}, 504)`}>
        {/* 45-degree cast shadow across studio counter */}
        <polygon points="-84,12 88,12 126,38 -46,38" fill="rgba(26, 20, 14, 0.22)" />
        {Array.from({ length: visible }, (_, idx) => {
          const y = -idx * 15;
          return (
            <g key={idx} transform={`translate(0, ${y})`}>
              {/* Front vertical edge of bill bundle */}
              <rect x={-82} y={-8} width={144} height={15} fill="#1E8449" />
              {/* 3D Shaded Right Depth Face */}
              <polygon points="62,-8 88,-24 88,-9 62,7" fill="#145A32" />
              {/* Isometric Lit Top Bill Face */}
              <polygon points="-82,-8 -56,-24 88,-24 62,-8" fill="#2ECC71" />
              <polygon points="-66,-11 -48,-21 72,-21 54,-11" fill="#58D68D" />
              {/* Gold Currency Strap Wrapping Over Top & Front */}
              <polygon points="-14,-8 12,-24 38,-24 12,-8" fill="#F5B82E" />
              <rect x={-14} y={-8} width={26} height={15} fill="#D99B26" />
              {idx === visible - 1 && (
                <text
                  x={12}
                  y={-12}
                  textAnchor="middle"
                  fontFamily={FONT_CONDENSED}
                  fontWeight={800}
                  fontSize={16}
                  fill="#0F291E"
                >
                  $100
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#EFE6D8' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="editorialStudioWall6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F9F3E8" />
            <stop offset="100%" stopColor="#E4D6C0" />
          </linearGradient>
          <linearGradient id="mahoganyCounter6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8A5736" />
            <stop offset="100%" stopColor="#5C361E" />
          </linearGradient>
        </defs>

        <rect width={1280} height={720} fill="url(#editorialStudioWall6)" />

        {/* Architectural Acoustic Wood Slat Backdrop Panels (Ends Empty Void!) */}
        <g transform={`translate(${(panShift * 0.45).toFixed(1)}, 0)`} opacity={0.34}>
          {Array.from({ length: 28 }, (_, i) => (
            <rect key={i} x={i * 78} y={0} width={24} height={506} fill="#D6C4A8" />
          ))}
        </g>

        {/* Overhead Soft Studio Spotlight Cone */}
        <polygon points="320,0 960,0 1180,720 100,720" fill="#FFFFFF" opacity={0.38} />

        {/* Panoramic Physical Studio Tabletop Sliding Left -> Right */}
        <g transform={`translate(${(panShift + shake.x).toFixed(1)}, ${shake.y.toFixed(1)})`}>
          {/* Split-Shaded Walnut Countertop */}
          <rect x={-120} y={506} width={2360} height={214} fill="url(#mahoganyCounter6)" />
          <rect x={-120} y={506} width={2360} height={16} fill="#B87E54" />
          <rect x={-120} y={522} width={2360} height={5} fill="#4A2A15" opacity={0.45} />

          {/* ===== LEFT SIDE: SPLIT-SHADED CERAMIC PIGGY BANK & COPPER PENNY ===== */}
          <g transform="translate(560, 0)">
            {/* Falling Copper 1-Cent Coin */}
            <g transform={`translate(0, ${172 + pennyDropY})`}>
              <circle r={17} fill="#B86235" />
              <circle cx={-2} cy={-2} r={14} fill="#E08652" />
              <text x={-1} y={4} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={16} fill="#FFF5E6">
                1¢
              </text>
            </g>

            {/* Lineless Split-Shaded Ceramic Piggy Bank */}
            <g transform="translate(0, 444)">
              <ellipse cx={16} cy={66} rx={106} ry={17} fill="rgba(26,20,14,0.22)" />
              <rect x={-52} y={30} width={24} height={36} rx={6} fill="#D1706E" />
              <rect x={28} y={30} width={24} height={36} rx={6} fill="#BA5B59" />
              {/* Rounded Ceramic Body + Lower Half Shadow */}
              <ellipse cx={0} cy={0} rx={92} ry={64} fill="#F29B98" />
              <path d="M -88 14 A 92 64 0 0 0 88 14 Q 0 38 -88 14 Z" fill="#D97A77" />
              {/* Glossy Ceramic Specular Rim */}
              <path d="M -52 -36 Q -18 -54 24 -42" fill="none" stroke="#FFD2D0" strokeWidth={7} strokeLinecap="round" opacity={0.75} />
              {/* Coin Slot */}
              <rect x={-22} y={-50} width={44} height={8} rx={4} fill="#3A1E22" />
              {/* Snout & Ear */}
              <ellipse cx={88} cy={4} rx={18} ry={24} fill="#D97A77" />
              <ellipse cx={91} cy={4} rx={11} ry={16} fill="#F29B98" />
              <circle cx={88} cy={-2} r={3} fill="#5C282A" />
              <circle cx={95} cy={-2} r={3} fill="#5C282A" />
              <polygon points="34,-48 56,-84 68,-42" fill="#E38481" />
            </g>

            <FloatingCallout
              x={0}
              y={122}
              text="$0.12 AD PAYOUT"
              subtext="THE VIRAL PAYOUT ILLUSION"
              size={54}
              fill="#C82834"
              accent="#1E293B"
              delayFrames={16}
              darkBackdrop={false}
            />

            {/* Distressed Editorial Crimson "MYTH" Stamp Slam */}
            {frame >= 210 && (
              <g transform={`translate(0, 392) rotate(-12) scale(${Math.max(0.001, stampSlam)})`}>
                <rect x={-168} y={-54} width={336} height={108} rx={10} fill="rgba(214, 40, 40, 0.12)" stroke="#C82834" strokeWidth={10} />
                <rect x={-154} y={-42} width={308} height={84} rx={5} fill="none" stroke="#C82834" strokeWidth={3} strokeDasharray="10 6" />
                <text x={0} y={24} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={78} fill="#C82834" letterSpacing="0.1em">
                  MYTH
                </text>
              </g>
            )}
            <ImpactBurst x={0} y={392} triggerFrame={210} color="#C82834" secondaryColor="#F5B82E" radius={146} />
          </g>

          {/* ===== RIGHT SIDE: ISOMETRIC 3D $100 CASH TOWERS + WAX-SEALED RETAINER ===== */}
          <g transform="translate(1480, 0)">
            {renderIsometricStack(-190, 9, stack1)}
            {renderIsometricStack(0, 14, stack2)}
            {renderIsometricStack(190, 18, stack3)}
            <ImpactBurst x={190} y={248} triggerFrame={486} color="#F5B82E" secondaryColor="#2ECC71" radius={122} />

            {/* Wax-Sealed Client Retainer Contract */}
            <g transform={`translate(390, 452) scale(${Math.max(0.001, stack3)})`}>
              <polygon points="-64,58 72,58 98,74 -38,74" fill="rgba(26,20,14,0.22)" />
              <rect x={-68} y={-100} width={136} height={158} rx={4} fill="#FFFDF8" />
              <rect x={44} y={-100} width={24} height={158} fill="#EFE8D8" />
              <rect x={-48} y={-76} width={72} height={10} rx={2} fill="#1E3A5F" />
              <line x1={-48} y1={-46} x2={34} y2={-46} stroke="#94A3B8" strokeWidth={5} strokeLinecap="round" />
              <line x1={-48} y1={-24} x2={26} y2={-24} stroke="#94A3B8" strokeWidth={5} strokeLinecap="round" />
              <line x1={-48} y1={-2} x2={38} y2={-2} stroke="#CBD5E1" strokeWidth={5} strokeLinecap="round" />
              {/* Gold Wax Seal & Ribbon */}
              <polygon points="16,44 10,74 24,62 38,74 32,44" fill="#C82834" />
              <circle cx={24} cy={26} r={22} fill="#F5B82E" />
              <circle cx={24} cy={26} r={15} fill="#D99B26" />
            </g>

            <FloatingCallout
              x={38}
              y={118}
              text={`$${retainerVal.toLocaleString()}/MO`}
              subtext="DIRECT GLOBAL CLIENT RETAINERS"
              size={66}
              fill="#157A46"
              accent="#F5B82E"
              delayFrames={404}
              darkBackdrop={false}
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
// SCENE 04 · 4 ARCHITECTURAL CRAFT STUDIOS (CONTINUOUS 2.5D PARALLAX DOLLY!)
// ============================================================================
export const Scene04OneCraft: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();

  const dollyX = interpolate(frame, [0, durationInFrames], [0, -1920], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const gearRot = frame * 1.85;
  const clapAngle = -22 + Math.abs(Math.sin(frame * 0.14)) * 20;
  const paperRise = Math.min(92, Math.max(0, (frame - 470) * 0.55));
  const stylusX = Math.sin(frame * 0.09) * 52;
  const stylusY = Math.cos(frame * 0.12) * 30;
  const playheadX = -112 + ((frame * 2.8) % 224);

  return (
    <AbsoluteFill style={{ backgroundColor: '#164E6B' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="craftWall6" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#144F6E" />
            <stop offset="33%" stopColor="#176158" />
            <stop offset="66%" stopColor="#263663" />
            <stop offset="100%" stopColor="#7A3C2C" />
          </linearGradient>
          <linearGradient id="benchWood6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C98D55" />
            <stop offset="100%" stopColor="#946033" />
          </linearGradient>
        </defs>

        <g transform={`translate(${dollyX.toFixed(1)}, 0)`}>
          {/* Continuous Color-Shifting Studio Wall */}
          <rect x={0} y={0} width={3200} height={720} fill="url(#craftWall6)" />

          {/* Architectural Wainscot Molding & Studio Acoustic Wall Panels */}
          <rect x={0} y={482} width={3200} height={34} fill="rgba(10, 18, 30, 0.28)" />
          {[160, 860, 1560, 2260, 2960].map((px) => (
            <rect key={px} x={px} y={0} width={18} height={482} fill="rgba(10, 18, 30, 0.22)" />
          ))}

          {/* Hanging Brass Pendant Studio Lamps + Volumetric Light Cones */}
          {[520, 1220, 1920, 2640].map((lx) => (
            <g key={lx} transform={`translate(${lx}, 0)`}>
              <polygon points="-24,62 24,62 240,516 -240,516" fill="#FFF7D6" opacity={0.075} />
              <rect x={-2.5} y={0} width={5} height={46} fill="#0F172A" />
              <polygon points="-28,64 28,64 14,44 -14,44" fill="#E8AE38" />
              <polygon points="0,64 28,64 14,44 0,44" fill="#C48B20" />
            </g>
          ))}

          {/* Long Split-Shaded Studio Workbench */}
          <rect x={0} y={516} width={3200} height={204} fill="url(#benchWood6)" />
          <rect x={0} y={516} width={3200} height={16} fill="#E5AE78" />
          <rect x={0} y={532} width={3200} height={5} fill="#6E4420" opacity={0.45} />

          {/* ===== STATION 1 (x=520): SHORT-FORM VIDEO EDITING SUITE ===== */}
          <g transform="translate(520, 0)">
            <FloatingCallout x={0} y={122} text="VIDEO EDITING" subtext="HIGH-RETENTION NLE CUTS" size={52} fill="#FFFFFF" accent="#FFD166" delayFrames={8} />
            {/* Cast shadow */}
            <polygon points="-188,516 196,516 232,544 -152,544" fill="rgba(10,18,30,0.24)" />
            {/* Sleek NLE Editing Monitor with Live Timeline Playhead */}
            <g transform="translate(-74, 388)">
              <rect x={-148} y={-104} width={296} height={192} rx={10} fill="#1E293B" />
              <rect x={-136} y={-92} width={272} height={154} rx={4} fill="#0F172A" />
              {/* Timeline Video & Audio Tracks */}
              <rect x={-118} y={-68} width={96} height={26} rx={3} fill="#38BDF8" />
              <rect x={-14} y={-68} width={130} height={26} rx={3} fill="#F5B82E" />
              <rect x={-118} y={-32} width={142} height={22} rx={3} fill="#2AD08E" />
              <rect x={32} y={-32} width={84} height={22} rx={3} fill="#FF6B4A" />
              {/* Waveform Bars */}
              {Array.from({ length: 18 }, (_, wi) => (
                <rect key={wi} x={-114 + wi * 13} y={14 - ((wi * 7) % 14)} width={7} height={16 + ((wi * 11) % 24)} rx={2} fill="#38BDF8" opacity={0.75} />
              ))}
              {/* Moving Red NLE Playhead */}
              <line x1={playheadX} y1={-84} x2={playheadX} y2={54} stroke="#FF4757" strokeWidth={3} />
              <polygon points={`${playheadX - 7},-84 ${playheadX + 7},-84 ${playheadX},-74`} fill="#FF4757" />
              {/* Stand */}
              <rect x={-26} y={88} width={52} height={34} fill="#475569" />
              <rect x={-64} y={118} width={128} height={10} rx={3} fill="#64748B" />
            </g>
            {/* Split-Shaded Clapperboard */}
            <g transform="translate(154, 412)">
              <rect x={-78} y={-14} width={156} height={118} rx={6} fill="#1E293B" />
              <rect x={0} y={-14} width={78} height={118} rx={4} fill="#141C2B" />
              <rect x={-60} y={24} width={120} height={6} rx={3} fill="#475569" />
              <rect x={-60} y={48} width={84} height={6} rx={3} fill="#475569" />
              <g transform={`translate(-78, -14) rotate(${clapAngle.toFixed(1)})`}>
                <rect x={0} y={-24} width={156} height={24} rx={3} fill="#F8FAFC" />
                {[12, 52, 92, 132].map((sx) => (
                  <polygon key={sx} points={`${sx},-24 ${sx + 20},-24 ${sx + 8},0 ${sx - 12},0`} fill="#0F172A" />
                ))}
              </g>
            </g>
          </g>

          {/* ===== STATION 2 (x=1220): HIGH-CONVERTING UI DESIGN ===== */}
          <g transform="translate(1220, 0)">
            <FloatingCallout x={0} y={122} text="UI DESIGN" subtext="CONVERSION-FIRST INTERFACES" size={52} fill="#FFD166" accent="#2AD08E" delayFrames={148} />
            <polygon points="-164,516 172,516 206,544 -130,544" fill="rgba(10,18,30,0.24)" />
            <g transform="translate(0, 412)">
              <rect x={-172} y={-114} width={344} height={212} rx={14} fill="#0F172A" />
              <rect x={-156} y={-98} width={312} height={180} rx={6} fill="#F8FAFC" />
              {/* Clean Editorial UI Blocks inside Tablet */}
              <rect x={-136} y={-78} width={126} height={140} rx={8} fill="#14B8A6" />
              <rect x={-72} y={-78} width={62} height={140} rx={6} fill="#0D9488" />
              <circle cx={68} cy={-32} r={36} fill="#F97316" />
              <path d="M 68 -68 A 36 36 0 0 1 68 4 Z" fill="#EA580C" />
              <rect x={12} y={24} width={118} height={32} rx={6} fill="#F5B82E" />
              {/* Hovering Anodized Gold Pen Stylus */}
              <g transform={`translate(${stylusX.toFixed(1)}, ${stylusY.toFixed(1)}) rotate(-38)`}>
                <rect x={-8} y={-112} width={16} height={96} rx={5} fill="#F5B82E" />
                <rect x={0} y={-112} width={8} height={96} rx={3} fill="#D99B26" />
                <polygon points="-8,-16 8,-16 0,10" fill="#0F172A" />
              </g>
            </g>
          </g>

          {/* ===== STATION 3 (x=1920): AI WORKFLOW AUTOMATION ===== */}
          <g transform="translate(1920, 0)">
            <FloatingCallout x={0} y={122} text="AI AUTOMATION" subtext="AUTONOMOUS PIPELINES" size={52} fill="#2AD08E" accent="#38BDF8" delayFrames={312} />
            {/* Subtle Blueprint Schematic Grid Behind Station */}
            <g stroke="#38BDF8" strokeWidth={1} opacity={0.14}>
              {[-240, -160, -80, 0, 80, 160, 240].map((gx) => (
                <line key={gx} x1={gx} y1={170} x2={gx} y2={480} />
              ))}
              {[200, 280, 360, 440].map((gy) => (
                <line key={gy} x1={-260} y1={gy} x2={260} y2={gy} />
              ))}
            </g>
            {/* Copper & Glass Energy Conduit */}
            <path d="M -230 456 L -96 456 L -96 365 L 230 365" fill="none" stroke="#1E293B" strokeWidth={24} strokeLinejoin="round" />
            <path d="M -230 456 L -96 456 L -96 365 L 230 365" fill="none" stroke="#38BDF8" strokeWidth={8} strokeLinejoin="round" opacity={0.45} />
            <circle cx={-165 + ((frame * 5.2) % 390)} cy={365} r={11} fill="#2AD08E" />
            <circle cx={-165 + ((frame * 5.2) % 390)} cy={365} r={20} fill="#2AD08E" opacity={0.25} />
            {/* Precision Split-Shaded Brass Gear 1 */}
            <g transform={`translate(-55, 365) rotate(${gearRot.toFixed(1)})`}>
              <circle r={74} fill="#F5B82E" />
              {Array.from({ length: 10 }, (_, t) => (
                <rect key={t} x={-11} y={-94} width={22} height={24} rx={3} fill="#F5B82E" transform={`rotate(${t * 36})`} />
              ))}
              <circle r={48} fill="#D99B26" />
              <circle r={24} fill="#263663" />
            </g>
            {/* Counter-Rotating Emerald Gear 2 */}
            <g transform={`translate(98, 424) rotate(${(-gearRot * 1.25).toFixed(1)})`}>
              <circle r={54} fill="#2AD08E" />
              {Array.from({ length: 8 }, (_, t) => (
                <rect key={t} x={-10} y={-70} width={20} height={20} rx={3} fill="#2AD08E" transform={`rotate(${t * 45})`} />
              ))}
              <circle r={34} fill="#1EA36E" />
              <circle r={16} fill="#263663" />
            </g>
          </g>

          {/* ===== STATION 4 (x=2640): FOUNDER GHOSTWRITING ===== */}
          <g transform="translate(2640, 0)">
            <FloatingCallout x={0} y={122} text="GHOSTWRITING" subtext="AUTHORITY CONTENT ENGINES" size={52} fill="#FFFFFF" accent="#FFD166" delayFrames={475} />
            <polygon points="-164,516 168,516 206,544 -128,544" fill="rgba(10,18,30,0.24)" />
            <g transform="translate(0, 444)">
              {/* Scrolling Parchment Manuscript */}
              <g transform={`translate(0, ${-paperRise.toFixed(1)})`}>
                <rect x={-94} y={-158} width={188} height={164} rx={3} fill="#FFFDF6" />
                <rect x={54} y={-158} width={40} height={164} fill="#F2EBD9" />
                {[0, 1, 2, 3].map((ln) => (
                  <rect key={ln} x={-72} y={-128 + ln * 26} width={ln === 3 ? 96 : 144} height={7} rx={3} fill="#1E293B" />
                ))}
              </g>
              {/* Typewriter Roller */}
              <rect x={-150} y={-52} width={300} height={26} rx={12} fill="#1E293B" />
              <rect x={-150} y={-52} width={300} height={8} rx={4} fill="#334155" />
              {/* Split-Shaded Emerald Vintage Chassis */}
              <polygon points="-136,-26 136,-26 168,72 -168,72" fill="#18876A" />
              <polygon points="0,-26 136,-26 168,72 0,72" fill="#116650" />
              {/* Mechanical Brass Keys */}
              {[-95, -57, -19, 19, 57, 95].map((kx, ki) => {
                const pressed = Math.floor(frame / 6) % 6 === ki ? 4 : 0;
                return (
                  <g key={ki} transform={`translate(${kx}, ${28 + pressed})`}>
                    <circle r={13} fill="#D99B26" />
                    <circle cy={-2} r={11} fill="#FFF6E0" />
                  </g>
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
