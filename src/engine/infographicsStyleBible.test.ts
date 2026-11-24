import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GIGA_QUALITY_CHECKLIST,
  INFOGRAPHICS_SHOW_BREAKDOWN,
  INFOGRAPHICS_SHOW_ULTRA_SYSTEM_PROMPT,
  INFOGRAPHICS_WORLD_PALETTES,
  SHOT_COMPOSITION_ARCHETYPES,
  VISUAL_METAPHOR_MATRIX,
  auditBlueprintForInfographicsStyle,
} from './infographicsStyleBible';
import { createInitialBlueprint } from '../data/presets';

test('Infographics Show Ultra style bible ships 12 worlds, 12-domain matrix, 8 shot archetypes, and 22-point Giga Quality Gate', () => {
  assert.equal(Object.keys(INFOGRAPHICS_WORLD_PALETTES).length, 12);
  assert.equal(INFOGRAPHICS_SHOW_BREAKDOWN.length, 6);
  assert.equal(VISUAL_METAPHOR_MATRIX.length, 12);
  assert.equal(SHOT_COMPOSITION_ARCHETYPES.length, 8);
  assert.equal(GIGA_QUALITY_CHECKLIST.length, 22);
  assert.ok(GIGA_QUALITY_CHECKLIST.some((i) => i.id === 'qg-19' && i.nonNegotiableStandard.includes('WhisperX')));
  assert.ok(GIGA_QUALITY_CHECKLIST.some((i) => i.id === 'qg-20' && i.nonNegotiableStandard.includes('VolumetricCloudFlythrough')));
  assert.ok(GIGA_QUALITY_CHECKLIST.some((i) => i.id === 'qg-22' && i.nonNegotiableStandard.includes('isSoftwareGl')));
  assert.ok(INFOGRAPHICS_SHOW_ULTRA_SYSTEM_PROMPT.includes('ZERO BOX TEMPLATES'));
  assert.ok(INFOGRAPHICS_SHOW_ULTRA_SYSTEM_PROMPT.includes('ZERO HUMAN FRAMES'));
  assert.ok(INFOGRAPHICS_SHOW_ULTRA_SYSTEM_PROMPT.includes('The Infographics Show'));
});

test('auditBlueprintForInfographicsStyle catches box-template and human-frame violations', () => {
  const base = createInitialBlueprint();
  const badBlueprint = {
    ...base,
    scenes: [
      {
        ...base.scenes[0],
        headline: 'Dashboard Card Stats',
        visualConcept: 'A cartoon man pointing at a bordered box and UI card with bullet list.',
      },
    ],
  };

  const report = auditBlueprintForInfographicsStyle(badBlueprint);
  assert.equal(report.passed, false);
  assert.ok(report.boxTemplateViolations.length > 0);
  assert.ok(report.humanFrameViolations.length > 0);
});

test('auditBlueprintForInfographicsStyle passes clean real-world zero-human blueprint with 6-dimension scores', () => {
  const base = createInitialBlueprint();
  const cleanBlueprint = {
    ...base,
    scenes: [
      {
        ...base.scenes[0],
        headline: 'Dhaka Desk Window',
        visualConcept:
          'Twilight Dhaka apartment desk with brass lamp, steaming teacup, glowing laptop, and city skyline rooftops outside the window.',
        continuity: {
          type: 'zoom-through' as const,
          carryDescription: 'Camera zooms straight through the glowing laptop window into the world map.',
          bridgeColor: 'accent' as const,
        },
        layers: [
          {
            ...base.scenes[0].layers[0],
            depth: 'bg' as const,
            label: 'Sunset sky horizon',
            idle: 'float' as const,
            text: undefined,
          },
          {
            ...base.scenes[0].layers[0],
            id: 'mid-desk',
            depth: 'mid' as const,
            label: 'Wooden desk and rooftop skyline',
            entrance: 'spring-pop' as const,
            idle: 'none' as const,
            text: undefined,
          },
        ],
      },
    ],
  };

  const report = auditBlueprintForInfographicsStyle(cleanBlueprint);
  assert.equal(report.passed, true);
  assert.equal(report.boxTemplateViolations.length, 0);
  assert.equal(report.humanFrameViolations.length, 0);
  assert.equal(report.environmentCoveragePct, 100);
  assert.equal(report.parallaxDepthPct, 100);
  assert.equal(report.microMotionPct, 100);
  assert.equal(report.transitionVarietyPct, 100);
});
