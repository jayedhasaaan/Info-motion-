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
  SPRING_SLAM,
  SPRING_SMOOTH,
  getCameraTransform,
} from '../theme';
import type { WorldSceneProps } from './ActOneScenes';

// ============================================================================
// SCENE 05 · DUSTY LEATHER DIARY -> SUNLIT CORNER BOUTIQUE STOREFRONT (REAL STREET!)
// ============================================================================
export const Scene05ProfileStorefront: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Circle iris reveal expanding from closed leather diary into bright corner storefront street!
  const irisP = interpolate(frame, [165, 230], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const diaryShake = frame > 95 && frame < 155 ? Math.sin(frame * 1.4) * 5 : 0;
  const awningUnfurl = spring({ frame: Math.max(0, frame - 220), fps, config: SPRING_POP });
  const signPop = spring({ frame: Math.max(0, frame - 265), fps, config: SPRING_POP });
  const trophyPop = spring({ frame: Math.max(0, frame - 335), fps, config: SPRING_POP });
  const shimmerX = ((frame * 4.5) % 460) - 120;

  return (
    <AbsoluteFill style={{ backgroundColor: '#3A322D' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="streetSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E8AD8" />
            <stop offset="72%" stopColor="#8ED3F7" />
            <stop offset="100%" stopColor="#D7F2FF" />
          </linearGradient>
          <clipPath id="storefrontIris">
            <circle cx={640} cy={380} r={irisP * 920} />
          </clipPath>
          <clipPath id="shopGlassClip">
            <rect x={445} y={345} width={250} height={175} rx={6} />
          </clipPath>
        </defs>

        {/* ===== PART 5A: DUSTY CLOSED PERSONAL DIARY ON DARK WOOD TABLE ===== */}
        {irisP < 0.99 && (
          <g>
            <rect width={1280} height={720} fill="#362F2B" />
            <rect x={0} y={500} width={1280} height={220} fill="#5C4438" stroke={OUTLINE_COLOR} strokeWidth={4} />
            <g transform={`translate(${640 + diaryShake}, 395) rotate(-6)`}>
              <ellipse cx={0} cy={132} rx={155} ry={18} fill="rgba(0,0,0,0.3)" />
              {/* Closed Leather Diary Book */}
              <rect x={-120} y={-125} width={240} height={250} rx={16} fill="#7B4B3A" stroke={OUTLINE_COLOR} strokeWidth={5} />
              <rect x={-120} y={-125} width={34} height={250} rx={8} fill="#5A3326" stroke={OUTLINE_COLOR} strokeWidth={4} />
              <rect x={92} y={-18} width={36} height={36} rx={6} fill="#C99B49" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              <text
                x={12}
                y={8}
                textAnchor="middle"
                fontFamily={FONT_DISPLAY}
                fontWeight={900}
                fontSize={28}
                fill="#E8D8C3"
              >
                DIARY
              </text>
              {/* Red Cross Out */}
              {frame > 95 && (
                <g opacity={0.9}>
                  <line x1={-110} y1={-105} x2={110} y2={105} stroke="#E63946" strokeWidth={18} strokeLinecap="round" />
                  <line x1={110} y1={-105} x2={-110} y2={105} stroke="#E63946" strokeWidth={18} strokeLinecap="round" />
                </g>
              )}
            </g>
            <FloatingCallout x={640} y={125} text="NOT A DIARY" size={58} fill="#FF6B6B" delayFrames={10} />
          </g>
        )}

        {/* ===== PART 5B: SUNLIT CORNER BOUTIQUE STOREFRONT ON REAL CITY STREET ===== */}
        {irisP > 0.005 && (
          <g clipPath="url(#storefrontIris)">
            <g transform={getCameraTransform(Math.max(0, frame - 180), durationInFrames - 180, 'push')}>
              <rect width={1280} height={720} fill="url(#streetSky)" />
              <DriftingClouds frame={frame} tint="#FFFFFF" opacity={0.92} speed={0.45} />

              {/* Distant pastel city buildings with crisp architectural windows */}
              <rect x={60} y={285} width={160} height={310} fill="#9BC3DC" stroke={OUTLINE_COLOR} strokeWidth={3} />
              {[315, 365, 415].map((wy) =>
                [88, 128, 168].map((wx) => (
                  <rect key={`l-${wx}-${wy}`} x={wx} y={wy} width={22} height={30} rx={2} fill="#D8F0FF" stroke={OUTLINE_COLOR} strokeWidth={2} />
                ))
              )}
              <rect x={1060} y={260} width={170} height={335} fill="#9BC3DC" stroke={OUTLINE_COLOR} strokeWidth={3} />
              {[292, 342, 392].map((wy) =>
                [1088, 1132, 1176].map((wx) => (
                  <rect key={`r-${wx}-${wy}`} x={wx} y={wy} width={22} height={30} rx={2} fill="#D8F0FF" stroke={OUTLINE_COLOR} strokeWidth={2} />
                ))
              )}

              {/* Sidewalk & City Street */}
              <rect x={0} y={558} width={1280} height={42} fill="#DCE2E8" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              <rect x={0} y={600} width={1280} height={120} fill="#465260" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              {/* Road dashed lane line */}
              <line x1={0} y1={658} x2={1280} y2={658} stroke="#FFD166" strokeWidth={7} strokeDasharray="48 34" />

              {/* Street Trees flanking storefront */}
              {[195, 1085].map((tx, idx) => (
                <g key={idx} transform={`translate(${tx}, 558)`}>
                  <rect x={-12} y={-95} width={24} height={95} fill="#7A4E32" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                  <circle cx={0} cy={-135} r={54} fill="#27AE60" stroke={OUTLINE_COLOR} strokeWidth={4} />
                  <circle cx={-34} cy={-108} r={34} fill="#2ECC71" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                  <circle cx={34} cy={-108} r={34} fill="#1E8449" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                </g>
              ))}

              {/* HERO: Warm Brick Corner Storefront Building */}
              <g transform="translate(640, 558)">
                {/* Main warm cream & terracotta facade */}
                <rect x={-295} y={-350} width={590} height={350} rx={8} fill="#F4EFE6" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
                {/* Architectural cornice roof */}
                <rect x={-315} y={-378} width={630} height={34} rx={6} fill="#2B3D52" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
                {/* Top Fascia Signboard (Storefront Offer Banner!) */}
                <g transform={`scale(${Math.max(0.001, signPop)})`}>
                  <rect x={-245} y={-328} width={490} height={64} rx={8} fill="#18222F" stroke="#F5B82E" strokeWidth={4} />
                  <text
                    x={0}
                    y={-288}
                    textAnchor="middle"
                    fontFamily={FONT_DISPLAY}
                    fontWeight={900}
                    fontSize={22}
                    fill="#FFD166"
                    letterSpacing="0.08em"
                  >
                    GLOBAL STUDIO STOREFRONT
                  </text>
                </g>

                {/* Crystal Display Window Showing Golden Proof Trophy */}
                <rect x={-195} y={-213} width={250} height={175} rx={6} fill="#D6F0FF" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
                <g clipPath="url(#shopGlassClip)" transform="translate(-640, -558)">
                  {/* Moving daylight glass reflection streak */}
                  <polygon
                    points={`${445 + shimmerX},345 ${495 + shimmerX},345 ${435 + shimmerX},520 ${385 + shimmerX},520`}
                    fill="#FFFFFF"
                    opacity={0.45}
                  />
                </g>
                {/* Golden Trophy & Framed Case Study Inside Display Window */}
                <g transform={`translate(-70, -78) scale(${Math.max(0.001, trophyPop)})`}>
                  <rect x={-48} y={14} width={96} height={24} fill="#8B5E3C" stroke={OUTLINE_COLOR} strokeWidth={3} />
                  <path d="M -28 -54 L 28 -54 L 20 -12 Q 0 6 -20 -12 Z" fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                  <rect x={-8} y={-8} width={16} height={22} fill="#D49A24" stroke={OUTLINE_COLOR} strokeWidth={3} />
                  <rect x={-22} y={8} width={44} height={10} rx={3} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={3} />
                </g>

                {/* Boutique Entry Door + Glowing Neon OPEN Sign */}
                <rect x={95} y={-213} width={145} height={213} rx={6} fill="#1E8449" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
                <rect x={115} y={-193} width={105} height={106} rx={4} fill="#A9E2F3" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                <circle cx={216} cy={-64} r={7} fill="#FFD166" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
                {/* Glowing OPEN sign swinging gently */}
                <g transform={`translate(168, -142) rotate(${Math.sin(frame * 0.08) * 3})`}>
                  <rect x={-42} y={-18} width={84} height={36} rx={6} fill="#E63946" stroke={OUTLINE_COLOR} strokeWidth={3} />
                  <text
                    x={0}
                    y={7}
                    textAnchor="middle"
                    fontFamily={FONT_DISPLAY}
                    fontWeight={900}
                    fontSize={20}
                    fill="#FFFFFF"
                  >
                    OPEN
                  </text>
                </g>

                {/* Classic Striped Boutique Awning Unfurling! */}
                <g transform={`translate(0, -245) scale(1, ${Math.max(0.001, awningUnfurl)})`}>
                  {[-270, -210, -150, -90, -30, 30, 90, 150, 210].map((ax, ai) => (
                    <path
                      key={ai}
                      d={`M ${ax} 0 L ${ax + 60} 0 L ${ax + 60} 44 Q ${ax + 30} 62 ${ax} 44 Z`}
                      fill={ai % 2 === 0 ? '#E85D4A' : '#FFFBF0'}
                      stroke={OUTLINE_COLOR}
                      strokeWidth={3.5}
                    />
                  ))}
                </g>
              </g>

              <FloatingCallout
                x={640}
                y={104}
                text="YOUR GLOBAL STOREFRONT"
                size={52}
                fill="#FFFFFF"
                delayFrames={235}
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
// SCENE 06 · 30-DAY WALL TEAR-OFF CALENDAR & STACKING SHIPPING CRATES
// ============================================================================
export const Scene06ProofEngine: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dayNum = Math.min(
    30,
    Math.max(1, Math.round(interpolate(frame, [30, durationInFrames - 80], [1, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))
  );

  // Flying torn calendar page every 24 frames!
  const pageCycle = (frame % 24) / 24;
  const tornX = interpolate(pageCycle, [0, 1], [0, 260]);
  const tornY = interpolate(pageCycle, [0, 1], [0, 220]) - Math.sin(pageCycle * Math.PI) * 90;
  const tornRot = interpolate(pageCycle, [0, 1], [0, 52]);
  const tornOp = interpolate(pageCycle, [0, 0.75, 1], [1, 0.9, 0]);

  const crate1 = spring({ frame: Math.max(0, frame - 90), fps, config: SPRING_POP });
  const crate2 = spring({ frame: Math.max(0, frame - 210), fps, config: SPRING_POP });
  const crate3 = spring({ frame: Math.max(0, frame - 340), fps, config: SPRING_POP });

  const renderWoodenCrate = (x: number, y: number, label: string, pop: number) => (
    <g transform={`translate(${x}, ${y}) scale(${Math.max(0.001, pop)})`}>
      <rect x={-98} y={-64} width={196} height={128} rx={6} fill="#D99B52" stroke={OUTLINE_COLOR} strokeWidth={4} />
      <rect x={-82} y={-48} width={164} height={96} fill="#C4853D" stroke={OUTLINE_COLOR} strokeWidth={3} />
      <line x1={-82} y1={-48} x2={82} y2={48} stroke="#A86D2A" strokeWidth={12} />
      <line x1={-82} y1={-48} x2={82} y2={48} stroke={OUTLINE_COLOR} strokeWidth={3} />
      {/* Bold Red Shipping Stamp directly on crate wood */}
      <g transform="rotate(-7)">
        <rect x={-72} y={-20} width={144} height={40} rx={4} fill="#F5EDE0" stroke="#C82834" strokeWidth={3.5} />
        <text
          x={0}
          y={7}
          textAnchor="middle"
          fontFamily={FONT_DISPLAY}
          fontWeight={900}
          fontSize={18}
          fill="#C82834"
        >
          {label}
        </text>
      </g>
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#F0E6D6' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <g transform={getCameraTransform(frame, durationInFrames, 'pan-right')}>
          {/* Warm Plaster Studio Wall + Subtle Brick Texture Accents */}
          <rect width={1280} height={720} fill="#F4EBDC" />
          {[
            [90, 140], [150, 140], [120, 168], [1040, 170], [1100, 170], [1070, 198],
          ].map(([bx, by], i) => (
            <rect key={i} x={bx} y={by} width={52} height={22} rx={3} fill="#E6D7C1" />
          ))}

          {/* Studio Concrete Floor */}
          <rect x={0} y={545} width={1280} height={175} fill="#8C99A6" stroke={OUTLINE_COLOR} strokeWidth={4} />
          <rect x={0} y={545} width={1280} height={16} fill="#A7B4C2" stroke={OUTLINE_COLOR} strokeWidth={3} />

          {/* LEFT HERO: Giant Physical Wall Tear-Off Calendar */}
          <g transform="translate(360, 350)">
            {/* Shadow behind calendar */}
            <rect x={-130} y={-142} width={276} height={310} rx={16} fill="rgba(24,34,47,0.16)" />
            {/* Calendar backing board */}
            <rect x={-138} y={-152} width={276} height={304} rx={16} fill="#FFFFFF" stroke={OUTLINE_COLOR} strokeWidth={5} />
            {/* Crimson top binder bar */}
            <path d="M -138 -136 Q -138 -152 -122 -152 L 122 -152 Q 138 -152 138 -136 L 138 -74 L -138 -74 Z" fill="#E63946" stroke={OUTLINE_COLOR} strokeWidth={5} />
            {/* Brass mounting rings */}
            <circle cx={-74} cy={-114} r={11} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            <circle cx={74} cy={-114} r={11} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            <text x={0} y={-102} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={24} fill="#FFFFFF">
              DAY
            </text>
            {/* Current Big Bold Day Number */}
            <text
              x={0}
              y={76}
              textAnchor="middle"
              fontFamily={FONT_DISPLAY}
              fontWeight={900}
              fontSize={148}
              fill={OUTLINE_COLOR}
            >
              {String(dayNum).padStart(2, '0')}
            </text>

            {/* Animated Torn Page Ripping Off and Fluttering Right! */}
            {dayNum < 30 && (
              <g
                transform={`translate(${tornX.toFixed(1)}, ${tornY.toFixed(1)}) rotate(${tornRot.toFixed(1)})`}
                opacity={tornOp}
              >
                <rect x={-124} y={-68} width={248} height={212} rx={8} fill="#FFFDF8" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
                <text
                  x={0}
                  y={70}
                  textAnchor="middle"
                  fontFamily={FONT_DISPLAY}
                  fontWeight={900}
                  fontSize={120}
                  fill="#94A3B8"
                >
                  {String(Math.max(1, dayNum - 1)).padStart(2, '0')}
                </text>
              </g>
            )}
          </g>

          {/* RIGHT HERO: Physical Wooden Shipping Crates Stacking Up ("TEARDOWN", "REDESIGN", "30S CLIP") */}
          {renderWoodenCrate(850, 480, 'TEARDOWN', crate1)}
          {renderWoodenCrate(1062, 480, 'REDESIGN', crate2)}
          {renderWoodenCrate(956, 350, '30S PROOF', crate3)}

          <FloatingCallout
            x={640}
            y={96}
            text="30 DAYS OF PUBLIC PROOF"
            size={50}
            fill="#FFFFFF"
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
// SCENE 07 · COASTAL LIGHTHOUSE RADAR LAUNCHING 50 PAPER AIRPLANES ACROSS THE SEA
// ============================================================================
export const Scene07SniperRadar: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();

  const beamAngle = -28 + Math.sin(frame * 0.045) * 18;
  const replyCount = Math.round(
    interpolate(frame, [40, durationInFrames - 90], [0, 50], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const waveShift = (frame * 1.8) % 160;

  return (
    <AbsoluteFill style={{ backgroundColor: '#10203B' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="maritimeDusk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D1D38" />
            <stop offset="68%" stopColor="#1D4573" />
            <stop offset="100%" stopColor="#2B6194" />
          </linearGradient>
          <linearGradient id="lighthouseBeam" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#FFD166" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#FFD166" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'push')}>
          <rect width={1280} height={720} fill="url(#maritimeDusk)" />

          {/* Twinkling Night Stars */}
          {[
            [180, 90], [320, 62], [490, 110], [740, 74], [910, 98], [1120, 66], [620, 148],
          ].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={3} fill="#FFF4D6" opacity={0.45 + 0.5 * Math.sin(frame * 0.09 + i)} />
          ))}

          {/* Distant US & European Illuminated Office Skyline Across the Ocean (Right) */}
          <g transform="translate(880, 0)">
            <rect x={20} y={280} width={78} height={240} fill="#142B4D" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            <rect x={110} y={220} width={96} height={300} fill="#18345C" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            <rect x={220} y={260} width={88} height={260} fill="#142B4D" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            {/* Glowing golden office windows lighting up as replies land */}
            {[
              [38, 305], [64, 305], [38, 340], [130, 248], [164, 248], [130, 286],
              [164, 286], [130, 324], [240, 285], [272, 285], [240, 322],
            ].map(([wx, wy], wi) => {
              const lit = frame > 70 + wi * 38;
              return (
                <rect
                  key={wi}
                  x={wx}
                  y={wy}
                  width={18}
                  height={22}
                  rx={2}
                  fill={lit ? '#FFD166' : '#254A75'}
                />
              );
            })}
          </g>

          {/* Sweeping Lighthouse Searchlight Beam */}
          <g transform={`translate(240, 250) rotate(${beamAngle.toFixed(2)})`}>
            <polygon points="0,-16 980,-165 980,165 0,16" fill="url(#lighthouseBeam)" />
          </g>

          {/* Illustrated Striped Coastal Lighthouse on Rocky Cliff (Left) */}
          <g transform="translate(240, 520)">
            {/* Rocky island headland */}
            <path d="M -260 60 Q -140 -28 0 -18 Q 115 -14 170 60 Z" fill="#2A3E52" stroke={OUTLINE_COLOR} strokeWidth={4} />
            {/* Striped red & white tower */}
            <polygon points="-46,-18 -28,-248 28,-248 46,-18" fill="#FFFFFF" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
            <polygon points="-38,-96 -33,-160 33,-160 38,-96" fill="#E63946" stroke={OUTLINE_COLOR} strokeWidth={3} />
            <polygon points="-44,-22 -41,-62 41,-62 44,-22" fill="#E63946" stroke={OUTLINE_COLOR} strokeWidth={3} />
            {/* Lantern room */}
            <rect x={-32} y={-288} width={64} height={40} fill="#FFD166" stroke={OUTLINE_COLOR} strokeWidth={4} />
            <path d="M -38 -288 Q 0 -334 38 -288 Z" fill="#E63946" stroke={OUTLINE_COLOR} strokeWidth={4} />
          </g>

          {/* Fleet of Crisp Paper Airplanes Flying Smoothly Across the Sea Into Founder Skylines */}
          {[0, 1, 2, 3, 4].map((pi) => {
            const prog = ((frame * 0.0085) + pi * 0.2) % 1;
            const px = interpolate(prog, [0, 1], [290, 1090]);
            const py = interpolate(prog, [0, 0.5, 1], [310 + pi * 18, 215 + pi * 14, 275 + pi * 20]);
            return (
              <g key={pi} transform={`translate(${px.toFixed(1)}, ${py.toFixed(1)}) rotate(-6)`}>
                <polygon
                  points="-26,8 28,0 -22,-14 -12,0"
                  fill="#FFFFFF"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
                <line x1={-12} y1={0} x2={28} y2={0} stroke="#2AD08E" strokeWidth={2.5} />
              </g>
            );
          })}

          {/* Animated Rolling Deep Ocean Waves Foreground */}
          <g transform={`translate(${-waveShift}, 0)`}>
            <path
              d="M 0 545 Q 40 525 80 545 T 160 545 T 240 545 T 320 545 T 400 545 T 480 545 T 560 545 T 640 545 T 720 545 T 800 545 T 880 545 T 960 545 T 1040 545 T 1120 545 T 1200 545 T 1280 545 T 1360 545 T 1440 545 L 1440 720 L 0 720 Z"
              fill="#195282"
              stroke={OUTLINE_COLOR}
              strokeWidth={4}
            />
          </g>
          <g transform={`translate(${waveShift * 0.6 - 160}, 0)`}>
            <path
              d="M 0 585 Q 50 562 100 585 T 200 585 T 300 585 T 400 585 T 500 585 T 600 585 T 700 585 T 800 585 T 900 585 T 1000 585 T 1100 585 T 1200 585 T 1300 585 T 1400 585 T 1500 585 L 1500 720 L 0 720 Z"
              fill="#123D63"
              stroke={OUTLINE_COLOR}
              strokeWidth={4}
            />
          </g>

          <FloatingCallout
            x={640}
            y={114}
            text={`${replyCount} SMART REPLIES`}
            subtext="EVERY EVENING TO US & EU FOUNDERS"
            size={58}
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
// SCENE 08 · CRUMPLED BEGGING PAPER INTO TRASH -> GOLDEN ENVELOPE UNLOCKING VAULT DOOR
// ============================================================================
export const Scene08ColdDm: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crumpled paper flies in a parabolic arc straight into a metal trash can (frames 15..160)
  const tossP = interpolate(frame, [25, 130], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ballX = interpolate(tossP, [0, 1], [150, 320]);
  const ballY = interpolate(tossP, [0, 1], [230, 445]) - Math.sin(tossP * Math.PI) * 185;
  const ballRot = tossP * 420;

  // Golden Envelope glides in & Brass Key turns to swing open a heavy steel Vault Door!
  const envPop = spring({ frame: Math.max(0, frame - 210), fps, config: SPRING_POP });
  const keyFlight = interpolate(frame, [320, 420], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const vaultOpen = spring({ frame: Math.max(0, frame - 440), fps, config: SPRING_SMOOTH });
  const wheelSpin = interpolate(frame, [410, 470], [0, 210], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#EAF4FA' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="officeWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EBF3FA" />
            <stop offset="100%" stopColor="#CFE0EE" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'pan-left')}>
          <rect width={1280} height={720} fill="url(#officeWall)" />
          {/* Crisp Architectural Office Wainscot & Bank Vault Archway Molding */}
          <rect x={0} y={385} width={1280} height={153} fill="#D9E6F2" opacity={0.55} />
          <line x1={0} y1={385} x2={1280} y2={385} stroke="#AFC5D9" strokeWidth={4} />
          <rect x={832} y={214} width={356} height={324} rx={16} fill="#C2D5E6" stroke="#8CA6BF" strokeWidth={4} />
          <rect x={0} y={538} width={1280} height={182} fill="#B89B7A" stroke={OUTLINE_COLOR} strokeWidth={4} />
          <rect x={0} y={538} width={1280} height={16} fill="#D4B895" stroke={OUTLINE_COLOR} strokeWidth={3} />

          {/* LEFT: Metal Office Trash Can Swallowing Crumpled "Give Me a Job" Paper */}
          <g transform="translate(320, 538)">
            <ellipse cx={0} cy={12} rx={82} ry={14} fill="rgba(24,34,47,0.18)" />
            {/* Crumpled Paper Ball Arcing In */}
            {tossP < 0.96 && (
              <g transform={`translate(${(ballX - 320).toFixed(1)}, ${(ballY - 538).toFixed(1)}) rotate(${ballRot.toFixed(0)})`}>
                <polygon
                  points="-26,-10 -12,-28 16,-24 30,-4 20,24 -10,28 -28,12"
                  fill="#F1F5F9"
                  stroke={OUTLINE_COLOR}
                  strokeWidth={3.5}
                />
                <line x1={-12} y1={-8} x2={12} y2={8} stroke="#94A3B8" strokeWidth={2.5} />
              </g>
            )}
            {/* Metal Trash Bin Body */}
            <polygon points="-68,-148 68,-148 52,0 -52,0" fill="#64748B" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
            <line x1={-36} y1={-130} x2={-28} y2={-16} stroke="#475569" strokeWidth={5} strokeLinecap="round" />
            <line x1={0} y1={-130} x2={0} y2={-16} stroke="#475569" strokeWidth={5} strokeLinecap="round" />
            <line x1={36} y1={-130} x2={28} y2={-16} stroke="#475569" strokeWidth={5} strokeLinecap="round" />
            <rect x={-76} y={-162} width={152} height={18} rx={6} fill="#94A3B8" stroke={OUTLINE_COLOR} strokeWidth={4} />
          </g>

          <FloatingCallout
            x={320}
            y={235}
            text="NEVER BEG"
            size={42}
            fill="#E63946"
            delayFrames={25}
          />

          {/* CENTER-RIGHT: Gleaming Golden 60s Proof Envelope */}
          <g transform={`translate(660, 440) scale(${Math.max(0.001, envPop)})`}>
            <ellipse cx={0} cy={104} rx={110} ry={15} fill="rgba(24,34,47,0.18)" />
            <rect x={-105} y={-68} width={210} height={138} rx={10} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={4.5} />
            <polygon points="-105,-68 0,14 105,-68" fill="#FFD166" stroke={OUTLINE_COLOR} strokeWidth={4} />
            {/* Emerald Play Button Wax Seal (perfectly centered triangle) */}
            <circle cx={0} cy={12} r={26} fill="#1FB57A" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
            <polygon points="-7,-1 15,12 -7,25" fill="#FFFFFF" />
          </g>

          {/* Flying Brass Key Unlocking the Giant Vault Door */}
          {frame >= 320 && (
            <g
              transform={`translate(${interpolate(keyFlight, [0, 1], [660, 965]).toFixed(1)}, ${interpolate(keyFlight, [0, 0.5, 1], [375, 290, 390]).toFixed(1)})`}
            >
              <circle cx={-34} cy={0} r={18} fill="none" stroke="#F5B82E" strokeWidth={9} />
              <circle cx={-34} cy={0} r={18} fill="none" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <rect x={-16} y={-5} width={66} height={10} rx={3} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={3} />
              <rect x={28} y={5} width={8} height={14} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
              <rect x={42} y={5} width={8} height={18} fill="#F5B82E" stroke={OUTLINE_COLOR} strokeWidth={2.5} />
            </g>
          )}

          {/* RIGHT HERO: Heavy Steel Client Vault Door Swinging Open to Warm Daylight! */}
          <g transform="translate(1010, 392)">
            {/* Open golden daylight inside vault */}
            <circle r={146} fill="#FFF2B2" stroke={OUTLINE_COLOR} strokeWidth={6} />
            <circle r={108} fill="#FFD166" opacity={0.75} />
            <text
              x={0}
              y={14}
              textAnchor="middle"
              fontFamily={FONT_DISPLAY}
              fontWeight={900}
              fontSize={34}
              fill={OUTLINE_COLOR}
            >
              HIRED
            </text>
            {/* Steel vault door swinging open horizontally via scaleX */}
            <g transform={`translate(-146, 0) scale(${Math.max(0.14, 1 - vaultOpen * 0.86).toFixed(3)}, 1) translate(146, 0)`}>
              <circle r={146} fill="#4A5D70" stroke={OUTLINE_COLOR} strokeWidth={5.5} />
              <circle r={116} fill="#647A91" stroke={OUTLINE_COLOR} strokeWidth={3.5} />
              {/* Rotating brass vault wheel */}
              <g transform={`rotate(${wheelSpin.toFixed(1)})`}>
                <circle r={54} fill="none" stroke="#F5B82E" strokeWidth={12} />
                <circle r={54} fill="none" stroke={OUTLINE_COLOR} strokeWidth={3} />
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <line
                    key={a}
                    x1={0}
                    y1={0}
                    x2={Math.cos((a * Math.PI) / 180) * 52}
                    y2={Math.sin((a * Math.PI) / 180) * 52}
                    stroke="#F5B82E"
                    strokeWidth={8}
                  />
                ))}
                <circle r={16} fill="#18222F" />
              </g>
            </g>
          </g>
          <ImpactBurst x={1010} y={392} triggerFrame={440} color="#FFD166" radius={168} />

          <FloatingCallout
            x={640}
            y={104}
            text="SEND A 60-SECOND SAMPLE"
            subtext="LET PROOF UNLOCK THE DOOR"
            size={50}
            fill="#FFFFFF"
            delayFrames={215}
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
