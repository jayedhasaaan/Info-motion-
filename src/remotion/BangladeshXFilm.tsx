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
  proCloudFlythroughTransition,
  proDiagonalSweep,
  proIrisReveal,
  proLiquidWaveSweep,
  proMatchCutMorph,
  proShutterWipe,
  proWhipPan,
  proZoomThrough,
} from './proTransitions';
import { TactileDocumentaryCompositor } from './aeMotionPrimitives';
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
 * Curated 8-Transition After Effects 2D+3D Choreography — ZERO back-to-back repeats,
 * featuring 3D volumetric cloud fly-throughs, rotational match-cut morphs, and speed-ramped whip pans.
 */
function getProEditorTransition(index: number): TransitionPresentation<Record<string, unknown>> {
  const choreography: TransitionPresentation<Record<string, unknown>>[] = [
    // 01 (World Map) -> 02 (Industrial Pit): 3D Volumetric Cloud Fly-Through diving from altitude into factory pit
    proCloudFlythroughTransition({ tint: '#E8F3FF', shadeTint: '#8FAED1', mistColor: 'rgba(205, 226, 250, 0.38)' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 02 (Sunlit Skyline) -> 03 (Studio Counter): Speed-Ramped AE Whip Pan Left with directional motion blur streaks
    proWhipPan({ direction: 'left' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 03 (Cash Stacks) -> 04 (4 Workbenches Dolly): Dual-Ribbon Editorial Diagonal Sweep
    proDiagonalSweep({ accentColor: '#F5B82E', secondaryColor: '#18222F' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 04 (Typewriter) -> 05 (Diary / Storefront): Signature Infographics Show Inked Iris Reveal
    proIrisReveal({ originX: 50, originY: 52, ringColor: '#F5B82E' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 05 (Corner Storefront) -> 06 (Wall Calendar): Cinema Horizontal Shutter Wipe
    proShutterWipe({ axis: 'horizontal', accentColor: '#E85D4A' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 06 (Shipping Crates) -> 07 (Coastal Lighthouse): 3D Volumetric Cloud Fly-Through into Coastal Dusk
    proCloudFlythroughTransition({ tint: '#D4E6FA', shadeTint: '#6C8BB3', mistColor: 'rgba(130, 175, 224, 0.34)' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 07 (Ocean Radar) -> 08 (Trash Can & Vault): AE Rotational Match-Cut Morph (Radar Ring -> Vault Dial)
    proMatchCutMorph({ accentColor: '#2AD08E', direction: 'cw' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 08 (Open Gold Vault) -> 09 (Cargo Plane & Bridge): Coupled Zoom-Through blooming out of the gold vault into blue sky
    proZoomThrough({ zoomIntensity: 0.3, bloomColor: 'rgba(255, 224, 150, 0.3)' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 09 (Dhaka Bank) -> 10 (Mountain Staircase): 3D Volumetric Cloud Fly-Through climbing up to Alpine Peaks!
    proCloudFlythroughTransition({ tint: '#FFFFFF', shadeTint: '#B4D6F0', mistColor: 'rgba(235, 246, 255, 0.42)' }) as unknown as TransitionPresentation<Record<string, unknown>>,
    // 10 (Summit Beacon) -> 11 (Midnight Clock Study): AE Match-Cut Rotational Morph (Beacon -> Precision Brass Clock)
    proMatchCutMorph({ accentColor: '#FFD166', direction: 'ccw' }) as unknown as TransitionPresentation<Record<string, unknown>>,
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
 * Full 60fps "Sovereign Motion v7.0" Hybrid 2D Infographics Show × After Effects 3D Camera Composition.
 * Word-locked to real audio clause boundaries, 3D cloud fly-throughs, match-cut morphs & tactile documentary finish.
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

      {/* Cinema Broadcast Atmosphere + Tactile Documentary Film Grain & Halftones */}
      <AmbientAtmosphere frame={frame} warm={isWarmScene} />
      <TactileDocumentaryCompositor frame={frame} warm={isWarmScene} />
    </AbsoluteFill>
  );
};
