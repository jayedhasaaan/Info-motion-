import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  DriftingClouds,
  FloatingCallout,
  FONT_DISPLAY,
  ImpactBurst,
  KineticSubtitleBar,
  OUTLINE_COLOR,
  SPRING_POP,
  SPRING_SMOOTH,
  getCameraTransform,
} from '../theme';
import type { WorldSceneProps } from './ActOneScenes';

// ============================================================================
// SCENE 09 · CARGO PLANE CROSSING SUSPENSION BRIDGE TO DHAKA BANK & TAKA FAN
// ============================================================================
export const Scene09PaymentsBD: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cargo plane smoothly flies from left (USD) high over the suspension bridge above Dhaka Bank dome
  const planeP = interpolate(frame, [40, 440], [0, 1], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const planeX = interpolate(planeP, [0, 1], [-120, 725]);
  const planeY = interpolate(planeP, [0, 0.5, 1], [235, 168, 195]);
  const planeRot = interpolate(planeP, [0, 0.5, 1], [-5, 0, -2]);

  const bdtAmount = Math.round(
    interpolate(frame, [380, 620], [0, 180000], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const takaFan = spring({ frame: Math.max(0, frame - 420), fps, config: SPRING_POP });
  const bankPop = spring({ frame: Math.max(0, frame - 220), fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: '#2B7FD1' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="flightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2074C7" />
            <stop offset="68%" stopColor="#7DCBF2" />
            <stop offset="100%" stopColor="#D6F3FF" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'pan-right')}>
          <rect width={1280} height={720} fill="url(#flightSky)" />
          <DriftingClouds frame={frame} tint="#FFFFFF" opacity={0.9} speed={0.5} />

          {/* Sparkling River & Sea Underneath Bridge */}
          <rect x={0} y={535} width={1280} height={185} fill="#1E7FA3" stroke={OUTLINE_COLOR} strokeWidth={4} />
          {[120, 380, 660, 960].map((wx, wi) => (
            <path
              key={wi}
              d={`M ${wx + ((frame * 1.4) % 80)} ${585 + (wi % 2) * 26} Q ${wx + 35 + ((frame * 1.4) % 80)} ${575 + (wi % 2) * 26} ${wx + 70 + ((frame * 1.4) % 80)} ${585 + (wi % 2) * 26}`}
              fill="none"
              stroke="#9CE4FA"
              strokeWidth={4}
              strokeLinecap="round"
            />
          ))}

          {/* Steel Suspension Bridge ("PAYONEER · WISE" Bridge Across the Sea) */}
          <g transform="translate(0, 0)">
            {/* Vertical suspension hanger cables connecting deck cleanly to drooping main cable */}
            {[
              [140, 470], [180, 444], [218, 398],
              [290, 396], [340, 448], [390, 478], [450, 478], [500, 448], [550, 396],
              [622, 398], [660, 444], [700, 470],
            ].map(([hx, hy]) => (
              <line key={hx} x1={hx} y1={hy} x2={hx} y2={505} stroke="#C93A27" strokeWidth={2.5} opacity={0.82} />
            ))}
            {/* Authentic Drooping Catenary Suspension Cables */}
            <path d="M 80 505 Q 190 482 250 328 Q 420 555 590 328 Q 650 482 760 505" fill="none" stroke="#E85D4A" strokeWidth={6} strokeLinecap="round" />
            {/* Bridge Towers */}
            {[250, 590].map((tx) => (
              <g key={tx}>
                <rect x={tx - 14} y={325} width={28} height={210} fill="#E85D4A" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                <rect x={tx - 22} y={365} width={44} height={12} fill="#C93A27" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              </g>
            ))}
            {/* Bridge Roadway Deck */}
            <rect x={0} y={505} width={860} height={30} fill="#364454" stroke={OUTLINE_COLOR} strokeWidth={4} />
            <line x1={0} y1={520} x2={850} y2={520} stroke="#FFD166" strokeWidth={4} strokeDasharray="24 18" />
          </g>

          {/* Green Emerald Shore + Dhaka Bank Boulevard on Right */}
          <path d="M 790 545 Q 845 500 940 505 L 1280 505 L 1280 720 L 790 720 Z" fill="#239B56" stroke={OUTLINE_COLOR} strokeWidth={4} />

          {/* Lush Bengal Palm Tree on Riverbank */}
          <g transform="translate(848, 510)">
            <path d="M 0 0 Q -14 -55 -6 -105" fill="none" stroke="#7A4E32" strokeWidth={12} strokeLinecap="round" />
            <path d="M -6 -105 Q -56 -115 -66 -86" fill="none" stroke="#1E8449" strokeWidth={10} strokeLinecap="round" />
            <path d="M -6 -105 Q -36 -144 4 -140" fill="none" stroke="#27AE60" strokeWidth={10} strokeLinecap="round" />
            <path d="M -6 -105 Q 38 -124 52 -92" fill="none" stroke="#2ECC71" strokeWidth={10} strokeLinecap="round" />
          </g>

          {/* Illustrated Bangladeshi Classical Bank Dome + Columns (Right) */}
          <g transform={`translate(1030, 510) scale(${Math.max(0.001, bankPop)})`}>
            {/* Classical Dome */}
            <path d="M -92 -168 Q 0 -268 92 -168 Z" fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
            <line x1={0} y1={-268} x2={0} y2={-305} stroke={OUTLINE_COLOR} strokeWidth={5} />
            <circle cx={0} cy={-305} r={8} fill="#1FB57A" stroke={OUTLINE_COLOR} strokeWidth={3} />
            {/* Pediment & Pillars */}
            <polygon points="-140,-152 0,-206 140,-152" fill="#FFFDF6" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
            <rect x={-128} y={-152} width={256} height={152} fill="#EFE7D8" stroke={OUTLINE_COLOR} strokeWidth={4} />
            {[-95, -48, 0, 48, 95].map((cx) => (
              <rect key={cx} x={cx - 12} y={-146} width={24} height={140} fill="#FFFFFF" stroke={OUTLINE_COLOR} strokeWidth={3} />
            ))}
            <rect x={-144} y={-10} width={288} height={20} fill="#CBD5E1" stroke={OUTLINE_COLOR} strokeWidth={4} />
          </g>

          {/* Crisp Emerald Cargo Jet Flying $1,500 USD Across the Sky */}
          <g transform={`translate(${planeX.toFixed(1)}, ${planeY.toFixed(1)}) rotate(${planeRot.toFixed(1)})`}>
            {/* Contrail dashed ribbon */}
            <line x1={-240} y1={4} x2={-95} y2={4} stroke="#FFFFFF" strokeWidth={5} strokeDasharray="16 14" opacity={0.75} />
            {/* Tail fin */}
            <polygon points="-92,-4 -116,-48 -68,-4" fill="#1FB57A" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            {/* Fuselage */}
            <path
              d="M -96 -14 L 74 -14 Q 112 -14 118 4 Q 112 22 74 22 L -84 22 Z"
              fill="#FFFFFF"
              stroke={OUTLINE_COLOR}
              strokeWidth={4}
            />
            {/* Emerald stripe & USD emblem */}
            <rect x={-82} y={2} width={166} height={10} fill="#239B56" />
            <polygon points="-24,6 32,6 -8,46 -36,46" fill="#239B56" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            <text x={22} y={-2} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={18} fill={OUTLINE_COLOR}>
              $1,500
            </text>
          </g>

          {/* Fanning Bangladeshi Taka Banknotes Bursting Above the Bank! */}
          {frame >= 420 && (
            <g transform={`translate(1030, 320) scale(${Math.max(0.001, takaFan)})`}>
              {[-28, -14, 0, 14, 28].map((ang, bi) => (
                <g key={bi} transform={`rotate(${ang}) translate(0, -105)`}>
                  <rect x={-52} y={-26} width={104} height={52} rx={6} fill="#2AD08E" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                  <circle cx={0} cy={0} r={14} fill="#E63946" />
                  <text x={0} y={6} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={18} fill="#FFFFFF">
                    ৳
                  </text>
                </g>
              ))}
            </g>
          )}
          <ImpactBurst x={1030} y={248} triggerFrame={420} color="#FFD166" radius={124} />

          <FloatingCallout
            x={420}
            y={114}
            text={frame >= 380 ? `৳${bdtAmount.toLocaleString()} BDT` : 'USD → PAYONEER / WISE'}
            subtext="LEGAL BANK SETTLEMENT IN BANGLADESH"
            size={54}
            fill={frame >= 380 ? '#FFD166' : '#FFFFFF'}
            delayFrames={12}
          />
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
// SCENE 10 · 2.5D ILLUSTRATED MOUNTAIN STAIRCASE ASCENT ($0 -> $300 -> $1,500/MO)
// ============================================================================
export const Scene10NinetyDayMath: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const m1Pop = spring({ frame: Math.max(0, frame - 35), fps, config: SPRING_POP });
  const m2Pop = spring({ frame: Math.max(0, frame - 240), fps, config: SPRING_POP });
  const m3Pop = spring({ frame: Math.max(0, frame - 460), fps, config: SPRING_POP });

  const m2Val = Math.round(
    interpolate(frame, [245, 365], [0, 300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const m3Val = Math.round(
    interpolate(frame, [465, 645], [300, 1500], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const flagWave = Math.sin(frame * 0.14) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: '#2E8AD8' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="alpineSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B5EA8" />
            <stop offset="62%" stopColor="#66BCEB" />
            <stop offset="100%" stopColor="#FFE6B8" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'push')}>
          <rect width={1280} height={720} fill="url(#alpineSky)" />
          <DriftingClouds frame={frame} tint="#FFFFFF" opacity={0.85} speed={0.35} />

          {/* Distant Layered Mountain Peaks with Crisp Snow Caps */}
          <polygon points="-40,680 280,290 610,680" fill="#5D92BD" />
          <polygon points="280,290 228,354 258,342 282,360 308,342 336,356" fill="#EDF6FC" />
          <polygon points="460,680 860,210 1320,680" fill="#467AA6" />
          <polygon points="860,210 792,290 832,276 864,296 896,274 934,292" fill="#EDF6FC" />

          {/* Hero 3-Tier Architectural Stone Mountain Staircase Climbing Left -> Right */}
          {/* TIER 1: MONTH 1 BASE CAMP ($0) */}
          <g transform={`translate(0, ${(1 - m1Pop) * 120})`}>
            <polygon points="0,720 0,520 420,520 420,720" fill="#5E7287" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
            <rect x={0} y={520} width={420} height={22} fill="#7E93AA" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            {/* Cozy Orange Base Camp Tent */}
            <g transform="translate(215, 520)">
              <polygon points="-68,0 0,-86 68,0" fill="#F26444" stroke={OUTLINE_COLOR} strokeWidth={4} />
              <polygon points="-24,0 0,-54 24,0" fill="#2A3B4D" stroke={OUTLINE_COLOR} strokeWidth={3} />
            </g>
            <FloatingCallout x={215} y={376} text="$0" subtext="MONTH 1 · PROOF" size={56} fill="#FFFFFF" delayFrames={45} />
          </g>

          {/* TIER 2: MONTH 2 STONE OUTPOST ($300) */}
          <g transform={`translate(0, ${(1 - m2Pop) * 140})`}>
            <polygon points="415,720 415,395 855,395 855,720" fill="#3B5B78" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
            <rect x={415} y={395} width={440} height={22} fill="#5C82A4" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            {/* Emerald Flagpole Planted on Ledge */}
            <g transform="translate(635, 395)">
              <line x1={0} y1={0} x2={0} y2={-118} stroke={OUTLINE_COLOR} strokeWidth={6} strokeLinecap="round" />
              <path
                d={`M 0 -114 Q 36 ${-124 + flagWave} 78 -106 L 78 -62 Q 36 ${-78 + flagWave} 0 -66 Z`}
                fill="#1FB57A"
                stroke={OUTLINE_COLOR}
                strokeWidth={3.5}
              />
            </g>
            <FloatingCallout
              x={635}
              y={224}
              text={`$${m2Val}`}
              subtext="MONTH 2 · FIRST CLIENT"
              size={58}
              fill="#2AD08E"
              delayFrames={245}
            />
          </g>

          {/* TIER 3: MONTH 3 GOLDEN SUMMIT ($1,500/MO) */}
          <g transform={`translate(0, ${(1 - m3Pop) * 160})`}>
            <polygon points="850,720 850,282 1280,282 1280,720" fill="#1F3B57" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
            <rect x={850} y={282} width={430} height={24} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={4} />
            {/* Shining Golden Summit Beacon (cleanly below headline) */}
            <g transform="translate(1065, 282)">
              <circle cx={0} cy={-56} r={46} fill="#FFD166" opacity={0.28 + 0.1 * Math.sin(frame * 0.14)} />
              <polygon points="-24,0 0,-78 24,0" fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={4} />
              <circle cx={0} cy={-80} r={14} fill="#FFF8D6" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            </g>
            <ImpactBurst x={1065} y={202} triggerFrame={465} color="#FFD166" radius={116} />
            <FloatingCallout
              x={1060}
              y={104}
              text={`$${m3Val.toLocaleString()}/MO`}
              subtext="MONTH 3 · ৳1.8 LAKH"
              size={54}
              fill="#FFD166"
              delayFrames={465}
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
// SCENE 11 · MIDNIGHT STUDY WINDOW, BRASS WALL CLOCK & METRONOME (2 HOURS × 90)
// ============================================================================
export const Scene11EveningEngine: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();

  // Smoothly sweep clock wedges across 3x40-minute blocks (0 -> 120 deg -> 240 deg -> 360 deg)
  const sweepDeg = interpolate(frame, [30, durationInFrames - 90], [0, 360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const repeatCount = Math.round(
    interpolate(frame, [420, durationInFrames - 40], [1, 90], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const metroAngle = Math.sin(frame * 0.12) * 26;
  const steamOff = (frame * 1.1) % 52;

  const arcPath = (startDeg: number, endDeg: number, r: number) => {
    const clampedEnd = Math.min(endDeg, sweepDeg);
    if (clampedEnd <= startDeg) return '';
    const a0 = ((startDeg - 90) * Math.PI) / 180;
    const a1 = ((clampedEnd - 90) * Math.PI) / 180;
    const x0 = Math.cos(a0) * r;
    const y0 = Math.sin(a0) * r;
    const x1 = Math.cos(a1) * r;
    const y1 = Math.sin(a1) * r;
    const large = clampedEnd - startDeg > 180 ? 1 : 0;
    return `M 0 0 L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#122238' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <g transform={getCameraTransform(frame, durationInFrames, 'pull')}>
          {/* Deep Cozy Night Study Room Wall */}
          <rect width={1280} height={720} fill="#182A42" />

          {/* Night Window on Left Showing Crescent Moon & Stars */}
          <rect x={95} y={108} width={295} height={340} rx={10} fill="#0D192B" stroke={OUTLINE_COLOR} strokeWidth={8} />
          {/* Crescent Moon */}
          <path d="M 275 182 A 36 36 0 1 0 315 235 A 28 28 0 1 1 275 182 Z" fill="#FFE699" />
          {[[145, 165], [205, 145], [165, 240], [325, 155], [245, 290]].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={3} fill="#FFFFFF" opacity={0.5 + 0.5 * Math.sin(frame * 0.08 + i)} />
          ))}
          <line x1={242} y1={108} x2={242} y2={448} stroke={OUTLINE_COLOR} strokeWidth={6} />
          <line x1={95} y1={278} x2={390} y2={278} stroke={OUTLINE_COLOR} strokeWidth={6} />

          {/* Warm Wooden Evening Desk */}
          <rect x={0} y={530} width={1280} height={190} fill="#7B4E31" stroke={OUTLINE_COLOR} strokeWidth={4} />
          <rect x={0} y={530} width={1280} height={18} fill="#9C6743" stroke={OUTLINE_COLOR} strokeWidth={3} />

          {/* HERO CENTER: Giant Illustrated Brass Wall Clock Sweeping 3 × 40m Wedges */}
          <g transform="translate(640, 325)">
            <circle r={176} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={6} />
            <circle r={154} fill="#FFFDF6" stroke={OUTLINE_COLOR} strokeWidth={4} />

            {/* 3 Colorful Infographics Show Time Wedges Filling Live */}
            <path d={arcPath(0, 120, 148)} fill="#F26444" opacity={0.88} />
            <path d={arcPath(120, 240, 148)} fill="#2E8AD8" opacity={0.88} />
            <path d={arcPath(240, 360, 148)} fill="#1FB57A" opacity={0.88} />

            {/* 12 Bold Clock Tick Marks */}
            {Array.from({ length: 12 }, (_, t) => (
              <line
                key={t}
                x1={0}
                y1={-146}
                x2={0}
                y2={-126}
                stroke={OUTLINE_COLOR}
                strokeWidth={t % 3 === 0 ? 6 : 3.5}
                strokeLinecap="round"
                transform={`rotate(${t * 30})`}
              />
            ))}

            {/* Smoothly Sweeping Brass Clock Hand */}
            <g transform={`rotate(${sweepDeg.toFixed(2)})`}>
              <line x1={0} y1={22} x2={0} y2={-122} stroke={OUTLINE_COLOR} strokeWidth={9} strokeLinecap="round" />
            </g>
            <circle r={16} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={4} />
          </g>

          {/* Clean Floating Wedge Labels Around Clock (NO BOXES!) */}
          <FloatingCallout x={875} y={248} text="40m CRAFT" size={28} fill="#FF7B54" delayFrames={55} align="start" />
          <FloatingCallout x={875} y={335} text="40m REPLIES" size={28} fill="#66C2F0" delayFrames={195} align="start" />
          <FloatingCallout x={875} y={422} text="40m PROOF" size={28} fill="#2AD08E" delayFrames={330} align="start" />

          {/* Desk Metronome Swinging Steadily on Right */}
          <g transform="translate(1070, 530)">
            <polygon points="-44,0 -18,-132 18,-132 44,0" fill="#B5653B" stroke={OUTLINE_COLOR} strokeWidth={4} />
            <polygon points="-24,-10 -12,-114 12,-114 24,-10" fill="#F5E6CA" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
            <g transform={`translate(0, -18) rotate(${metroAngle.toFixed(1)})`}>
              <line x1={0} y1={0} x2={0} y2={-112} stroke={OUTLINE_COLOR} strokeWidth={5} strokeLinecap="round" />
              <polygon points="-11,-78 11,-78 7,-60 -7,-60" fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
            </g>
          </g>

          {/* Steaming Night Coffee Mug on Left Desk */}
          <g transform="translate(210, 498)">
            <path
              d={`M 0 ${-24 - steamOff} Q -12 ${-44 - steamOff} 2 ${-62 - steamOff}`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={4}
              strokeLinecap="round"
              opacity={Math.sin((steamOff / 52) * Math.PI) * 0.65}
            />
            <rect x={-26} y={-24} width={52} height={56} rx={6} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            <path d="M 26 -12 Q 44 -10 42 8 Q 40 24 26 20" fill="none" stroke="#F5B82E" strokeWidth={7} />
          </g>

          <FloatingCallout
            x={640}
            y={94}
            text={frame >= 420 ? `REPEAT × ${repeatCount}` : '2 HOURS EVERY EVENING'}
            size={54}
            fill="#FFD166"
            delayFrames={12}
          />
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
// SCENE 12 · GOLDEN SUNRISE OVER DHAKA SKYLINE, PADMA BRIDGE & EMERALD RIVER
// ============================================================================
export const Scene12BengalCompassFinale: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();

  const sunRiseY = interpolate(frame, [0, 320], [495, 290], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rayRot = frame * 0.25;
  const rippleShift = (frame * 1.6) % 180;

  return (
    <AbsoluteFill style={{ backgroundColor: '#2B4C7E' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="bengalSunriseSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D3E6E" />
            <stop offset="45%" stopColor="#E07A5F" />
            <stop offset="82%" stopColor="#FFB85C" />
            <stop offset="100%" stopColor="#FFE8A3" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'pull')}>
          <rect width={1280} height={720} fill="url(#bengalSunriseSky)" />

          {/* Rotating Warm Sunburst Rays Behind Rising Sun */}
          <g transform={`translate(640, ${sunRiseY.toFixed(1)}) rotate(${rayRot.toFixed(1)})`} opacity={0.22}>
            {Array.from({ length: 12 }, (_, r) => (
              <polygon
                key={r}
                points="0,0 -42,-760 42,-760"
                fill="#FFF6CC"
                transform={`rotate(${r * 30})`}
              />
            ))}
          </g>

          {/* Radiant Rising Sun Disc */}
          <circle cx={640} cy={sunRiseY} r={112} fill="#FFF5C2" />
          <circle cx={640} cy={sunRiseY} r={148} fill="#FFD166" opacity={0.32} />

          <DriftingClouds frame={frame} tint="#FFE2B8" opacity={0.78} speed={0.42} />

          {/* Gliding Morning Birds Across Sunrise Sky */}
          {[
            { x: 240, y: 175, spd: 1.4 },
            { x: 315, y: 198, spd: 1.2 },
            { x: 930, y: 162, spd: 1.5 },
          ].map((b, bi) => {
            const bx = (b.x + frame * b.spd) % 1380 - 50;
            const wing = Math.sin(frame * 0.22 + bi) * 7;
            return (
              <path
                key={bi}
                d={`M ${bx - 16} ${b.y + wing} Q ${bx - 6} ${b.y - 8} ${bx} ${b.y} Q ${bx + 6} ${b.y - 8} ${bx + 16} ${b.y + wing}`}
                fill="none"
                stroke="#18222F"
                strokeWidth={3.5}
                strokeLinecap="round"
              />
            );
          })}

          {/* Distant Dhaka Skyline Silhouette */}
          <path
            d="M 0 470 L 0 385 L 65 385 L 65 340 L 125 340 L 125 395 L 210 395 L 210 320 L 285 320 L 285 380 L 385 380 L 385 352 L 460 352 L 460 415 L 820 415 L 820 345 L 915 345 L 915 390 L 1010 390 L 1010 315 L 1090 315 L 1090 375 L 1185 375 L 1185 350 L 1280 350 L 1280 470 Z"
            fill="#2B3E57"
          />

          {/* Iconic Multi-Span Padma Bridge Truss Silhouette Spanning the Horizon */}
          <g fill="none" stroke="#18222F" strokeWidth={4}>
            <line x1={0} y1={454} x2={1280} y2={454} strokeWidth={7} />
            <line x1={0} y1={426} x2={1280} y2={426} strokeWidth={4} />
            {Array.from({ length: 16 }, (_, i) => (
              <g key={i}>
                <line x1={i * 80} y1={454} x2={i * 80 + 40} y2={426} />
                <line x1={i * 80 + 40} y1={426} x2={i * 80 + 80} y2={454} />
                {i % 2 === 0 && <line x1={i * 80} y1={454} x2={i * 80} y2={530} strokeWidth={8} />}
              </g>
            ))}
          </g>

          {/* Sparkling Emerald Bengal River Foreground with Sun Reflection */}
          <rect x={0} y={485} width={1280} height={235} fill="#186E68" stroke={OUTLINE_COLOR} strokeWidth={4} />
          {/* Golden sunlight shimmer dancing on river water */}
          {[0, 1, 2, 3, 4].map((row) => {
            const rw = 190 - row * 28 + Math.sin(frame * 0.1 + row) * 16;
            return (
              <rect
                key={row}
                x={640 - rw / 2}
                y={506 + row * 26}
                width={rw}
                height={10}
                rx={5}
                fill="#FFD166"
                opacity={0.78 - row * 0.1}
              />
            );
          })}
          {/* Gentle foreground ripples */}
          <g transform={`translate(${-rippleShift}, 0)`} opacity={0.45}>
            <path
              d="M 0 605 Q 45 590 90 605 T 180 605 T 270 605 T 360 605 T 450 605 T 540 605 T 630 605 T 720 605 T 810 605 T 900 605 T 990 605 T 1080 605 T 1170 605 T 1260 605 T 1350 605 T 1440 605"
              fill="none"
              stroke="#7EE0C7"
              strokeWidth={4}
            />
          </g>

          {/* Hero Open-Sky Finale Typography (ZERO BOXES!) */}
          <FloatingCallout
            x={640}
            y={175}
            text="DAY 01 STARTS TONIGHT"
            subtext="TURN YOUR DESK IN BANGLADESH INTO A GLOBAL STUDIO"
            size={64}
            fill="#FFFFFF"
            delayFrames={40}
          />
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
