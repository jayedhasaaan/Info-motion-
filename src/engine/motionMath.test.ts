import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aeSnappyExit,
  aeSpeedGraphEase,
  alignSceneWords,
  buildAssSubtitleFile,
  calculateHardwareBudget,
  clampInterpolate,
  detectHeatmapPeaks,
  emaSmoothCropX,
  formatAssTimestamp,
  springCurve,
  trimPathProgress,
} from './motionMath';

test('clampInterpolate strictly clamps outside input bounds', () => {
  assert.equal(clampInterpolate(-10, 0, 100, 0, 1), 0);
  assert.equal(clampInterpolate(150, 0, 100, 0, 1), 1);
  assert.equal(clampInterpolate(50, 0, 100, 10, 20), 15);
});

test('aeSpeedGraphEase rises fast early and settles smoothly at 1', () => {
  const early = aeSpeedGraphEase(0.2);
  const mid = aeSpeedGraphEase(0.5);
  assert.equal(aeSpeedGraphEase(0), 0);
  assert.equal(aeSpeedGraphEase(1), 1);
  assert.ok(early > 0.7, `expected fast-in > 0.7 at t=0.2, got ${early}`);
  assert.ok(mid > early && mid < 1);
  assert.ok(aeSnappyExit(0.5) < 0.2, 'snappy exit starts accelerating cleanly');
});

test('springCurve settles near 1 and trimPathProgress respects delay', () => {
  assert.equal(springCurve(0), 0);
  assert.ok(Math.abs(springCurve(1.4) - 1) < 0.02);
  assert.equal(trimPathProgress(0.1, 0.25, 0.8), 0);
  assert.ok(trimPathProgress(0.6, 0.25, 0.8) > 0.8);
});

test('alignSceneWords produces monotonic timestamps bounded inside scene duration', () => {
  const words = alignSceneWords('Every $10,000 sitting idle quietly loses 38% over ten years.', 4.0, 6.0);
  assert.equal(words.length, 10);
  assert.ok(words[0].startSec >= 4.0);
  assert.ok(words[words.length - 1].endSec <= 10.0);
  for (let i = 1; i < words.length; i++) {
    assert.ok(words[i].startSec >= words[i - 1].startSec);
  }
  assert.equal(words[1].emphasis, true, '$10,000 should be flagged for emphasis');
  assert.equal(words[6].emphasis, true, '38% should be flagged for emphasis');
});

test('detectHeatmapPeaks isolates spaced viral intensity spikes', () => {
  const heatmap = new Array(100).fill(0.2);
  heatmap[22] = 0.88;
  heatmap[23] = 0.94;
  heatmap[24] = 0.81;
  heatmap[68] = 0.91;
  heatmap[69] = 0.72;
  const peaks = detectHeatmapPeaks(heatmap, 1000, 0.65, 6);
  assert.equal(peaks.length, 2);
  assert.equal(peaks[0].segmentIndex, 23);
  assert.equal(peaks[0].timeSec, 230);
  assert.equal(peaks[1].segmentIndex, 68);
});

test('emaSmoothCropX dampens jitter while keeping crop inside frame bounds', () => {
  const rawCenters = [960, 1400, 1400, 1400, 200];
  const smoothed = emaSmoothCropX(rawCenters, 1920, 608, 0.2);
  assert.equal(smoothed.length, 5);
  assert.ok(smoothed[1] > smoothed[0] && smoothed[1] < 1400 - 304, 'EMA dampens abrupt jump');
  for (const x of smoothed) {
    assert.ok(x >= 0 && x <= 1920 - 608);
  }
});

test('buildAssSubtitleFile emits valid libass header and karaoke tags', () => {
  assert.equal(formatAssTimestamp(65.42), '0:01:05.42');
  const words = alignSceneWords('Cash loses 38% silently.', 0, 3);
  const ass = buildAssSubtitleFile(words, 'dark', 4);
  assert.ok(ass.includes('[V4+ Styles]'));
  assert.ok(ass.includes('Style: LuxuryReel,Plus Jakarta Sans'));
  assert.ok(ass.includes('\\kf'));
  assert.ok(ass.includes('38%'));
});

test('calculateHardwareBudget keeps 30-min render flat and safe for 16GB RAM', () => {
  const budget1m = calculateHardwareBudget({
    quantization: 'fp16',
    whisperModel: 'base.en',
    format: 'reel-1m',
    chunkSeconds: 60,
    includeClipperStack: true,
  });
  const budget30m = calculateHardwareBudget({
    quantization: 'fp16',
    whisperModel: 'base.en',
    format: 'deepdive-30m',
    chunkSeconds: 60,
    includeClipperStack: true,
  });
  assert.equal(budget1m.peakRenderRamGb, budget30m.peakRenderRamGb, 'chunked RAM stays flat across 1m and 30m');
  assert.equal(budget30m.chunkCount, 30);
  assert.equal(budget30m.safeFor16GbRam, true);
  assert.ok(budget30m.remotionEquivalentRamGb > 12, 'Remotion 30-min equivalent exceeds safe 16GB budget');
});
