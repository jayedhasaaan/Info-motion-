import test from 'node:test';
import assert from 'node:assert/strict';
import { BANGLADESH_X_BEATS, FILM_FPS, TRANSITION_FRAMES } from './theme';
import { computeTransitionTimeline } from './timingMath';

test('TransitionSeries timing locks every beat to exact 60fps voiceover boundary', () => {
  const { slots, totalDurationInFrames, transitionCutSec } = computeTransitionTimeline(
    BANGLADESH_X_BEATS,
    FILM_FPS,
    TRANSITION_FRAMES
  );

  assert.equal(slots.length, 12);
  assert.equal(transitionCutSec.length, 11);

  // Verify cumulative TransitionSeries start frame matches beat.startSec * 60
  let cursor = 0;
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    assert.equal(cursor, slot.globalStartFrame, `Beat ${i + 1} start frame mismatch`);
    cursor += slot.sequenceDurationInFrames;
    if (slot.hasFollowingTransition) {
      cursor -= TRANSITION_FRAMES;
    }
  }

  const expectedTotal = Math.round(BANGLADESH_X_BEATS[BANGLADESH_X_BEATS.length - 1].endSec * FILM_FPS);
  assert.equal(totalDurationInFrames, expectedTotal);
  assert.equal(cursor, expectedTotal);
  // 155.85s * 60fps = 9351 frames
  assert.equal(totalDurationInFrames, 9351);
});
