import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOCKED_WORD_TIMELINE,
  auditSyncIntegrity,
  getActiveWordState,
  getAllResolvedCues,
  getWordCueFrame,
} from './wordSyncTimeline';

test('audio-first locked timeline covers all 12 beats with <= 16.7ms quantization drift', () => {
  const report = auditSyncIntegrity(60);
  assert.equal(report.beatCount, 12);
  assert.ok(report.totalWords > 240, `Expected >240 aligned words, got ${report.totalWords}`);
  assert.ok(report.totalCues >= 28, `Expected >=28 visual/SFX cue anchors, got ${report.totalCues}`);
  assert.equal(report.allCuesResolved, true);
  assert.equal(report.monotonic, true);
  assert.ok(
    report.maxBoundaryDriftMs <= 16.7,
    `Expected max frame quantization drift <= 16.7ms (1 frame @ 60fps), got ${report.maxBoundaryDriftMs}ms`
  );
});

test('key narrative cues lock directly to real spoken clause timestamps instead of linear estimates', () => {
  // Beat 01: "window" occurs in clause 2 (starts 6.59s -> ~400-440f), not frame 288
  const windowDive = getWordCueFrame('bdx-01', 'window-dive', 288);
  assert.ok(windowDive >= 385 && windowDive <= 455, `window-dive frame=${windowDive}`);

  // Beat 02: "On X" occurs right after 18.97s pause (beat starts 12.17s -> local ~400-425f)
  const onXWipe = getWordCueFrame('bdx-02', 'on-x-wipe', 350);
  assert.ok(onXWipe >= 395 && onXWipe <= 435, `on-x-wipe frame=${onXWipe}`);

  // Beat 08: "open" occurs in clause 3 (100.05s - 90.43s -> local ~570-640f)
  const vaultOpen = getWordCueFrame('bdx-08', 'vault-unlock', 438);
  assert.ok(vaultOpen >= 565 && vaultOpen <= 660, `vault-unlock frame=${vaultOpen}`);

  // Beat 10: Month 1, Month 2, Month 3 rise in strict chronological order matching real pauses
  const m1 = getWordCueFrame('bdx-10', 'month-one-tier', 32);
  const m2 = getWordCueFrame('bdx-10', 'month-two-tier', 235);
  const m3 = getWordCueFrame('bdx-10', 'month-three-tier', 455);
  assert.ok(m1 < m2 && m2 < m3, `Expected m1(${m1}) < m2(${m2}) < m3(${m3})`);
});

test('getActiveWordState holds cleanly during silence pauses and advances accurately on speech', () => {
  const bdx01 = LOCKED_WORD_TIMELINE[0];
  const preSpeech = getActiveWordState('bdx-01', 2);
  assert.ok(preSpeech);
  assert.equal(preSpeech.activeIndex, 0);
  assert.equal(preSpeech.isSpeaking, false);

  // Mid-beat silence gap in bdx-01 is 5.99s..6.59s -> local frame 375 (6.25s)
  const midGap = getActiveWordState('bdx-01', 375);
  assert.ok(midGap);
  assert.equal(midGap.words[midGap.activeIndex].clauseIndex, 0);

  // Right after clause 2 resumes (6.75s -> frame 405), active word moves into clause 1
  const clause2Start = getActiveWordState('bdx-01', 405);
  assert.ok(clause2Start);
  assert.equal(clause2Start.words[clause2Start.activeIndex].clauseIndex, 1);

  assert.equal(bdx01.beatId, 'bdx-01');
  assert.ok(getAllResolvedCues().length >= 28);
});
