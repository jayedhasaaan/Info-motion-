import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialBlueprint } from '../data/presets';
import {
  buildBeatThumbnailSvg,
  buildFilmFrameSvg,
  computeContinuousCamera,
} from './continuousFilmRenderer';

test('computeContinuousCamera smoothly interpolates worldX across beat handoff bridge', () => {
  const bp = createInitialBlueprint();
  const beat0 = bp.scenes[0];
  const beat1 = bp.scenes[1];

  const steady = computeContinuousCamera(bp.scenes, beat0.startSec + 2.0);
  assert.equal(steady.activeSceneIndex, 0);
  assert.equal(steady.bridgeProgress, 0);

  // Inside the final 0.3s handoff window before beat1 starts
  const handoff = computeContinuousCamera(bp.scenes, beat0.startSec + beat0.durationSec - 0.25);
  assert.equal(handoff.activeSceneIndex, 0);
  assert.ok(handoff.bridgeProgress > 0.3, 'camera bridge should be actively transitioning');
  assert.ok(
    handoff.worldX > beat0.worldX && handoff.worldX < beat1.worldX,
    `expected worldX between ${beat0.worldX} and ${beat1.worldX}, got ${handoff.worldX}`
  );
});

test('buildFilmFrameSvg renders valid SVG honoring palette polarity and subtitle toggle', () => {
  const bp = createInitialBlueprint();
  const withSubtitles = buildFilmFrameSvg({ ...bp, paletteMode: 'dark', subtitlesEnabled: true }, 1.8, 540, 960);
  assert.ok(withSubtitles.svg.startsWith('<svg '));
  assert.ok(withSubtitles.svg.includes('#131816'), 'dark luxury palette should apply');
  assert.ok(withSubtitles.svg.includes('<tspan'), 'luxury subtitles should render when enabled');

  const withoutSubtitles = buildFilmFrameSvg({ ...bp, paletteMode: 'light', subtitlesEnabled: false }, 1.8, 960, 540);
  assert.ok(withoutSubtitles.svg.includes('#FAF8F3'), 'light luxury palette should apply');
  assert.ok(!withoutSubtitles.svg.includes('<tspan'), 'subtitles must omit when disabled');
});

test('buildBeatThumbnailSvg renders arbitrary bespoke vector primitives cleanly', () => {
  const bp = createInitialBlueprint();
  assert.equal(bp.format, 'youtube-2m');
  assert.equal(bp.aspectRatio, '16:9');
  assert.equal(bp.scenes.length, 12);
  assert.equal(bp.totalPreviewSec, 120);

  const thumb = buildBeatThumbnailSvg(bp.scenes[0], 'light');
  assert.ok(thumb.startsWith('<svg '));
  assert.ok(thumb.includes('<path '), 'global meridian arcs should render');
  assert.ok(thumb.includes('<circle '), 'Dhaka origin beacon should render');
  assert.ok(thumb.includes('DHAKA'), 'Dhaka destination callout should render');
  assert.ok(thumb.includes('EARN IN USD'), 'currency leverage label should render');
});
