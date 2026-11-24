import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialBlueprint,
  createInitialViralClipProject,
  DEFAULT_SKILL_CONFIG,
} from '../data/presets';
import { generateSkillRepoFiles } from './skillRepoGenerator';

test('generateSkillRepoFiles produces a 33-file v7.0.0 self-contained Antigravity Infographics Show x AE 2D+3D repo', () => {
  const config = {
    ...DEFAULT_SKILL_CONFIG,
    primaryVoiceId: 'bm_george',
    secondaryVoiceId: 'af_heart',
    voiceBlendRatio: 0.7,
    kokoroQuantization: 'int8' as const,
    defaultPalette: 'dark' as const,
    defaultSubtitles: 'off' as const,
  };
  const files = generateSkillRepoFiles(
    config,
    createInitialBlueprint(),
    createInitialViralClipProject()
  );

  assert.equal(files.length, 33);
  const paths = files.map((f) => f.path);
  assert.ok(paths.includes('SKILL.md'));
  assert.ok(paths.includes('package.json'));
  assert.ok(paths.includes('references/infographics-show-ultra-bible.md'));
  assert.ok(paths.includes('references/ae-viral-twists-2d-3d.md'));
  assert.ok(paths.includes('references/audio-first-sync-protocol.md'));
  assert.ok(paths.includes('references/creative-scenario-playbook.md'));
  assert.ok(paths.includes('references/pro-editor-micro-craft.md'));
  assert.ok(paths.includes('references/shot-composition-patterns.md'));
  assert.ok(paths.includes('references/antigravity-imagination-protocol.md'));
  assert.ok(paths.includes('references/giga-quality-checklist.md'));
  assert.ok(paths.includes('references/color-worlds-palette.md'));
  assert.ok(paths.includes('references/remotion-best-practices.md'));
  assert.ok(paths.includes('src/remotion/aeMotionEngine.tsx'));
  assert.ok(paths.includes('src/remotion/hero3DProps.tsx'));
  assert.ok(paths.includes('src/remotion/proPrimitives.tsx'));
  assert.ok(paths.includes('src/remotion/proTransitions.tsx'));
  assert.ok(paths.includes('scripts/audit_infographics_quality.mjs'));
  assert.ok(paths.includes('scripts/render_remotion_60fps.mjs'));
  assert.ok(paths.includes('scripts/generate_audio_kokoro.py'));
  assert.ok(paths.includes('scripts/render_scene_frame.mjs'));
  assert.ok(paths.includes('scripts/qa_storyboard_frames.mjs'));
  assert.ok(paths.includes('scripts/render_chunked_video.mjs'));
  assert.ok(paths.includes('scripts/viral_clipper_pipeline.py'));
  assert.ok(paths.includes('scripts/build_ass_captions.py'));
  assert.ok(paths.includes('templates/active_blueprint.json'));

  const pkg = JSON.parse(files.find((f) => f.path === 'package.json')!.content);
  assert.equal(pkg.version, '7.0.0');
  assert.ok(pkg.dependencies.three, 'v7.0 package.json includes Three.js for 3D extruded props');

  const skillMd = files.find((f) => f.path === 'SKILL.md')!;
  assert.ok(skillMd.content.includes('MANDATORY GATE 1'), 'SKILL.md must enforce user review gate before production');
  assert.ok(skillMd.content.includes('remotion-dev/skills'), 'SKILL.md incorporates remotion-dev/skills 60fps engine');
  assert.ok(skillMd.content.includes('audit_infographics_quality.mjs'), 'SKILL.md enforces executable quality gate');
  assert.ok(skillMd.content.includes('ae-viral-twists-2d-3d.md'), 'SKILL.md links v7.0 AE viral twists guide');
  assert.ok(skillMd.content.includes('audio-first-sync-protocol.md'), 'SKILL.md links v7.0 Audio-First sync protocol');
  assert.ok(skillMd.content.includes('timeline.locked.json'), 'SKILL.md locks pipeline to timeline.locked.json');
  assert.ok(skillMd.content.includes('0.7*bm_george + 0.3*af_heart'));
  assert.ok(skillMd.content.includes('Default `dark`'));
  assert.ok(skillMd.content.includes('Default `off`'));
  assert.ok(!skillMd.content.includes('Alabaster Ledger'), 'SKILL.md must not contain stale luxury template contradictions');

  const aeEngine = files.find((f) => f.path === 'src/remotion/aeMotionEngine.tsx')!;
  assert.ok(aeEngine.content.includes('Camera3DRig'), 'ships Camera3DRig');
  assert.ok(aeEngine.content.includes('VolumetricCloudFlythrough'), 'ships VolumetricCloudFlythrough');
  assert.ok(aeEngine.content.includes('GlassLeaderCallout'), 'ships GlassLeaderCallout');
  assert.ok(aeEngine.content.includes('TactileDocumentaryCompositor'), 'ships TactileDocumentaryCompositor');
  assert.ok(aeEngine.content.includes('useWordCue'), 'ships useWordCue hook');

  const hero3D = files.find((f) => f.path === 'src/remotion/hero3DProps.tsx')!;
  assert.ok(hero3D.content.includes('RoomEnvironment'), 'uses Three.js RoomEnvironment PBR lighting');
  assert.ok(hero3D.content.includes('InstancedMesh'), 'uses Three.js InstancedMesh');
  assert.ok(hero3D.content.includes('isSoftwareGl'), 'includes mandatory isSoftwareGl guard for 16GB laptops');

  const shippedPrimitives = files.find((f) => f.path === 'src/remotion/proPrimitives.tsx')!;
  assert.ok(shippedPrimitives.content.includes('ImpactBurst'), 'ships ImpactBurst primitive');
  assert.ok(shippedPrimitives.content.includes('ChapterSliver'), 'ships ChapterSliver primitive');
  assert.ok(shippedPrimitives.content.includes('LeaderCallout'), 'ships LeaderCallout infographic pointer primitive');
  assert.ok(shippedPrimitives.content.includes('SplitBuilding'), 'ships SplitBuilding architectural primitive');
  assert.ok(shippedPrimitives.content.includes('#2AD08E'), 'ships semantic emerald power-word captions');

  const remotionScript = files.find((f) => f.path === 'scripts/render_remotion_60fps.mjs')!;
  assert.ok(remotionScript.content.includes('@remotion/renderer'), '60fps script uses @remotion/renderer');
  assert.ok(remotionScript.content.includes('buildTransitionSfxWav'), '60fps script synthesizes 6-layer stereo SFX');
  assert.ok(remotionScript.content.includes('ffprobe'), '60fps script runs ffprobe A/V sync delta check');

  const shippedTransitions = files.find((f) => f.path === 'src/remotion/proTransitions.tsx')!;
  assert.ok(shippedTransitions.content.includes('proShutterWipe'), 'ships proShutterWipe');
  assert.ok(shippedTransitions.content.includes('proLiquidWaveSweep'), 'ships proLiquidWaveSweep');
  assert.ok(shippedTransitions.content.includes('proCloudFlythroughTransition'), 'ships v7.0 proCloudFlythroughTransition');
  assert.ok(shippedTransitions.content.includes('proMatchCutMorph'), 'ships v7.0 proMatchCutMorph');
  assert.ok(shippedTransitions.content.includes('anticipation'), 'ships AE anticipation pull-back on whip pans');

  const chunkedRender = files.find((f) => f.path === 'scripts/render_chunked_video.mjs')!;
  assert.ok(chunkedRender.content.includes('@resvg/resvg-js'), 'chunked renderer uses Rust Resvg');
  assert.ok(chunkedRender.content.includes('./render_scene_frame.mjs'), 'references shipped render_scene_frame.mjs');
  assert.ok(!chunkedRender.content.includes('render_chunk_worker.mjs'), 'must not reference missing worker');

  const kokoroPy = files.find((f) => f.path === 'scripts/generate_audio_kokoro.py')!;
  assert.ok(kokoroPy.content.includes('PRIMARY_VOICE = "bm_george"'));
  assert.ok(kokoroPy.content.includes('kokoro-v1.0.int8.onnx'));
  assert.ok(kokoroPy.content.includes('timeline.locked.json'), 'emits Audio-First timeline.locked.json');
  assert.ok(kokoroPy.content.includes('cueFrames'), 'populates per-beat cueFrames map');
});
