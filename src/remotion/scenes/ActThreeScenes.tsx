import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  DriftingClouds,
  FloatingCallout,
  FONT_CONDENSED,
  ImpactBurst,
  KineticSubtitleBar,
  LeaderCallout,
  SPRING_POP,
  SPRING_SMOOTH,
  SplitBuilding,
  getCameraTransform,
} from '../theme';
import type { WorldSceneProps } from './ActOneScenes';

// ============================================================================
// SCENE 09 · GLOBAL FLIGHT, CATENARY BRIDGE & DHAKA BANK SETTLEMENT (v6.0 LINELESS)
// ============================================================================
export const Scene09PaymentsBD: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const planeP = interpolate(frame, [36, 435], [0, 1], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const planeX = interpolate(planeP, [0, 1], [-125, 725]);
  const planeY = interpolate(planeP, [0, 0.5, 1], [234, 166, 194]);
  const planeRot = interpolate(planeP, [0, 0.5, 1], [-5, 0, -2]);

  const bdtAmount = Math.round(
    interpolate(frame, [378, 618], [0, 180000], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const takaFan = spring({ frame: Math.max(0, frame - 420), fps, config: SPRING_POP });
  const bankPop = spring({ frame: Math.max(0, frame - 210), fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: '#1B6EC2' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="flightSky6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1761B5" />
            <stop offset="64%" stopColor="#6EC4F0" />
            <stop offset="100%" stopColor="#D6F3FF" />
          </linearGradient>
          <linearGradient id="riverBlue6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B82A6" />
            <stop offset="100%" stopColor="#0F5370" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'pan-right')}>
          <rect width={1280} height={720} fill="url(#flightSky6)" />
          <DriftingClouds frame={frame} tint="#FFFFFF" shadeTint="#B3DCF2" opacity={0.92} speed={0.48} />

          {/* Distant Coastal Mountain Range Silhouette */}
          <path d="M 0 535 L 140 432 L 320 492 L 520 418 L 740 508 L 960 442 L 1280 535 Z" fill="#6BB2DB" opacity={0.45} />

          {/* Sparkling River & Sea Underneath Bridge */}
          <rect x={0} y={534} width={1280} height={186} fill="url(#riverBlue6)" />
          {[90, 340, 610, 920].map((wx, wi) => (
            <path
              key={wi}
              d={`M ${wx + ((frame * 1.4) % 85)} ${582 + (wi % 2) * 28} Q ${wx + 36 + ((frame * 1.4) % 85)} ${572 + (wi % 2) * 28} ${wx + 72 + ((frame * 1.4) % 85)} ${582 + (wi % 2) * 28}`}
              fill="none"
              stroke="#9CE4FA"
              strokeWidth={3.5}
              strokeLinecap="round"
              opacity={0.75}
            />
          ))}

          {/* Monumental Red-Steel Suspension Bridge (Exact Catenary Cable Math!) */}
          <g>
            {[0.25, 0.5, 0.75].map((t, idx) => {
              const hx = (1 - t) * (1 - t) * 80 + 2 * (1 - t) * t * 190 + t * t * 250;
              const hy = (1 - t) * (1 - t) * 505 + 2 * (1 - t) * t * 482 + t * t * 328;
              return <line key={`l-${idx}`} x1={hx} y1={hy} x2={hx} y2={505} stroke="#C93A27" strokeWidth={2.4} opacity={0.85} />;
            })}
            {[0.14, 0.28, 0.42, 0.58, 0.72, 0.86].map((t, idx) => {
              const hx = (1 - t) * (1 - t) * 250 + 2 * (1 - t) * t * 420 + t * t * 590;
              const hy = (1 - t) * (1 - t) * 328 + 2 * (1 - t) * t * 555 + t * t * 328;
              return <line key={`m-${idx}`} x1={hx} y1={hy} x2={hx} y2={505} stroke="#C93A27" strokeWidth={2.4} opacity={0.85} />;
            })}
            {[0.25, 0.5, 0.75].map((t, idx) => {
              const hx = (1 - t) * (1 - t) * 590 + 2 * (1 - t) * t * 650 + t * t * 760;
              const hy = (1 - t) * (1 - t) * 328 + 2 * (1 - t) * t * 482 + t * t * 505;
              return <line key={`r-${idx}`} x1={hx} y1={hy} x2={hx} y2={505} stroke="#C93A27" strokeWidth={2.4} opacity={0.85} />;
            })}
            <path d="M 80 505 Q 190 482 250 328 Q 420 555 590 328 Q 650 482 760 505" fill="none" stroke="#E04F3E" strokeWidth={6} strokeLinecap="round" />
            {[250, 590].map((tx) => (
              <g key={tx}>
                <rect x={tx - 15} y={322} width={17} height={214} fill="#E85D4A" />
                <rect x={tx + 2} y={322} width={13} height={214} fill="#BA3827" />
                <rect x={tx - 24} y={364} width={48} height={11} fill="#B83625" />
                <rect x={tx - 24} y={422} width={48} height={11} fill="#B83625" />
              </g>
            ))}
            {/* Bridge Deck + Moving Golden USD Payment Packets */}
            <rect x={0} y={505} width={860} height={28} fill="#2B3948" />
            <rect x={0} y={505} width={860} height={7} fill="#46596E" />
            <line x1={0} y1={520} x2={850} y2={520} stroke="#FFD166" strokeWidth={3.5} strokeDasharray="24 18" />
            {[0, 1, 2].map((ci) => {
              const cx = ((frame * 3.2 + ci * 280) % 820);
              return <rect key={ci} x={cx} y={497} width={22} height={9} rx={3} fill="#FFD166" />;
            })}
          </g>

          {/* Lush Emerald Bengal Riverbank */}
          <path d="M 786 546 Q 848 500 946 504 L 1280 504 L 1280 720 L 786 720 Z" fill="#1E8C54" />
          <path d="M 786 558 Q 860 520 960 524 L 1280 524 L 1280 720 L 786 720 Z" fill="#166E41" />

          {/* Split-Shaded Bengal Palm Tree */}
          <g transform="translate(848, 510)">
            <path d="M 0 0 Q -14 -55 -6 -108" fill="none" stroke="#7A4E32" strokeWidth={11} strokeLinecap="round" />
            <path d="M -6 -108 Q -58 -118 -68 -86" fill="none" stroke="#166E41" strokeWidth={10} strokeLinecap="round" />
            <path d="M -6 -108 Q -36 -146 6 -142" fill="none" stroke="#27AE60" strokeWidth={10} strokeLinecap="round" />
            <path d="M -6 -108 Q 40 -126 54 -92" fill="none" stroke="#2ECC71" strokeWidth={10} strokeLinecap="round" />
          </g>

          {/* HERO RIGHT: SPLIT-SHADED CLASSICAL BANGLADESHI BANK BUILDING */}
          <g transform={`translate(1036, 512) scale(${Math.max(0.001, bankPop)})`}>
            {/* Golden Classical Dome (Exact Semicircular Split Lit/Shade!) */}
            <path d="M -86 -166 A 86 86 0 0 1 86 -166 Z" fill="#F5B82E" />
            <path d="M 0 -252 A 86 86 0 0 1 86 -166 L 0 -166 Z" fill="#D4941A" />
            <rect x={-3} y={-286} width={6} height={36} fill="#1E293B" />
            <circle cx={0} cy={-286} r={7.5} fill="#1FB57A" />
            {/* Pediment & Fluted Columns */}
            <polygon points="-144,-152 0,-208 144,-152" fill="#FFFDF8" />
            <polygon points="0,-208 144,-152 0,-152" fill="#E6DEC8" />
            <rect x={-130} y={-152} width={260} height={152} fill="#E6DEC8" />
            <rect x={-130} y={-152} width={260} height={12} fill="rgba(18,28,42,0.14)" />
            {[-96, -48, 0, 48, 96].map((cx) => (
              <g key={cx}>
                <rect x={cx - 12} y={-146} width={14} height={140} fill="#FFFFFF" />
                <rect x={cx + 2} y={-146} width={10} height={140} fill="#DCE3EC" />
              </g>
            ))}
            <rect x={-148} y={-10} width={296} height={18} fill="#CBD5E1" />
            <rect x={-156} y={8} width={312} height={12} fill="#94A3B8" />
          </g>

          {/* Sleek Lineless Split-Shaded Emerald & White Cargo Jet */}
          <g transform={`translate(${planeX.toFixed(1)}, ${planeY.toFixed(1)}) rotate(${planeRot.toFixed(1)})`}>
            <line x1={-250} y1={4} x2={-98} y2={4} stroke="#FFFFFF" strokeWidth={4} strokeDasharray="16 14" opacity={0.7} />
            <polygon points="-92,-4 -118,-50 -66,-4" fill="#1FB57A" />
            <path d="M -98 -14 L 76 -14 Q 116 -14 122 4 Q 116 22 76 22 L -86 22 Z" fill="#FFFFFF" />
            <path d="M -86 8 L 118 8 Q 112 22 76 22 L -86 22 Z" fill="#CBD5E1" />
            <rect x={-82} y={1} width={170} height={9} fill="#1E8C54" />
            <polygon points="-24,6 34,6 -8,48 -38,48" fill="#167848" />
            <text x={24} y={-2} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={21} fill="#0F172A">
              $1,500
            </text>
          </g>

          {/* Fanning Bangladeshi Taka Banknotes Bursting Above Bank */}
          {frame >= 420 && (
            <g transform={`translate(1036, 318) scale(${Math.max(0.001, takaFan)})`}>
              {[-28, -14, 0, 14, 28].map((ang, bi) => (
                <g key={bi} transform={`rotate(${ang}) translate(0, -106)`}>
                  <rect x={-52} y={-26} width={104} height={52} rx={5} fill="#26B87A" />
                  <rect x={0} y={-26} width={52} height={52} rx={4} fill="#1B9662" />
                  <circle cx={0} cy={0} r={14} fill="#E03E47" />
                  <text x={0} y={7} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={22} fill="#FFFFFF">
                    ৳
                  </text>
                </g>
              ))}
            </g>
          )}
          <ImpactBurst x={1036} y={244} triggerFrame={420} color="#FFD166" secondaryColor="#2AD08E" radius={128} />

          <FloatingCallout
            x={420}
            y={104}
            text={frame >= 378 ? `৳${bdtAmount.toLocaleString()} BDT` : 'USD → PAYONEER / WISE'}
            subtext="CLEAN LEGAL SETTLEMENT IN BANGLADESH"
            size={56}
            fill={frame >= 378 ? '#FFD166' : '#FFFFFF'}
            accent="#2AD08E"
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
// SCENE 10 · 2.5D ALPINE MOUNTAIN STAIRCASE ASCENT ($0 -> $300 -> $1,500/MO) (v6.0)
// ============================================================================
export const Scene10NinetyDayMath: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const m1Pop = spring({ frame: Math.max(0, frame - 32), fps, config: SPRING_POP });
  const m2Pop = spring({ frame: Math.max(0, frame - 235), fps, config: SPRING_POP });
  const m3Pop = spring({ frame: Math.max(0, frame - 455), fps, config: SPRING_POP });

  const m2Val = Math.round(
    interpolate(frame, [240, 360], [0, 300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const m3Val = Math.round(
    interpolate(frame, [460, 640], [300, 1500], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const flagWave = Math.sin(frame * 0.14) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1B5EA8' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="alpineSky6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#144B91" />
            <stop offset="58%" stopColor="#58B3E6" />
            <stop offset="100%" stopColor="#FFE6B8" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'push')}>
          <rect width={1280} height={720} fill="url(#alpineSky6)" />
          <DriftingClouds frame={frame} tint="#FFFFFF" shadeTint="#B3DCF2" opacity={0.88} speed={0.34} />

          {/* Split-Shaded Distant Snow-Capped Alpine Peaks (Lit Left / Cool Shadow Right!) */}
          <g>
            <polygon points="-40,680 280,276 280,680" fill="#6AA0CA" />
            <polygon points="280,276 610,680 280,680" fill="#4678A3" />
            <polygon points="280,276 226,344 256,334 280,352" fill="#F8FCFF" />
            <polygon points="280,276 280,352 308,334 336,346" fill="#CBE3F5" />

            <polygon points="460,680 860,196 860,680" fill="#5289B8" />
            <polygon points="860,196 1320,680 860,680" fill="#356691" />
            <polygon points="860,196 792,280 832,266 860,286" fill="#F8FCFF" />
            <polygon points="860,196 860,286 896,264 934,282" fill="#CBE3F5" />
          </g>

          {/* TIER 1: MONTH 1 STONE BASE CAMP ($0) */}
          <g transform={`translate(0, ${(1 - m1Pop) * 120})`}>
            <polygon points="0,720 0,520 420,520 420,720" fill="#4F667D" />
            <rect x={0} y={520} width={420} height={18} fill="#7B93AB" />
            <rect x={392} y={520} width={28} height={200} fill="#384B5E" />
            {/* Split-Shaded Expedition Base Camp Tent */}
            <g transform="translate(210, 520)">
              <polygon points="-68,0 0,-86 0,0" fill="#F26444" />
              <polygon points="0,-86 68,0 0,0" fill="#C9462A" />
              <polygon points="-22,0 0,-52 22,0" fill="#1E2C3B" />
            </g>
            <FloatingCallout x={210} y={372} text="$0" subtext="MONTH 1 · BUILD PROOF" size={58} fill="#FFFFFF" accent="#F26444" delayFrames={42} />
          </g>

          {/* TIER 2: MONTH 2 GRANITE OUTPOST ($300) */}
          <g transform={`translate(0, ${(1 - m2Pop) * 140})`}>
            <polygon points="415,720 415,396 855,396 855,720" fill="#315270" />
            <rect x={415} y={396} width={440} height={18} fill="#5A83A8" />
            <rect x={827} y={396} width={28} height={324} fill="#213A52" />
            <g transform="translate(635, 396)">
              <rect x={-3} y={-120} width={6} height={120} fill="#E2E8F0" />
              <path d={`M 3 -116 Q 38 ${-126 + flagWave} 82 -108 L 82 -62 Q 38 ${-78 + flagWave} 3 -66 Z`} fill="#1FB57A" />
              <path d={`M 3 -90 Q 38 ${-100 + flagWave} 82 -84 L 82 -62 Q 38 ${-78 + flagWave} 3 -66 Z`} fill="#148F5E" />
            </g>
            <FloatingCallout x={635} y={222} text={`$${m2Val}`} subtext="MONTH 2 · FIRST CLIENT" size={60} fill="#2AD08E" accent="#FFD166" delayFrames={240} />
          </g>

          {/* TIER 3: MONTH 3 GOLDEN SUMMIT ($1,500/MO) */}
          <g transform={`translate(0, ${(1 - m3Pop) * 160})`}>
            <polygon points="850,720 850,282 1280,282 1280,720" fill="#18324D" />
            <rect x={850} y={282} width={430} height={22} fill="#F5B82E" />
            <rect x={850} y={304} width={430} height={6} fill="#B87E14" />
            {/* Radiant Split-Shaded Golden Obelisk Beacon */}
            <g transform="translate(1065, 282)">
              <circle cx={0} cy={-62} r={54} fill="#FFD166" opacity={0.26 + 0.1 * Math.sin(frame * 0.14)} />
              <polygon points="-24,0 0,-80 0,0" fill="#FFD166" />
              <polygon points="0,-80 24,0 0,0" fill="#D4941A" />
              <circle cx={0} cy={-82} r={13} fill="#FFF8D6" />
            </g>
            <ImpactBurst x={1065} y={200} triggerFrame={460} color="#FFD166" secondaryColor="#FFFFFF" radius={120} />
            <FloatingCallout x={1060} y={98} text={`$${m3Val.toLocaleString()}/MO`} subtext="MONTH 3 · ৳1.8 LAKH" size={56} fill="#FFD166" accent="#2AD08E" delayFrames={460} />
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
// SCENE 11 · MIDNIGHT ARCHITECTURAL STUDY & PRECISION BRASS CLOCK (v6.0 LINELESS)
// ============================================================================
export const Scene11EveningEngine: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();

  const sweepDeg = interpolate(frame, [26, durationInFrames - 85], [0, 360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const repeatCount = Math.round(
    interpolate(frame, [415, durationInFrames - 36], [1, 90], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const metroAngle = Math.sin(frame * 0.12) * 26;
  const steamOff = (frame * 1.1) % 54;

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
    <AbsoluteFill style={{ backgroundColor: '#101D32' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="nightStudyWall6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#172945" />
            <stop offset="100%" stopColor="#0E1A2E" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'pull')}>
          <rect width={1280} height={720} fill="url(#nightStudyWall6)" />

          {/* Architectural Study Molding & Night Window */}
          <rect x={0} y={482} width={1280} height={48} fill="#0B1526" />
          <g>
            <rect x={88} y={102} width={296} height={344} rx={6} fill="#091322" />
            <circle cx={278} cy={196} r={54} fill="#FFE699" opacity={0.09} />
            <path d="M 272 172 A 34 34 0 1 0 310 222 A 26 26 0 1 1 272 172 Z" fill="#FFE699" />
            {[[138, 158], [198, 138], [158, 236], [318, 148], [238, 286]].map(([sx, sy], i) => (
              <circle key={i} cx={sx} cy={sy} r={2.5} fill="#FFFFFF" opacity={0.45 + 0.5 * Math.sin(frame * 0.08 + i)} />
            ))}
            {/* Distant Night Roofline Outside Window */}
            <path d="M 88 446 L 88 378 L 154 378 L 154 348 L 236 348 L 236 392 L 320 392 L 320 362 L 384 362 L 384 446 Z" fill="#142640" />
            <rect x={88} y={102} width={296} height={344} rx={6} fill="none" stroke="#223757" strokeWidth={10} />
            <rect x={233} y={102} width={6} height={344} fill="#223757" />
            <rect x={88} y={272} width={296} height={6} fill="#223757" />
          </g>

          {/* Warm Walnut Evening Desk */}
          <rect x={0} y={530} width={1280} height={190} fill="#704429" />
          <rect x={0} y={530} width={1280} height={16} fill="#96613E" />

          {/* HERO CENTER: GIANT BRUSHED-BRASS PRECISION TIMEPIECE */}
          <g transform="translate(640, 324)">
            <circle cx={8} cy={12} r={178} fill="rgba(5,10,18,0.34)" />
            <circle r={178} fill="#D99B26" />
            <path d="M -178 0 A 178 178 0 0 1 178 0 Z" fill="#F5B82E" opacity={0.7} />
            <circle r={156} fill="#FAF6EE" />

            {/* 3 Vibrant Flat-Shaded Infographics Time Sectors Filling Live */}
            <path d={arcPath(0, 120, 148)} fill="#F26444" opacity={0.92} />
            <path d={arcPath(120, 240, 148)} fill="#2E8AD8" opacity={0.92} />
            <path d={arcPath(240, 360, 148)} fill="#1FB57A" opacity={0.92} />

            {/* Crisp Clock Tick Marks */}
            {Array.from({ length: 12 }, (_, t) => (
              <line
                key={t}
                x1={0}
                y1={-146}
                x2={0}
                y2={-126}
                stroke="#0F172A"
                strokeWidth={t % 3 === 0 ? 5.5 : 3}
                strokeLinecap="round"
                transform={`rotate(${t * 30})`}
              />
            ))}

            {/* Sweeping Clock Hand */}
            <g transform={`rotate(${sweepDeg.toFixed(2)})`}>
              <line x1={0} y1={22} x2={0} y2={-124} stroke="#0F172A" strokeWidth={8} strokeLinecap="round" />
            </g>
            <circle r={16} fill="#F5B82E" />
            <circle r={7} fill="#0F172A" />
          </g>

          {/* Crisp Infographics Show Leader-Line Labels For Each 40m Sector */}
          <LeaderCallout targetX={754} targetY={252} elbowX={840} elbowY={212} endX={1028} label="40m CRAFT" sublabel="SHARPEN ONE SKILL" accent="#FF7B54" delayFrames={48} />
          <LeaderCallout targetX={778} targetY={362} elbowX={840} elbowY={328} endX={1028} label="40m REPLIES" sublabel="GLOBAL FOUNDERS" accent="#66C2F0" delayFrames={188} />
          <LeaderCallout targetX={730} targetY={446} elbowX={840} elbowY={444} endX={1028} label="40m PROOF" sublabel="SHIP IN PUBLIC" accent="#2AD08E" delayFrames={322} />

          {/* Split-Shaded Mahogany Metronome on Right Desk */}
          <g transform="translate(1110, 530)">
            <polygon points="-44,0 44,0 68,20 -20,20" fill="rgba(5,10,18,0.28)" />
            <polygon points="-44,0 -18,-132 0,-132 0,0" fill="#A65832" />
            <polygon points="0,-132 18,-132 44,0 0,0" fill="#7D3E20" />
            <polygon points="-22,-10 -11,-114 11,-114 22,-10" fill="#F5E6CA" />
            <g transform={`translate(0, -18) rotate(${metroAngle.toFixed(1)})`}>
              <line x1={0} y1={0} x2={0} y2={-112} stroke="#0F172A" strokeWidth={4.5} strokeLinecap="round" />
              <polygon points="-11,-78 11,-78 7,-60 -7,-60" fill="#F5B82E" />
            </g>
          </g>

          {/* Steaming Night Coffee Mug on Left Desk */}
          <g transform="translate(208, 498)">
            <path d={`M 0 ${-24 - steamOff} Q -12 ${-44 - steamOff} 2 ${-62 - steamOff}`} fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" opacity={Math.sin((steamOff / 54) * Math.PI) * 0.65} />
            <path d="M 24 -12 Q 42 -10 40 8 Q 38 24 24 20" fill="none" stroke="#D99B26" strokeWidth={7} />
            <rect x={-26} y={-24} width={52} height={56} rx={5} fill="#F5B82E" />
            <rect x={0} y={-24} width={26} height={56} rx={3} fill="#D99B26" />
          </g>

          <FloatingCallout
            x={640}
            y={86}
            text={frame >= 415 ? `REPEAT × ${repeatCount}` : '2 HOURS EVERY EVENING'}
            subtext="COMPOUNDING DAILY EXECUTION"
            size={56}
            fill="#FFD166"
            accent="#2AD08E"
            delayFrames={10}
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
// SCENE 12 · EPIC GOLDEN SUNRISE OVER DHAKA, PADMA BRIDGE & EMERALD RIVER (v6.0)
// ============================================================================
export const Scene12BengalCompassFinale: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();

  const sunRiseY = interpolate(frame, [0, 315], [488, 286], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rayRot = frame * 0.22;
  const rippleShift = (frame * 1.6) % 180;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1E3A63' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="bengalDawn6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#142E57" />
            <stop offset="40%" stopColor="#A64D64" />
            <stop offset="76%" stopColor="#F59B56" />
            <stop offset="100%" stopColor="#FFE8A3" />
          </linearGradient>
          <linearGradient id="emeraldRiver6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A7D74" />
            <stop offset="100%" stopColor="#0D4745" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'pull')}>
          <rect width={1280} height={720} fill="url(#bengalDawn6)" />

          {/* Soft Rotating Sunburst Rays Behind Rising Sun */}
          <g transform={`translate(640, ${sunRiseY.toFixed(1)}) rotate(${rayRot.toFixed(1)})`} opacity={0.18}>
            {Array.from({ length: 12 }, (_, r) => (
              <polygon key={r} points="0,0 -38,-780 38,-780" fill="#FFF6CC" transform={`rotate(${r * 30})`} />
            ))}
          </g>

          {/* Radiant Rising Sun Disc + Atmospheric Halos */}
          <circle cx={640} cy={sunRiseY} r={190} fill="#FFD166" opacity={0.16} />
          <circle cx={640} cy={sunRiseY} r={142} fill="#FFE082" opacity={0.30} />
          <circle cx={640} cy={sunRiseY} r={104} fill="#FFF7D1" />

          <DriftingClouds frame={frame} tint="#FFE4C2" shadeTint="#D97E6A" opacity={0.8} speed={0.4} />

          {/* Gliding Morning Birds */}
          {[
            { x: 220, y: 174, spd: 1.35 },
            { x: 304, y: 196, spd: 1.15 },
            { x: 924, y: 162, spd: 1.45 },
          ].map((b, bi) => {
            const bx = ((b.x + frame * b.spd) % 1380) - 50;
            const wing = Math.sin(frame * 0.22 + bi) * 6.5;
            return (
              <path
                key={bi}
                d={`M ${bx - 15} ${b.y + wing} Q ${bx - 6} ${b.y - 7} ${bx} ${b.y} Q ${bx + 6} ${b.y - 7} ${bx + 15} ${b.y + wing}`}
                fill="none"
                stroke="#1A2639"
                strokeWidth={3}
                strokeLinecap="round"
              />
            );
          })}

          {/* Far Hazy Dhaka Skyline Silhouette */}
          <path
            d="M 0 470 L 0 385 L 65 385 L 65 340 L 125 340 L 125 395 L 210 395 L 210 320 L 285 320 L 285 380 L 385 380 L 385 352 L 460 352 L 460 415 L 820 415 L 820 345 L 915 345 L 915 390 L 1010 390 L 1010 315 L 1090 315 L 1090 375 L 1185 375 L 1185 350 L 1280 350 L 1280 470 Z"
            fill="#4A3E63"
            opacity={0.72}
          />
          {/* Midground Detailed Architectural Towers Flanking the Rising Sun */}
          <SplitBuilding x={46} y={338} w={76} h={132} litColor="#2C3E5C" shadeColor="#1B2840" frame={frame} />
          <SplitBuilding x={152} y={306} w={84} h={164} litColor="#273752" shadeColor="#182438" frame={frame} spire />
          <SplitBuilding x={1026} y={302} w={86} h={168} litColor="#273752" shadeColor="#182438" frame={frame} spire />
          <SplitBuilding x={1142} y={336} w={78} h={134} litColor="#2C3E5C" shadeColor="#1B2840" frame={frame} />

          {/* Iconic Multi-Span Padma Bridge Truss Silhouette Spanning Horizon */}
          <g fill="none" stroke="#182436" strokeWidth={3.8}>
            <line x1={0} y1={454} x2={1280} y2={454} strokeWidth={7} />
            <line x1={0} y1={426} x2={1280} y2={426} strokeWidth={4} />
            {Array.from({ length: 16 }, (_, i) => (
              <g key={i}>
                <line x1={i * 80} y1={454} x2={i * 80 + 40} y2={426} />
                <line x1={i * 80 + 40} y1={426} x2={i * 80 + 80} y2={454} />
                {i % 2 === 0 && <line x1={i * 80} y1={454} x2={i * 80} y2={530} strokeWidth={9} />}
              </g>
            ))}
          </g>

          {/* Sparkling Emerald Bengal River Foreground + Sunlit Golden Reflection */}
          <rect x={0} y={484} width={1280} height={236} fill="url(#emeraldRiver6)" />
          {[0, 1, 2, 3, 4, 5].map((row) => {
            const rw = 210 - row * 28 + Math.sin(frame * 0.1 + row) * 16;
            return (
              <rect
                key={row}
                x={640 - rw / 2}
                y={502 + row * 24}
                width={rw}
                height={9}
                rx={4.5}
                fill="#FFD166"
                opacity={0.82 - row * 0.11}
              />
            );
          })}
          <g transform={`translate(${-rippleShift}, 0)`} opacity={0.38}>
            <path
              d="M 0 605 Q 45 590 90 605 T 180 605 T 270 605 T 360 605 T 450 605 T 540 605 T 630 605 T 720 605 T 810 605 T 900 605 T 990 605 T 1080 605 T 1170 605 T 1260 605 T 1350 605 T 1440 605"
              fill="none"
              stroke="#7EE0C7"
              strokeWidth={3.5}
            />
          </g>

          <FloatingCallout
            x={640}
            y={162}
            text="DAY 01 STARTS TONIGHT"
            subtext="TURN YOUR DESK IN BANGLADESH INTO A GLOBAL STUDIO"
            size={66}
            fill="#FFFFFF"
            accent="#FFD166"
            delayFrames={36}
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
