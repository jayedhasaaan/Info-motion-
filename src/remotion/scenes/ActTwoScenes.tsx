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
  getImpactShake,
} from '../theme';
import type { WorldSceneProps } from './ActOneScenes';

// ============================================================================
// SCENE 05 · LEATHER DIARY -> SUNLIT ARCHITECTURAL CITY AVENUE & CORNER STOREFRONT (v6.0)
// ============================================================================
export const Scene05ProfileStorefront: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const irisP = interpolate(frame, [162, 228], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const diaryShake = frame > 95 && frame < 155 ? Math.sin(frame * 1.4) * 5 : 0;
  const awningUnfurl = spring({ frame: Math.max(0, frame - 218), fps, config: SPRING_POP });
  const signPop = spring({ frame: Math.max(0, frame - 255), fps, config: SPRING_POP });
  const trophyPop = spring({ frame: Math.max(0, frame - 320), fps, config: SPRING_POP });
  const shimmerX = ((frame * 4.5) % 480) - 120;

  return (
    <AbsoluteFill style={{ backgroundColor: '#241D1A' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="avenueSky6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B6EC2" />
            <stop offset="62%" stopColor="#6DC4F2" />
            <stop offset="100%" stopColor="#D6F2FF" />
          </linearGradient>
          <clipPath id="storefrontIris6">
            <circle cx={640} cy={380} r={irisP * 920} />
          </clipPath>
          <clipPath id="shopGlassClip6">
            <rect x={436} y={338} width={264} height={184} rx={4} />
          </clipPath>
        </defs>

        {/* ===== PART 5A: DUSTY CLOSED PERSONAL DIARY ON DARK WALNUT STUDY TABLE ===== */}
        {irisP < 0.99 && (
          <g>
            <rect width={1280} height={720} fill="#26201D" />
            <polygon points="340,0 940,0 1120,720 160,720" fill="#FFE6B8" opacity={0.07} />
            <rect x={0} y={502} width={1280} height={218} fill="#4D372B" />
            <rect x={0} y={502} width={1280} height={14} fill="#6B4F3E" />

            <g transform={`translate(${640 + diaryShake}, 394) rotate(-5)`}>
              {/* 45-degree cast shadow */}
              <polygon points="-112,126 124,126 168,154 -72,154" fill="rgba(10,8,6,0.38)" />
              {/* Closed Split-Shaded Leather Journal */}
              <rect x={-122} y={-126} width={244} height={252} rx={12} fill="#7A4837" />
              <rect x={0} y={-126} width={122} height={252} rx={10} fill="#63382A" />
              <rect x={-122} y={-126} width={34} height={252} rx={6} fill="#4D291E" />
              {/* Brass Clasp */}
              <rect x={94} y={-18} width={38} height={36} rx={4} fill="#D99B26" />
              <rect x={108} y={-18} width={24} height={36} rx={3} fill="#B87E18" />
              <text x={14} y={10} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={36} fill="#EFE2CE" letterSpacing="0.14em">
                DIARY
              </text>
              {frame > 95 && (
                <g opacity={0.95}>
                  <line x1={-114} y1={-106} x2={114} y2={106} stroke="#E63946" strokeWidth={18} strokeLinecap="round" />
                  <line x1={114} y1={-106} x2={-114} y2={106} stroke="#E63946" strokeWidth={18} strokeLinecap="round" />
                </g>
              )}
            </g>

            <FloatingCallout
              x={640}
              y={114}
              text="NOT A PERSONAL DIARY"
              subtext="STOP POSTING RANDOM THOUGHTS"
              size={56}
              fill="#FF6B6B"
              accent="#FFD166"
              delayFrames={10}
            />
          </g>
        )}

        {/* ===== PART 5B: RICH SUNLIT ARCHITECTURAL CITY AVENUE & FLAGSHIP STOREFRONT ===== */}
        {irisP > 0.005 && (
          <g clipPath="url(#storefrontIris6)">
            <g transform={getCameraTransform(Math.max(0, frame - 180), durationInFrames - 180, 'push')}>
              <rect width={1280} height={720} fill="url(#avenueSky6)" />
              <DriftingClouds frame={frame} tint="#FFFFFF" shadeTint="#B3DCF2" opacity={0.94} speed={0.44} />

              {/* Plane 1: Distant Soft Atmospheric City Skyline */}
              <path
                d="M 0 558 L 0 385 L 95 385 L 95 320 L 210 320 L 210 368 L 320 368 L 320 296 L 440 296 L 440 420 L 840 420 L 840 310 L 965 310 L 965 352 L 1090 352 L 1090 290 L 1200 290 L 1200 375 L 1280 375 L 1280 558 Z"
                fill="#7EC0E4"
                opacity={0.62}
              />

              {/* Plane 2: Richly Split-Shaded Flanking European Brownstones (NO ugly boxes!) */}
              <SplitBuilding x={24} y={248} w={184} h={310} litColor="#D89B74" shadeColor="#B87A54" windowColor="#284B6E" litWindowColor="#CBEBFF" frame={frame} />
              <SplitBuilding x={1072} y={224} w={186} h={334} litColor="#7AA5C4" shadeColor="#5C87A8" windowColor="#23415E" litWindowColor="#CBEBFF" frame={frame} />

              {/* Crisp Sunlit Limestone Sidewalk + Asphalt Avenue + Crosswalk */}
              <rect x={0} y={558} width={1280} height={42} fill="#E4E9F0" />
              <rect x={0} y={594} width={1280} height={6} fill="#B8C3D1" />
              <rect x={0} y={600} width={1280} height={120} fill="#364152" />
              <line x1={0} y1={658} x2={1280} y2={658} stroke="#F5B82E" strokeWidth={6} strokeDasharray="52 36" />

              {/* Building Cast Shadows Across Sidewalk */}
              <polygon points="338,558 942,558 986,594 374,594" fill="rgba(16,28,44,0.16)" />

              {/* Layered Organic Botanical Avenue Trees (Lineless Split-Shaded!) */}
              {[228, 1052].map((tx, idx) => (
                <g key={idx} transform={`translate(${tx}, 558)`}>
                  <ellipse cx={16} cy={4} rx={48} ry={9} fill="rgba(16,28,44,0.18)" />
                  <rect x={-10} y={-92} width={12} height={92} fill="#7B4F34" />
                  <rect x={2} y={-92} width={8} height={92} fill="#5C3924" />
                  {/* Layered lush canopy clusters */}
                  <circle cx={-30} cy={-114} r={34} fill="#26A669" />
                  <circle cx={30} cy={-112} r={34} fill="#187A4E" />
                  <circle cx={0} cy={-144} r={48} fill="#2ECC71" />
                  <path d="M 0 -192 A 48 48 0 0 1 48 -144 A 48 48 0 0 1 0 -96 Z" fill="#1E9E5E" />
                </g>
              ))}

              {/* HERO CENTER: FLAGSHIP ARCHITECTURAL CORNER STOREFRONT */}
              <g transform="translate(640, 558)">
                {/* Main Warm Limestone Facade + 3D Shaded Right Wall Return */}
                <rect x={-304} y={-354} width={572} height={354} rx={4} fill="#F5EFE6" />
                <rect x={268} y={-354} width={44} height={354} fill="#DFD4C4" />
                {/* Subtle Architectural Pilasters & Masonry Courses */}
                <rect x={-304} y={-354} width={34} height={354} fill="#EAE0D1" />
                <rect x={234} y={-354} width={34} height={354} fill="#EAE0D1" />
                <rect x={-304} y={-28} width={616} height={28} fill="#D5C9B8" />
                {/* Architectural Slate Cornice Roof */}
                <rect x={-322} y={-384} width={644} height={34} rx={4} fill="#1E2D40" />
                <rect x={-322} y={-384} width={644} height={8} rx={3} fill="#364C68" />
                <rect x={-304} y={-350} width={616} height={8} fill="rgba(15,23,42,0.12)" />

                {/* Top Marquee Signboard (Bio Positioning!) */}
                <g transform={`scale(${Math.max(0.001, signPop)})`}>
                  <rect x={-246} y={-330} width={492} height={64} rx={6} fill="#0F172A" />
                  <rect x={-246} y={-330} width={492} height={5} fill="#F5B82E" />
                  <text x={0} y={-288} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={30} fill="#FFD166" letterSpacing="0.12em">
                    GLOBAL STUDIO STOREFRONT
                  </text>
                </g>

                {/* Deep Showcase Display Window + Golden Proof Trophy */}
                <rect x={-204} y={-220} width={264} height={184} rx={4} fill="#1E3A5F" />
                <rect x={-194} y={-210} width={244} height={164} rx={2} fill="#CBEBFF" />
                {/* Subtle interior spotlight inside window */}
                <polygon points="-140,-210 -4,-210 38,-46 -184,-46" fill="#FFFFFF" opacity={0.34} />
                <g clipPath="url(#shopGlassClip6)" transform="translate(-640, -558)">
                  <polygon points={`${445 + shimmerX},338 ${495 + shimmerX},338 ${435 + shimmerX},522 ${385 + shimmerX},522`} fill="#FFFFFF" opacity={0.48} />
                </g>
                {/* Split-Shaded Golden Case-Study Trophy Inside Window */}
                <g transform={`translate(-72, -82) scale(${Math.max(0.001, trophyPop)})`}>
                  <rect x={-52} y={14} width={104} height={24} fill="#7B4F34" />
                  <rect x={0} y={14} width={52} height={24} fill="#5C3924" />
                  <path d="M -30 -56 L 30 -56 L 20 -10 Q 0 10 -20 -10 Z" fill="#F5B82E" />
                  <path d="M 0 -56 L 30 -56 L 20 -10 Q 0 10 0 -10 Z" fill="#D4951C" />
                  <rect x={-9} y={-8} width={18} height={22} fill="#C48515" />
                  <rect x={-24} y={8} width={48} height={10} rx={2} fill="#F5B82E" />
                </g>

                {/* Boutique Emerald Entry Door + Swinging OPEN Sign */}
                <rect x={92} y={-220} width={136} height={220} rx={4} fill="#146E4E" />
                <rect x={160} y={-220} width={68} height={220} rx={2} fill="#0F573D" />
                <rect x={110} y={-200} width={100} height={112} rx={3} fill="#A7E3F5" />
                <polygon points="110,-200 176,-200 132,-88 110,-88" fill="#FFFFFF" opacity={0.35} />
                <circle cx={210} cy={-64} r={6.5} fill="#FFD166" />
                <g transform={`translate(160, -144) rotate(${Math.sin(frame * 0.08) * 3})`}>
                  <rect x={-42} y={-18} width={84} height={36} rx={4} fill="#E03E47" />
                  <text x={0} y={8} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={24} fill="#FFFFFF" letterSpacing="0.08em">
                    OPEN
                  </text>
                </g>

                {/* Cast Shadow Underneath Awning */}
                <rect x={-278} y={-204} width={544} height={14} fill="rgba(15,23,42,0.18)" />

                {/* Classic Split-Shaded Striped Boutique Awning Unfurling */}
                <g transform={`translate(0, -248) scale(1, ${Math.max(0.001, awningUnfurl)})`}>
                  {[-272, -212, -152, -92, -32, 28, 88, 148, 208].map((ax, ai) => (
                    <g key={ai}>
                      <path
                        d={`M ${ax} 0 L ${ax + 60} 0 L ${ax + 60} 44 Q ${ax + 30} 58 ${ax} 44 Z`}
                        fill={ai % 2 === 0 ? '#E05344' : '#FFFDF8'}
                      />
                      <path
                        d={`M ${ax} 36 L ${ax + 60} 36 L ${ax + 60} 44 Q ${ax + 30} 58 ${ax} 44 Z`}
                        fill={ai % 2 === 0 ? '#B83C30' : '#E8E0D2'}
                      />
                    </g>
                  ))}
                </g>
              </g>

              {/* Crisp Infographics Show Leader-Line Callout Pointing to Pinned Proof Trophy */}
              <LeaderCallout
                targetX={568}
                targetY={436}
                elbowX={318}
                elbowY={210}
                endX={110}
                label="PINNED PROOF"
                sublabel="VISIBLE CASE STUDY"
                accent="#FFD166"
                delayFrames={328}
              />

              <FloatingCallout
                x={640}
                y={92}
                text="YOUR GLOBAL STOREFRONT"
                subtext="BIO POSITIONING · CLEAN BANNER · PINNED PROOF"
                size={52}
                fill="#FFFFFF"
                accent="#FFD166"
                delayFrames={230}
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
// SCENE 06 · 30-DAY PRODUCTION CALENDAR & 3D ISOMETRIC SHIPPING CRATES (v6.0)
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
    Math.max(1, Math.round(interpolate(frame, [26, durationInFrames - 75], [1, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))
  );

  const pageCycle = (frame % 24) / 24;
  const tornX = interpolate(pageCycle, [0, 1], [0, 275]);
  const tornY = interpolate(pageCycle, [0, 1], [0, 225]) - Math.sin(pageCycle * Math.PI) * 95;
  const tornRot = interpolate(pageCycle, [0, 1], [0, 52]);
  const tornOp = interpolate(pageCycle, [0, 0.72, 1], [1, 0.9, 0]);

  const crate1 = spring({ frame: Math.max(0, frame - 85), fps, config: SPRING_POP });
  const crate2 = spring({ frame: Math.max(0, frame - 200), fps, config: SPRING_POP });
  const crate3 = spring({ frame: Math.max(0, frame - 325), fps, config: SPRING_POP });

  // Authentic Split-Shaded 3D Wooden Shipping Crate (NO cartoon outlines!)
  const renderIsometricCrate = (x: number, y: number, label: string, pop: number) => (
    <g transform={`translate(${x}, ${y}) scale(${Math.max(0.001, pop)})`}>
      {/* 45-degree Floor Shadow */}
      <polygon points="-98,64 102,64 132,84 -68,84" fill="rgba(18,28,42,0.20)" />
      {/* Top 3D Extruded Plank Face */}
      <polygon points="-98,-64 -76,-80 116,-80 94,-64" fill="#EBB671" />
      {/* Right 3D Shaded Side Face */}
      <polygon points="94,-64 116,-80 116,48 94,64" fill="#A66D2E" />
      {/* Front Timber Frame & Diagonal Bracing */}
      <rect x={-98} y={-64} width={192} height={128} fill="#D4954C" />
      <rect x={-82} y={-48} width={160} height={96} fill="#BD7E37" />
      <line x1={-82} y1={-48} x2={78} y2={48} stroke="#A16728" strokeWidth={14} />
      <line x1={-82} y1={-16} x2={78} y2={-16} stroke="#A16728" strokeWidth={2.5} opacity={0.6} />
      <line x1={-82} y1={16} x2={78} y2={16} stroke="#A16728" strokeWidth={2.5} opacity={0.6} />
      {/* Crisp Editorial Crimson Stencil Stamp directly on Crate */}
      <g transform="rotate(-6)">
        <rect x={-72} y={-20} width={144} height={40} rx={3} fill="#FAF4E8" />
        <rect x={-68} y={-16} width={136} height={32} rx={2} fill="none" stroke="#C82834" strokeWidth={2.5} />
        <text x={0} y={8} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={23} fill="#C82834" letterSpacing="0.06em">
          {label}
        </text>
      </g>
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#EFE6D8' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="studioLoftWall6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7F0E4" />
            <stop offset="100%" stopColor="#E3D5BF" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'pan-right')}>
          <rect width={1280} height={720} fill="url(#studioLoftWall6)" />

          {/* Architectural High Loft Skylight Windows & Diagonal Daylight Shafts */}
          <polygon points="88,0 264,0 520,546 210,546" fill="#FFFFFF" opacity={0.28} />
          <polygon points="940,0 1130,0 1280,546 1040,546" fill="#FFFFFF" opacity={0.22} />
          {/* Subtle Architectural Wall Brick Accents */}
          {[
            [74, 152], [134, 152], [104, 180], [648, 224], [708, 224], [1082, 168], [1142, 168],
          ].map(([bx, by], i) => (
            <rect key={i} x={bx} y={by} width={52} height={20} rx={2} fill="#DAC8AE" opacity={0.65} />
          ))}

          {/* Poured Concrete Studio Floor */}
          <rect x={0} y={546} width={1280} height={174} fill="#7B8B9C" />
          <rect x={0} y={546} width={1280} height={14} fill="#9AA9B8" />
          <rect x={0} y={560} width={1280} height={4} fill="#5C6C7D" opacity={0.45} />

          {/* LEFT HERO: GIANT SPLIT-SHADED WALL TEAR-OFF PRODUCTION CALENDAR */}
          <g transform="translate(352, 344)">
            <rect x={-124} y={-136} width={276} height={306} rx={12} fill="rgba(18,28,42,0.16)" />
            <rect x={-138} y={-152} width={276} height={304} rx={12} fill="#FFFFFF" />
            <rect x={112} y={-152} width={26} height={304} rx={6} fill="#EDF2F7" />
            {/* Crimson Header Binder */}
            <path d="M -138 -140 Q -138 -152 -126 -152 L 126 -152 Q 138 -152 138 -140 L 138 -72 L -138 -72 Z" fill="#D93842" />
            <path d="M 0 -152 L 126 -152 Q 138 -152 138 -140 L 138 -72 L 0 -72 Z" fill="#BD2A34" />
            {/* Brass Mounting Rings */}
            <circle cx={-74} cy={-112} r={11} fill="#F5B82E" />
            <circle cx={-74} cy={-112} r={5} fill="#8C5914" />
            <circle cx={74} cy={-112} r={11} fill="#F5B82E" />
            <circle cx={74} cy={-112} r={5} fill="#8C5914" />
            <text x={0} y={-100} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={28} fill="#FFFFFF" letterSpacing="0.14em">
              DAY
            </text>
            {/* Big Bold Day Number */}
            <text x={0} y={84} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={164} fill="#0F172A">
              {String(dayNum).padStart(2, '0')}
            </text>

            {/* Animated Torn Page Ripping Off & Fluttering */}
            {dayNum < 30 && (
              <g transform={`translate(${tornX.toFixed(1)}, ${tornY.toFixed(1)}) rotate(${tornRot.toFixed(1)})`} opacity={tornOp}>
                <rect x={-122} y={-68} width={244} height={212} rx={6} fill="#FFFDF8" />
                <text x={0} y={76} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={132} fill="#94A3B8">
                  {String(Math.max(1, dayNum - 1)).padStart(2, '0')}
                </text>
              </g>
            )}
          </g>

          {/* RIGHT HERO: 3D ISOMETRIC SHIPPING CRATES STACKED ON WOOD PALLET */}
          <rect x={718} y={534} width={452} height={18} rx={2} fill="#7B4F34" />
          {renderIsometricCrate(838, 472, 'TEARDOWN', crate1)}
          {renderIsometricCrate(1048, 472, 'REDESIGN', crate2)}
          {renderIsometricCrate(944, 340, '30S CLIP', crate3)}

          <FloatingCallout
            x={640}
            y={92}
            text="30 DAYS OF PUBLIC PROOF"
            subtext="SHIP REAL WORK EVERY SINGLE DAY"
            size={54}
            fill="#142033"
            accent="#D93842"
            delayFrames={10}
            darkBackdrop={false}
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
// SCENE 07 · COASTAL MARITIME LIGHTHOUSE & RADAR LAUNCHING 50 SMART REPLIES (v6.0)
// ============================================================================
export const Scene07SniperRadar: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();

  const beamAngle = -24 + Math.sin(frame * 0.042) * 16;
  const replyCount = Math.round(
    interpolate(frame, [35, durationInFrames - 85], [0, 50], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const waveShift = (frame * 1.8) % 160;
  const radarR = (frame * 2.8) % 340;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A162B' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="oceanNight6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#081224" />
            <stop offset="56%" stopColor="#133159" />
            <stop offset="100%" stopColor="#1E4D80" />
          </linearGradient>
          <linearGradient id="searchBeam6" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#FFD166" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#FFD166" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FFD166" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={getCameraTransform(frame, durationInFrames, 'push')}>
          <rect width={1280} height={720} fill="url(#oceanNight6)" />

          {/* Glowing Crescent Moon & Starfield */}
          <circle cx={1082} cy={104} r={58} fill="#FFE8A3" opacity={0.10} />
          <path d="M 1076 74 A 28 28 0 1 0 1106 116 A 22 22 0 1 1 1076 74 Z" fill="#FFF2C2" />
          {[
            [154, 86], [286, 58], [452, 108], [662, 68], [842, 92], [964, 64], [548, 152], [768, 142],
          ].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={i % 2 === 0 ? 2.6 : 1.8} fill="#FFF4D6" opacity={0.45 + 0.5 * Math.sin(frame * 0.08 + i)} />
          ))}

          {/* Distant US & EU Financial Metropolis Across the Bay (Lineless Split-Shaded!) */}
          <path
            d="M 780 545 L 780 390 L 845 390 L 845 335 L 920 335 L 920 375 L 1010 375 L 1010 300 L 1110 300 L 1110 365 L 1280 365 L 1280 545 Z"
            fill="#122C4E"
            opacity={0.7}
          />
          <SplitBuilding x={844} y={292} w={92} h={250} litColor="#183862" shadeColor="#0E2442" windowColor="#254C7D" litWindowColor="#FFD166" frame={frame} litThreshold={50} />
          <SplitBuilding x={952} y={214} w={118} h={328} litColor="#1D4273" shadeColor="#112A4C" windowColor="#28538A" litWindowColor="#FFD166" frame={frame} litThreshold={80} spire />
          <SplitBuilding x={1088} y={258} w={104} h={284} litColor="#183862" shadeColor="#0E2442" windowColor="#254C7D" litWindowColor="#2AD08E" frame={frame} litThreshold={120} />

          {/* Sweeping Volumetric Lighthouse Searchlight Beam */}
          <g transform={`translate(232, 248) rotate(${beamAngle.toFixed(2)})`}>
            <polygon points="0,-16 1020,-175 1020,175 0,16" fill="url(#searchBeam6)" />
          </g>

          {/* Expanding Emerald Radar Pulse Ring Around Lighthouse Beacon */}
          <g transform="translate(232, 248)">
            <circle r={radarR} fill="none" stroke="#2AD08E" strokeWidth={2.5} opacity={Math.max(0, 1 - radarR / 340) * 0.48} />
            <circle r={(radarR + 170) % 340} fill="none" stroke="#2AD08E" strokeWidth={2} opacity={Math.max(0, 1 - ((radarR + 170) % 340) / 340) * 0.4} />
          </g>

          {/* HERO LEFT: LINELESS SPLIT-SHADED COASTAL LIGHTHOUSE ON LAYERED BASALT CLIFF */}
          <g transform="translate(232, 526)">
            {/* Layered Rocky Headland */}
            <path d="M -260 60 Q -150 -36 0 -22 Q 112 -18 182 60 Z" fill="#1F3247" />
            <path d="M 0 -22 Q 112 -18 182 60 L 0 60 Z" fill="#132130" />
            {/* Tapered Striped Tower (Split Lit Left / Shaded Right!) */}
            <polygon points="-46,-20 -28,-254 28,-254 46,-20" fill="#F8FAFC" />
            <polygon points="0,-254 28,-254 46,-20 0,-20" fill="#CBD5E1" />
            {/* Red Maritime Stripes */}
            <polygon points="-38,-102 -32,-166 32,-166 38,-102" fill="#E63946" />
            <polygon points="0,-166 32,-166 38,-102 0,-102" fill="#BA2633" />
            <polygon points="-44,-24 -40,-66 40,-66 44,-24" fill="#E63946" />
            <polygon points="0,-66 40,-66 44,-24 0,-24" fill="#BA2633" />
            {/* Gallery Deck & Glowing Lantern Room */}
            <rect x={-38} y={-258} width={76} height={10} rx={3} fill="#1E293B" />
            <rect x={-28} y={-298} width={56} height={40} fill="#FFD166" />
            <circle cx={0} cy={-278} r={42} fill="#FFD166" opacity={0.28} />
            <path d="M -36 -298 Q 0 -342 36 -298 Z" fill="#E63946" />
            <path d="M 0 -342 Q 20 -320 36 -298 L 0 -298 Z" fill="#BA2633" />
          </g>

          {/* Fleet of Crisp Paper Planes with Dashed Contrails Soaring Across the Bay */}
          {[0, 1, 2, 3, 4].map((pi) => {
            const prog = ((frame * 0.0085) + pi * 0.2) % 1;
            const px = interpolate(prog, [0, 1], [278, 1086]);
            const py = interpolate(prog, [0, 0.5, 1], [312 + pi * 18, 208 + pi * 14, 274 + pi * 20]);
            return (
              <g key={pi} transform={`translate(${px.toFixed(1)}, ${py.toFixed(1)}) rotate(-6)`}>
                <line x1={-76} y1={2} x2={-28} y2={2} stroke="#2AD08E" strokeWidth={2.2} strokeDasharray="8 6" opacity={0.55} />
                <polygon points="-26,8 28,0 -22,-14 -12,0" fill="#FFFFFF" />
                <polygon points="-12,0 28,0 -26,8" fill="#CBD5E1" />
                <line x1={-12} y1={0} x2={28} y2={0} stroke="#2AD08E" strokeWidth={2.5} />
              </g>
            );
          })}

          {/* Multi-Plane Rolling Deep Ocean Parallax Waves (Lineless!) */}
          <g transform={`translate(${-waveShift}, 0)`}>
            <path
              d="M 0 546 Q 40 526 80 546 T 160 546 T 240 546 T 320 546 T 400 546 T 480 546 T 560 546 T 640 546 T 720 546 T 800 546 T 880 546 T 960 546 T 1040 546 T 1120 546 T 1200 546 T 1280 546 T 1360 546 T 1440 546 L 1440 720 L 0 720 Z"
              fill="#154773"
            />
          </g>
          <g transform={`translate(${waveShift * 0.65 - 160}, 0)`}>
            <path
              d="M 0 584 Q 50 562 100 584 T 200 584 T 300 584 T 400 584 T 500 584 T 600 584 T 700 584 T 800 584 T 900 584 T 1000 584 T 1100 584 T 1200 584 T 1300 584 T 1400 584 T 1500 584 L 1500 720 L 0 720 Z"
              fill="#0E3354"
            />
          </g>

          <FloatingCallout
            x={640}
            y={104}
            text={`${replyCount} SMART REPLIES`}
            subtext="EVERY EVENING TO US & EU FOUNDERS"
            size={60}
            fill="#FFD166"
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
// SCENE 08 · EXECUTIVE MARBLE VAULT CORRIDOR: NEVER BEG -> 60S PROOF UNLOCKS VAULT (v6.0)
// ============================================================================
export const Scene08ColdDm: React.FC<WorldSceneProps> = ({
  beat,
  durationInFrames,
  subtitlesEnabled,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tossP = interpolate(frame, [24, 128], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ballX = interpolate(tossP, [0, 1], [148, 314]);
  const ballY = interpolate(tossP, [0, 1], [228, 444]) - Math.sin(tossP * Math.PI) * 185;
  const ballRot = tossP * 420;

  const envPop = spring({ frame: Math.max(0, frame - 205), fps, config: SPRING_POP });
  const keyFlight = interpolate(frame, [315, 415], [0, 1], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const vaultOpen = spring({ frame: Math.max(0, frame - 438), fps, config: SPRING_SMOOTH });
  const wheelSpin = interpolate(frame, [406, 468], [0, 210], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shake = getImpactShake(frame, 438, 8);

  return (
    <AbsoluteFill style={{ backgroundColor: '#DCE8F2' }}>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="marbleWall6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EFF5FA" />
            <stop offset="100%" stopColor="#C9D9E8" />
          </linearGradient>
          <linearGradient id="vaultSpill6" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#FFD166" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFD166" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`translate(${shake.x.toFixed(1)}, ${shake.y.toFixed(1)})`}>
          <g transform={getCameraTransform(frame, durationInFrames, 'pan-left')}>
            <rect width={1280} height={720} fill="url(#marbleWall6)" />

            {/* Architectural Marble Wall Paneling & Brass Chair Rail */}
            <rect x={0} y={386} width={1280} height={152} fill="#D5E3F0" />
            <rect x={0} y={382} width={1280} height={8} fill="#B3C6D9" />
            <rect x={828} y={208} width={364} height={330} rx={18} fill="#BBD0E3" />
            <rect x={844} y={224} width={332} height={314} rx={12} fill="#9FB8CE" />

            {/* Polished Oak Floor */}
            <rect x={0} y={538} width={1280} height={182} fill="#A6825D" />
            <rect x={0} y={538} width={1280} height={14} fill="#C7A47E" />

            {/* Golden Light Spill Onto Floor When Vault Swings Open */}
            {vaultOpen > 0.05 && (
              <polygon
                points="900,538 1120,538 1220,720 790,720"
                fill="url(#vaultSpill6)"
                opacity={vaultOpen}
              />
            )}

            {/* LEFT: BRUSHED-STEEL WASTEBASKET SWALLOWING BEGGING NOTE */}
            <g transform="translate(314, 538)">
              <polygon points="-58,0 64,0 96,24 -30,24" fill="rgba(16,28,44,0.18)" />
              {tossP < 0.96 && (
                <g transform={`translate(${(ballX - 314).toFixed(1)}, ${(ballY - 538).toFixed(1)}) rotate(${ballRot.toFixed(0)})`}>
                  <polygon points="-24,-10 -12,-26 16,-22 28,-4 18,22 -10,26 -26,12" fill="#FFFFFF" />
                  <polygon points="0,-22 28,-4 18,22 -4,10" fill="#CBD5E1" />
                </g>
              )}
              <polygon points="-68,-148 68,-148 52,0 -52,0" fill="#64748B" />
              <polygon points="0,-148 68,-148 52,0 0,0" fill="#475569" />
              <rect x={-76} y={-162} width={152} height={16} rx={5} fill="#94A3B8" />
              <rect x={0} y={-162} width={76} height={16} rx={4} fill="#64748B" />
            </g>

            <FloatingCallout
              x={314}
              y={222}
              text="NEVER BEG"
              size={44}
              fill="#C82834"
              accent="#64748B"
              delayFrames={22}
              darkBackdrop={false}
            />

            {/* CENTER: SPLIT-SHADED GOLD 60-SECOND PROOF ENVELOPE */}
            <g transform={`translate(656, 442) scale(${Math.max(0.001, envPop)})`}>
              <polygon points="-104,70 108,70 142,92 -72,92" fill="rgba(16,28,44,0.18)" />
              <rect x={-106} y={-68} width={212} height={138} rx={8} fill="#F5B82E" />
              <polygon points="0,14 106,-68 106,70 -106,70" fill="#E0A11D" opacity={0.45} />
              <polygon points="-106,-68 0,16 106,-68" fill="#FFD970" />
              {/* Centered Emerald Play Wax Seal */}
              <circle cx={0} cy={14} r={27} fill="#169C68" />
              <circle cx={0} cy={14} r={22} fill="#1FB57A" />
              <polygon points="-7,2 15,14 -7,26" fill="#FFFFFF" />
            </g>

            {/* Flying Brass Master Key */}
            {frame >= 315 && (
              <g transform={`translate(${interpolate(keyFlight, [0, 1], [656, 960]).toFixed(1)}, ${interpolate(keyFlight, [0, 0.5, 1], [372, 286, 392]).toFixed(1)})`}>
                <circle cx={-34} cy={0} r={18} fill="none" stroke="#D99B26" strokeWidth={10} />
                <circle cx={-34} cy={0} r={18} fill="none" stroke="#FFD166" strokeWidth={4} />
                <rect x={-16} y={-5} width={68} height={10} rx={3} fill="#F5B82E" />
                <rect x={28} y={5} width={8} height={14} fill="#D99B26" />
                <rect x={42} y={5} width={8} height={18} fill="#D99B26" />
              </g>
            )}

            {/* RIGHT HERO: HEAVY BRUSHED-STEEL CLIENT BANK VAULT SWINGING OPEN */}
            <g transform="translate(1010, 392)">
              {/* Open Warm Golden Vault Interior */}
              <circle r={150} fill="#334155" />
              <circle r={136} fill="#FFF2B2" />
              <circle r={104} fill="#FFD166" opacity={0.82} />
              <text x={0} y={14} textAnchor="middle" fontFamily={FONT_CONDENSED} fontWeight={800} fontSize={44} fill="#142033" letterSpacing="0.08em">
                HIRED
              </text>
              {/* Steel Vault Door Swinging Open in Perspective */}
              <g transform={`translate(-148, 0) scale(${Math.max(0.14, 1 - vaultOpen * 0.86).toFixed(3)}, 1) translate(148, 0)`}>
                <circle r={146} fill="#475569" />
                <path d="M 0 -146 A 146 146 0 0 1 0 146 Z" fill="#334155" />
                <circle r={116} fill="#64748B" />
                <path d="M 0 -116 A 116 116 0 0 1 0 116 Z" fill="#475569" />
                {/* Rotating Brass Vault Wheel */}
                <g transform={`rotate(${wheelSpin.toFixed(1)})`}>
                  <circle r={54} fill="none" stroke="#F5B82E" strokeWidth={12} />
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
                  <circle r={16} fill="#1E293B" />
                </g>
              </g>
            </g>
            <ImpactBurst x={1010} y={392} triggerFrame={438} color="#FFD166" secondaryColor="#2AD08E" radius={172} />

            <FloatingCallout
              x={640}
              y={96}
              text="SEND A 60-SECOND SAMPLE"
              subtext="LET REAL PROOF UNLOCK THE VAULT"
              size={54}
              fill="#142033"
              accent="#1FB57A"
              delayFrames={210}
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
