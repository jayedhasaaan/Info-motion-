import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInitialBlueprint } from '../src/data/presets';
import { renderBlueprintToMp4 } from '../src/server/renderMp4Engine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const blueprint = createInitialBlueprint();
  const outDir = path.resolve(__dirname, '../public/renders');
  const outMp4 = path.join(outDir, 'bangladesh-x-demo.mp4');
  const outMeta = path.join(outDir, 'bangladesh-x-demo.json');

  console.log(`Starting HD 16:9 render for: ${blueprint.title}`);
  const started = Date.now();

  const result = await renderBlueprintToMp4({
    blueprint,
    outputMp4Path: outMp4,
    voiceName: 'Charon',
    voiceStyle:
      'Measured, grounded editorial documentary narrator with calm authority, warm human inflection, and crisp clarity',
    fps: 30,
    width: 1280,
    height: 720,
    includeVoiceover: Boolean(process.env.GEMINI_API_KEY),
    onProgress: (stage, pct) => {
      console.log(`[${String(pct).padStart(3, ' ')}%] ${stage}`);
    },
  });

  const elapsedSec = ((Date.now() - started) / 1000).toFixed(1);
  const meta = {
    videoUrl: '/renders/bangladesh-x-demo.mp4',
    title: blueprint.title,
    durationSec: result.durationSec,
    width: result.width,
    height: result.height,
    fps: result.fps,
    fileSizeBytes: result.fileSizeBytes,
    hasVoiceover: result.hasVoiceover,
    voiceName: result.voiceName,
    renderedAt: result.renderedAt,
    beatCount: result.syncedBlueprint.scenes.length,
  };

  await fs.writeFile(outMeta, JSON.stringify(meta, null, 2), 'utf8');
  console.log(
    `Done in ${elapsedSec}s! Saved ${outMp4} (${(result.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB, ${result.durationSec}s, voiceover=${result.hasVoiceover})`
  );
}

main().catch((err) => {
  console.error('Demo render failed:', err);
  process.exit(1);
});
