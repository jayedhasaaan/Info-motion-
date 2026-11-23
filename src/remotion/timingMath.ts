import { BANGLADESH_X_BEATS, FILM_FPS, TRANSITION_FRAMES, type BeatTimingSpec } from './theme';

export interface SceneTimelineSlot {
  beat: BeatTimingSpec;
  globalStartFrame: number;
  globalEndFrame: number;
  /** Duration passed to TransitionSeries.Sequence (includes transition overlap for non-final scenes) */
  sequenceDurationInFrames: number;
  /** Visible content duration before transition overlap */
  contentDurationInFrames: number;
  hasFollowingTransition: boolean;
}

/**
 * Computes exact TransitionSeries sequence durations so every beat i starts at
 * Math.round(beat.startSec * fps) on the global timeline, accounting for Remotion's
 * TransitionSeries overlap subtraction.
 */
export function computeTransitionTimeline(
  beats: BeatTimingSpec[] = BANGLADESH_X_BEATS,
  fps: number = FILM_FPS,
  transitionFrames: number = TRANSITION_FRAMES
): { slots: SceneTimelineSlot[]; totalDurationInFrames: number; transitionCutSec: number[] } {
  if (beats.length === 0) {
    return { slots: [], totalDurationInFrames: 0, transitionCutSec: [] };
  }

  const slots: SceneTimelineSlot[] = [];
  const transitionCutSec: number[] = [];

  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    const globalStartFrame = Math.round(beat.startSec * fps);
    const globalEndFrame = Math.round(beat.endSec * fps);
    const contentDurationInFrames = Math.max(transitionFrames + 10, globalEndFrame - globalStartFrame);
    const hasFollowingTransition = i < beats.length - 1;
    const sequenceDurationInFrames = hasFollowingTransition
      ? contentDurationInFrames + transitionFrames
      : contentDurationInFrames;

    if (hasFollowingTransition) {
      transitionCutSec.push(beat.endSec);
    }

    slots.push({
      beat,
      globalStartFrame,
      globalEndFrame,
      sequenceDurationInFrames,
      contentDurationInFrames,
      hasFollowingTransition,
    });
  }

  // Remotion TransitionSeries total = sum(sequenceDurationInFrames) - (N - 1) * transitionFrames
  const rawSum = slots.reduce((acc, s) => acc + s.sequenceDurationInFrames, 0);
  const totalOverlap = Math.max(0, slots.length - 1) * transitionFrames;
  const totalDurationInFrames = rawSum - totalOverlap;

  return { slots, totalDurationInFrames, transitionCutSec };
}

export const BANGLADESH_X_TIMELINE = computeTransitionTimeline(
  BANGLADESH_X_BEATS,
  FILM_FPS,
  TRANSITION_FRAMES
);

export const TOTAL_FILM_FRAMES = BANGLADESH_X_TIMELINE.totalDurationInFrames;
