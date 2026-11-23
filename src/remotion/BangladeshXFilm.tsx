import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
} from '@remotion/transitions';
import {
  AmbientAtmosphere,
  ChapterSliver,
  TRANSITION_FRAMES,
  getWorldPalette,
} from './theme';
import { BANGLADESH_X_TIMELINE } from './timingMath';
import {
  proDiagonalSweep,
  proIrisReveal,
  proLiquidWaveSweep,
  proShutterWipe,
  proWhipPan,
  proZoomThrough,
} from './proTransitions';
import {
  Scene01GlobalWindow,
  Scene02BiddingVsX,
  Scene03KillAdMyth,
  Scene04OneCraft,
  type WorldSceneProps,
} from './scenes/ActOneScenes';
import {
  Scene05ProfileStorefront,
  Scene06ProofEngine,
  Scene07SniperRadar,
  Scene08ColdDm,
} from './scenes/ActTwoScenes';
import {
  Scene09PaymentsBD,
  Scene10NinetyDayMath,
  Scene11EveningEngine,
  Scene12BengalCompassFinale,
} from './scenes/ActThreeScenes';

export interface BangladeshXFilmProps {
  paletteMode?: 'light' | 'dark' | 'mix';
  subtitlesEnabled?: boolean;
}

const SCENE_COMPONENTS: React.FC<WorldSceneProps>[] = [
  Scene01GlobalWindow,
  Scene02BiddingVsX,
  Scene03KillAdMyth,
  Scene04OneCraft,
  Scene05ProfileStorefront,
  Scene06ProofEngine,
  Scene07SniperRadar,
  Scene08ColdDm,
  Scene09PaymentsBD,
  Scene10NinetyDayMath,
  Scene11EveningEngine,
  Scene12BengalCompassFinale,
];

/**
 * Curated 6-Transition Pro-Editor Choreography — ZERO back-to-back repeats,
 * every single cut matched to the exit vector and mood of the two real-world scenes.
 */
function getProEditorTransition(index: number): TransitionPresentation<Record<string, unknown>> {
  const choreography: TransitionPresentation<Record<string, unknown>>[] = [
    // 01 (World Map) -> 02 (Industrial Pit): Coupled Documentary Zoom-Through with warm optical bloom
    proZoomThrough({ zoomIntensity: 0.28, bloomColor: 'rgba(255, 224, 150, 0.25)' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 02 (Sunlit Skyline) -> 03 (Studio Counter): AE Whip Pan Left with subtle velocity speedlines
    proWhipPan({ direction: 'left' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 03 (Cash Stacks) -> 04 (4 Workbenches Dolly): Dual-Ribbon Editorial Diagonal Sweep
    proDiagonalSweep({ accentColor: '#F5B82E', secondaryColor: '#18222F' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 04 (Typewriter) -> 05 (Diary / Storefront): Signature Infographics Show Inked Iris Reveal
    proIrisReveal({ originX: 50, originY: 52, ringColor: '#F5B82E' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 05 (Corner Storefront) -> 06 (Wall Calendar): Cinema Horizontal Shutter Wipe
    proShutterWipe({ axis: 'horizontal', accentColor: '#E85D4A' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 06 (Shipping Crates) -> 07 (Coastal Lighthouse): Liquid Horizon Wave rising into Ocean Dusk
    proLiquidWaveSweep({ waveColor: '#2AD08E' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 07 (Ocean Radar) -> 08 (Trash Can & Vault): Dual-Ribbon Diagonal Sweep
    proDiagonalSweep({ accentColor: '#2AD08E', secondaryColor: '#101824' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 08 (Open Gold Vault) -> 09 (Cargo Plane & Bridge): Inked Iris blooming straight from the open vault door
    proIrisReveal({ originX: 78, originY: 54, ringColor: '#FFD166' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 09 (Dhaka Bank) -> 10 (Mountain Staircase): Upward AE Camera Whip Pan climbing the peak
    proWhipPan({ direction: 'up' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 10 (Summit Beacon) -> 11 (Midnight Clock Study): Cinema Shutter Reveal into Midnight Study
    proShutterWipe({ axis: 'horizontal', accentColor: '#F5B82E' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 11 (Night Study) -> 12 (Golden Padma Sunrise): Golden Horizon Liquid Wave rising into Morning Sun
    proLiquidWaveSweep({ waveColor: '#FFD166' }) as unknown as TransitionPresentation<Record<string, unknown>>,
  ];

  return choreography[index % choreography.length];
}

const StaticEditorialFonts: React.FC = React.memo(() => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Montserrat:wght@700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
  `}</style>
));

/**
 * Full 60fps "Infographics Show Ultra" Real-World Scenario Remotion Composition.
 * Zero box templates. Zero human frames. 100% smooth pro-editor transitions + cinema atmosphere.
 */
export const BangladeshXFilm: React.FC<BangladeshXFilmProps> = ({
  paletteMode = 'mix',
  subtitlesEnabled = true,
}) => {
  const frame = useCurrentFrame();

  const { slots } = BANGLADESH_X_TIMELINE;

  // Determine whether current beat is warm or cool dusk for atmospheric lighting tint
  let activeSlotIdx = 0;
  for (let i = 0; i < slots.length; i++) {
    if (frame >= slots[i].globalStartFrame) activeSlotIdx = i;
  }
  const activeBeat = slots[activeSlotIdx]?.beat;
  const isWarmScene = activeBeat?.worldId !== 'coastal-dusk';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#18222F',
        overflow: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <StaticEditorialFonts />

      <TransitionSeries>
        {slots.map((slot, index) => {
          const SceneComp = SCENE_COMPONENTS[index];
          const palette = getWorldPalette(slot.beat.worldId, paletteMode);

          return (
            <React.Fragment key={slot.beat.id}>
              <TransitionSeries.Sequence durationInFrames={slot.sequenceDurationInFrames}>
                <SceneComp
                  beat={slot.beat}
                  palette={palette}
                  durationInFrames={slot.contentDurationInFrames}
                  subtitlesEnabled={subtitlesEnabled}
                />
                <ChapterSliver chapter={slot.beat.chapter} />
              </TransitionSeries.Sequence>

              {slot.hasFollowingTransition && (
                <TransitionSeries.Transition
                  presentation={getProEditorTransition(index)}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {/* Lightweight subtle studio framing light */}
      <AmbientAtmosphere frame={frame} warm={isWarmScene} />
    </AbsoluteFill>
  );
};
