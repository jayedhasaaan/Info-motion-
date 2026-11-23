import {
  aeSpeedGraphEase,
  clampInterpolate,
  idleBreath,
  springCurve,
} from './motionMath';
import type {
  PaletteMode,
  SceneBeat,
  SceneVectorLayer,
  VectorColorToken,
  VideoBlueprint,
} from '../types/engine';

export interface FilmPalette {
  bgTop: string;
  bgBottom: string;
  surface: string;
  surfaceAlt: string;
  hairline: string;
  ink: string;
  muted: string;
  accent: string;
  accentLight: string;
  emerald: string;
  crimson: string;
  captionBg: string;
}

const LIGHT_FILM_PALETTE: FilmPalette = {
  bgTop: '#FAF8F3',
  bgBottom: '#ECE6DA',
  surface: '#FFFFFF',
  surfaceAlt: '#F3EEE4',
  hairline: 'rgba(19, 23, 21, 0.13)',
  ink: '#131715',
  muted: '#5A625D',
  accent: '#A67C37',
  accentLight: '#DFC07F',
  emerald: '#0F6B4E',
  crimson: '#B53D32',
  captionBg: 'rgba(250, 248, 243, 0.90)',
};

const DARK_FILM_PALETTE: FilmPalette = {
  bgTop: '#131816',
  bgBottom: '#090C0B',
  surface: '#1A221F',
  surfaceAlt: '#222D28',
  hairline: 'rgba(244, 241, 234, 0.14)',
  ink: '#F4F1EA',
  muted: '#9CA6A0',
  accent: '#D4AF6A',
  accentLight: '#F3DCAC',
  emerald: '#2BB682',
  crimson: '#E05A47',
  captionBg: 'rgba(13, 16, 15, 0.86)',
};

export function resolveFilmPalette(
  mode: PaletteMode,
  scenePolarity: 'light' | 'dark'
): { palette: FilmPalette; isDark: boolean } {
  const isDark = mode === 'dark' ? true : mode === 'light' ? false : scenePolarity === 'dark';
  return { palette: isDark ? DARK_FILM_PALETTE : LIGHT_FILM_PALETTE, isDark };
}

export function resolveColorToken(
  token: VectorColorToken | string | undefined,
  palette: FilmPalette
): string {
  if (!token || token === 'none') return 'none';
  switch (token) {
    case 'ink':
      return palette.ink;
    case 'muted':
      return palette.muted;
    case 'accent':
      return palette.accent;
    case 'accent-light':
      return palette.accentLight;
    case 'emerald':
      return palette.emerald;
    case 'crimson':
      return palette.crimson;
    case 'surface':
      return palette.surface;
    case 'surface-alt':
      return palette.surfaceAlt;
    case 'bg':
      return palette.bgTop;
    default:
      return token;
  }
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function resolveFontFamily(family?: 'editorial' | 'sans' | 'mono'): string {
  if (family === 'editorial') return "'Playfair Display', 'Noto Serif', Georgia, serif";
  if (family === 'mono') return "'IBM Plex Mono', 'JetBrains Mono', monospace";
  return "'Plus Jakarta Sans', 'Noto Sans', system-ui, sans-serif";
}

export interface ContinuousCameraState {
  activeSceneIndex: number;
  activeScene: SceneBeat;
  worldX: number;
  worldY: number;
  zoom: number;
  rotate: number;
  bridgeProgress: number; // 0 during steady beat, 0..1 during handoff into next beat
  nextSceneIndex: number | null;
}

/**
 * Computes unbroken continuous world camera state across all beats.
 * During the final 0.72s of Beat N, the virtual camera smoothly dollies, pans,
 * or zooms directly into Beat N+1's world coordinates so the film NEVER breaks into static slides.
 */
export function computeContinuousCamera(
  scenes: SceneBeat[],
  timeSec: number
): ContinuousCameraState {
  if (!scenes.length) {
    throw new Error('Blueprint must contain at least one scene.');
  }

  let activeIdx = scenes.length - 1;
  for (let i = 0; i < scenes.length; i++) {
    if (timeSec < scenes[i].startSec + scenes[i].durationSec) {
      activeIdx = i;
      break;
    }
  }

  const scene = scenes[activeIdx];
  const localT = Math.max(0, timeSec - scene.startSec);
  const progress = clampInterpolate(localT, 0, scene.durationSec, 0, 1);

  // Subtle living camera drift throughout the beat (never static!)
  let driftX = 0;
  let driftY = 0;
  let driftZoom = 0;
  let driftRot = 0;

  if (scene.cameraMove === 'push-in') {
    driftZoom = 0.085 * progress;
  } else if (scene.cameraMove === 'pull-back') {
    driftZoom = -0.075 * progress;
  } else if (scene.cameraMove === 'pan-right') {
    driftX = 48 * progress;
  } else if (scene.cameraMove === 'whip-cut') {
    driftZoom = 0.05 * aeSpeedGraphEase(clampInterpolate(localT, 0, 0.65, 0, 1));
    driftRot = (1 - aeSpeedGraphEase(clampInterpolate(localT, 0, 0.55, 0, 1))) * 2.4;
  } else {
    driftY = -18 * progress;
    driftZoom = 0.03 * progress;
  }

  let worldX = scene.worldX + driftX;
  let worldY = scene.worldY + driftY;
  let zoom = (scene.cameraZoom || 1) + driftZoom;
  let rotate = (scene.cameraRotate || 0) + driftRot;

  // Continuous Handoff Bridge into Beat N+1 during the last 0.72s
  const handoffWindow = Math.min(0.78, scene.durationSec * 0.22);
  const nextIdx = activeIdx + 1 < scenes.length ? activeIdx + 1 : null;
  let bridgeProgress = 0;

  if (nextIdx !== null && localT > scene.durationSec - handoffWindow) {
    const nextScene = scenes[nextIdx];
    const rawBridge = clampInterpolate(
      localT,
      scene.durationSec - handoffWindow,
      scene.durationSec,
      0,
      1
    );
    bridgeProgress = aeSpeedGraphEase(rawBridge);

    // Smoothly carry camera from Beat N into Beat N+1's spatial neighborhood
    worldX = worldX + (nextScene.worldX - worldX) * bridgeProgress;
    worldY = worldY + (nextScene.worldY - worldY) * bridgeProgress;

    const bridgeType = nextScene.continuity.type;
    if (bridgeType === 'zoom-through') {
      // Dramatic dive-through zoom curve peaking right at the handoff apex
      const diveBoost = Math.sin(bridgeProgress * Math.PI) * 0.55;
      zoom = zoom + ((nextScene.cameraZoom || 1) - zoom) * bridgeProgress + diveBoost;
    } else if (bridgeType === 'match-cut-spin') {
      const spinArc = Math.sin(bridgeProgress * Math.PI) * 14;
      rotate = rotate + ((nextScene.cameraRotate || 0) - rotate) * bridgeProgress + spinArc;
      zoom = zoom + ((nextScene.cameraZoom || 1) - zoom) * bridgeProgress;
    } else {
      zoom = zoom + ((nextScene.cameraZoom || 1) - zoom) * bridgeProgress;
      rotate = rotate + ((nextScene.cameraRotate || 0) - rotate) * bridgeProgress;
    }
  }

  return {
    activeSceneIndex: activeIdx,
    activeScene: scene,
    worldX,
    worldY,
    zoom,
    rotate,
    bridgeProgress,
    nextSceneIndex: nextIdx,
  };
}

/**
 * Computes deterministic SVG markup for a single procedural vector layer at localTimeSec.
 */
function renderVectorLayerSvg(
  layer: SceneVectorLayer,
  localTimeSec: number,
  palette: FilmPalette,
  staggerEnabled: boolean,
  trimPathsEnabled: boolean,
  layerIndex: number
): string {
  const staggerOffset = staggerEnabled ? layerIndex * 0.055 : 0;
  const start = Math.max(0, (layer.delaySec || 0) + staggerOffset);
  const dur = Math.max(0.25, layer.durationSec || 0.72);
  const elapsed = localTimeSec - start;

  if (elapsed < -0.05) {
    return '';
  }

  const rawP = clampInterpolate(elapsed, 0, dur, 0, 1);
  const eased = aeSpeedGraphEase(rawP);
  const spring = springCurve(Math.max(0, elapsed), 155, 17, 1);

  let tx = 0;
  let ty = 0;
  let sc = 1;
  let op = (layer.opacity ?? 1) * clampInterpolate(elapsed, 0, Math.min(0.24, dur * 0.4), 0, 1);
  let rot = layer.rotation ?? 0;
  let dashAttr = '';

  switch (layer.entrance) {
    case 'trim-path':
      if (trimPathsEnabled && (layer.kind === 'path' || layer.kind === 'line' || layer.kind === 'circle' || layer.kind === 'rect' || layer.kind === 'polygon' || layer.kind === 'ellipse')) {
        const dashLen = 2200;
        const offset = Math.round(dashLen * (1 - eased));
        dashAttr = ` stroke-dasharray="${dashLen}" stroke-dashoffset="${offset}"`;
      }
      op = (layer.opacity ?? 1) * clampInterpolate(elapsed, 0, 0.14, 0, 1);
      break;
    case 'spring-pop':
      sc = Math.max(0.01, spring);
      break;
    case 'slide-up':
      ty = (1 - eased) * 56;
      break;
    case 'slide-left':
      tx = (1 - eased) * 72;
      break;
    case 'slide-right':
      tx = -(1 - eased) * 72;
      break;
    case 'scale-bloom':
      sc = 0.72 + 0.28 * eased;
      break;
    case 'drop-gravity':
      ty = -(1 - spring) * 90;
      break;
    case 'fade':
    default:
      break;
  }

  // Living idle micro-motion after settle so frames stay alive
  const idleT = Math.max(0, localTimeSec - start);
  const idleMode = layer.idle ?? 'none';
  if (idleMode === 'float') {
    ty += idleBreath(idleT, 6.5, 0.44, layerIndex * 0.8);
  } else if (idleMode === 'pulse') {
    sc *= 1 + Math.sin(idleT * Math.PI * 1.4 + layerIndex) * 0.032;
  } else if (idleMode === 'rotate-slow') {
    rot += idleT * 18;
  } else if (idleMode === 'sway') {
    rot += Math.sin(idleT * Math.PI * 0.8 + layerIndex) * 3.8;
  } else if (idleMode === 'drip') {
    const cycle = (idleT * 0.75 + layerIndex * 0.23) % 1;
    ty += cycle * cycle * 64;
    op *= 1 - Math.max(0, (cycle - 0.75) * 4);
  } else if (idleMode === 'tick') {
    const step = Math.floor(idleT * 2.5);
    rot += step * 12;
  }

  // Anchor pivot for scale/rotation around shape center
  let pivotX = 500;
  let pivotY = 500;
  if (layer.cx !== undefined && layer.cy !== undefined) {
    pivotX = layer.cx;
    pivotY = layer.cy;
  } else if (layer.x !== undefined && layer.y !== undefined) {
    pivotX = layer.x + (layer.width ? layer.width / 2 : 0);
    pivotY = layer.y + (layer.height ? layer.height / 2 : 0);
  } else if (layer.x1 !== undefined && layer.x2 !== undefined && layer.y1 !== undefined && layer.y2 !== undefined) {
    pivotX = (layer.x1 + layer.x2) / 2;
    pivotY = (layer.y1 + layer.y2) / 2;
  }

  const fillVal = resolveColorToken(layer.fill, palette);
  const strokeVal = resolveColorToken(layer.stroke, palette);
  const sw = layer.strokeWidth ?? (strokeVal !== 'none' ? 3 : 0);
  const explicitDash = !dashAttr && layer.strokeDasharray ? ` stroke-dasharray="${escapeXml(layer.strokeDasharray)}"` : '';
  const styleAttrs = `fill="${escapeXml(fillVal)}" stroke="${escapeXml(strokeVal)}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dashAttr}${explicitDash}`;

  const transform = `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) translate(${pivotX.toFixed(1)} ${pivotY.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${sc.toFixed(4)}) translate(${(-pivotX).toFixed(1)} ${(-pivotY).toFixed(1)})`;

  let shapeSvg = '';
  if (layer.kind === 'path' && layer.d) {
    shapeSvg = `<path d="${escapeXml(layer.d)}" ${styleAttrs} />`;
  } else if (layer.kind === 'rect') {
    shapeSvg = `<rect x="${layer.x ?? 0}" y="${layer.y ?? 0}" width="${layer.width ?? 100}" height="${layer.height ?? 100}" rx="${layer.rx ?? 0}" ${styleAttrs} />`;
  } else if (layer.kind === 'circle') {
    shapeSvg = `<circle cx="${layer.cx ?? 500}" cy="${layer.cy ?? 500}" r="${layer.r ?? 40}" ${styleAttrs} />`;
  } else if (layer.kind === 'ellipse') {
    shapeSvg = `<ellipse cx="${layer.cx ?? 500}" cy="${layer.cy ?? 500}" rx="${layer.rx ?? 60}" ry="${layer.ry ?? 30}" ${styleAttrs} />`;
  } else if (layer.kind === 'polygon' && layer.points) {
    shapeSvg = `<polygon points="${escapeXml(layer.points)}" ${styleAttrs} />`;
  } else if (layer.kind === 'line') {
    shapeSvg = `<line x1="${layer.x1 ?? 0}" y1="${layer.y1 ?? 0}" x2="${layer.x2 ?? 100}" y2="${layer.y2 ?? 100}" ${styleAttrs} />`;
  } else if (layer.kind === 'text' && layer.text) {
    const ff = resolveFontFamily(layer.fontFamily);
    const fs = layer.fontSize ?? 36;
    const fw = layer.fontWeight ?? 600;
    const ta = layer.textAnchor ?? 'middle';
    shapeSvg = `<text x="${layer.x ?? 500}" y="${layer.y ?? 500}" font-family="${ff}" font-size="${fs}" font-weight="${fw}" text-anchor="${ta}" fill="${escapeXml(fillVal === 'none' ? palette.ink : fillVal)}">${escapeXml(layer.text)}</text>`;
  }

  return `<g opacity="${Math.max(0, Math.min(1, op)).toFixed(3)}" transform="${transform}">${shapeSvg}</g>`;
}

/**
 * Renders an entire beat's custom procedural artwork group positioned inside Continuous World Space.
 */
function renderBeatWorldGroup(
  scene: SceneBeat,
  timeSec: number,
  palette: FilmPalette,
  blueprint: VideoBlueprint,
  visibilityOpacity: number,
  cameraDx: number,
  cameraDy: number
): string {
  const localT = Math.max(0, timeSec - scene.startSec);
  const bgLayers: string[] = [];
  const midLayers: string[] = [];
  const fgLayers: string[] = [];

  scene.layers.forEach((layer, idx) => {
    const svg = renderVectorLayerSvg(
      layer,
      localT,
      palette,
      blueprint.aeCraft.layerStagger,
      blueprint.aeCraft.trimPaths,
      idx
    );
    if (!svg) return;
    if (layer.depth === 'bg') bgLayers.push(svg);
    else if (layer.depth === 'fg') fgLayers.push(svg);
    else midLayers.push(svg);
  });

  // Depth parallax offsets derived from camera motion
  const bgShiftX = (-cameraDx * 0.12).toFixed(2);
  const bgShiftY = (-cameraDy * 0.12).toFixed(2);
  const fgShiftX = (cameraDx * 0.1).toFixed(2);
  const fgShiftY = (cameraDy * 0.1).toFixed(2);

  // Beat world origin centers its 1000x1000 artboard at (scene.worldX, scene.worldY)
  const ox = scene.worldX - 500;
  const oy = scene.worldY - 500;

  return `
    <g opacity="${visibilityOpacity.toFixed(3)}" transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})">
      <g transform="translate(${bgShiftX} ${bgShiftY})">${bgLayers.join('')}</g>
      <g>${midLayers.join('')}</g>
      <g transform="translate(${fgShiftX} ${fgShiftY})">${fgLayers.join('')}</g>
    </g>
  `;
}

/**
 * Renders the physical Continuity Thread linking Beat N's world center to Beat N+1's world center
 * so the viewer perceives one unbroken spatial world as the camera moves.
 */
function renderContinuitySpineSvg(
  scenes: SceneBeat[],
  activeIdx: number,
  palette: FilmPalette
): string {
  const parts: string[] = [];
  for (let i = 0; i < scenes.length - 1; i++) {
    // Only render spine segments near the active camera frame so far-offscreen paths stay culled
    if (Math.abs(i - activeIdx) > 1) continue;
    const a = scenes[i];
    const b = scenes[i + 1];
    const mx = (a.worldX + b.worldX) / 2;
    const my = (a.worldY + b.worldY) / 2 - 90;
    const strokeCol = resolveColorToken(b.continuity.bridgeColor || 'accent', palette);
    parts.push(
      `<path d="M ${a.worldX} ${a.worldY} Q ${mx} ${my} ${b.worldX} ${b.worldY}" fill="none" stroke="${strokeCol}" stroke-width="2.5" stroke-dasharray="10 10" opacity="0.34" />`
    );
    parts.push(
      `<circle cx="${a.worldX}" cy="${a.worldY}" r="6" fill="${strokeCol}" opacity="0.34" />`
    );
  }
  return parts.join('');
}

/**
 * Renders optional bottom-safe 4-word Luxury Reel Captions locked to word timestamps.
 */
function renderSubtitlesSvg(
  scene: SceneBeat,
  timeSec: number,
  width: number,
  height: number,
  palette: FilmPalette
): string {
  const words = scene.words;
  if (!words.length) return '';

  let currentWordIdx = 0;
  for (let i = 0; i < words.length; i++) {
    if (timeSec >= words[i].startSec) currentWordIdx = i;
  }

  const groupSize = width < height ? 4 : 6;
  const groupStart = Math.floor(currentWordIdx / groupSize) * groupSize;
  const chunk = words.slice(groupStart, groupStart + groupSize);
  if (!chunk.length) return '';

  const isVertical = height > width;
  const capY = isVertical ? height * 0.875 : height * 0.885;
  const fontSize = isVertical ? 28 : 30;
  const barW = Math.min(width * 0.86, chunk.map((w) => w.word).join(' ').length * (fontSize * 0.62) + 54);
  const barH = fontSize + 28;

  const tspans = chunk
    .map((w, idx) => {
      const globalIdx = groupStart + idx;
      const isSpoken = globalIdx <= currentWordIdx;
      const isCurrent = globalIdx === currentWordIdx;
      const color = isCurrent
        ? palette.accent
        : isSpoken
          ? palette.ink
          : palette.muted;
      return `<tspan fill="${color}" font-weight="${isCurrent || w.emphasis ? 700 : 500}">${escapeXml(w.word)}${idx < chunk.length - 1 ? ' ' : ''}</tspan>`;
    })
    .join('');

  return `
    <g>
      <rect x="${((width - barW) / 2).toFixed(1)}" y="${(capY - barH / 2 - 4).toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" rx="12" fill="${palette.captionBg}" stroke="${palette.hairline}" stroke-width="1" />
      <text x="${(width / 2).toFixed(1)}" y="${(capY + fontSize * 0.24).toFixed(1)}" font-family="${resolveFontFamily('sans')}" font-size="${fontSize}" text-anchor="middle">${tspans}</text>
    </g>
  `;
}

/**
 * Pure deterministic Universal Continuous Film SVG Frame Builder.
 * Identical math powers BOTH live browser preview AND local Antigravity @resvg/resvg-js + FFmpeg rendering.
 */
export function buildFilmFrameSvg(
  blueprint: VideoBlueprint,
  timeSec: number,
  width: number,
  height: number
): { svg: string; camera: ContinuousCameraState } {
  const camera = computeContinuousCamera(blueprint.scenes, timeSec);
  const scene = camera.activeScene;
  const { palette } = resolveFilmPalette(blueprint.paletteMode, scene.palettePolarity);
  const isVertical = height > width;
  const localT = Math.max(0, timeSec - scene.startSec);

  // Scale the 1000x1000 stage comfortably inside 16:9 or 9:16 framing
  const baseStageScale = isVertical ? (width / 1000) * 0.94 : (height / 1000) * 0.78;
  const effectiveScale = baseStageScale * camera.zoom;

  // World-to-screen camera transform
  const cx = width / 2;
  const cy = isVertical ? height * 0.50 : height * 0.53;
  const cameraTransform = `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${camera.rotate.toFixed(2)}) scale(${effectiveScale.toFixed(4)}) translate(${(-camera.worldX).toFixed(1)} ${(-camera.worldY).toFixed(1)})`;

  // Render active scene + neighboring scenes so continuous camera pans/zoom-throughs reveal real artwork in world space!
  const visibleIndices = new Set<number>([camera.activeSceneIndex]);
  if (camera.activeSceneIndex > 0) visibleIndices.add(camera.activeSceneIndex - 1);
  if (camera.nextSceneIndex !== null) visibleIndices.add(camera.nextSceneIndex);

  const worldGroups: string[] = [];
  visibleIndices.forEach((idx) => {
    const s = blueprint.scenes[idx];
    let op = 1;
    if (idx === camera.activeSceneIndex - 1) {
      // Gently fade previous beat out during the first 0.55s after camera arrives
      op = 1 - aeSpeedGraphEase(clampInterpolate(localT, 0, 0.55, 0, 1));
    } else if (idx === camera.nextSceneIndex) {
      // Next beat wakes up smoothly during the continuity handoff bridge
      op = camera.bridgeProgress > 0.01 ? 0.15 + camera.bridgeProgress * 0.85 : 0.14;
    } else if (camera.nextSceneIndex !== null && camera.bridgeProgress > 0) {
      op = 1 - camera.bridgeProgress * 0.55;
    }

    if (op > 0.01) {
      const dx = camera.worldX - s.worldX;
      const dy = camera.worldY - s.worldY;
      worldGroups.push(renderBeatWorldGroup(s, timeSec, palette, blueprint, op, dx, dy));
    }
  });

  // Subtle architectural grid drifting continuously in world space
  const gridOffsetX = ((-camera.worldX * 0.25) % 80).toFixed(1);
  const gridOffsetY = ((-camera.worldY * 0.25) % 80).toFixed(1);

  // Editorial top header (Alpha Track Matte reveal)
  const headEase = aeSpeedGraphEase(clampInterpolate(localT, 0.04, 0.52, 0, 1));
  const headSlideY = blueprint.aeCraft.trackMattes ? (1 - headEase) * 28 : 0;
  const padX = isVertical ? 40 : 54;
  const topY = isVertical ? 54 : 46;
  const headlineSize = isVertical ? 32 : 34;

  // Progress hairline along top edge
  const totalPct = blueprint.totalPreviewSec > 0
    ? Math.max(0, Math.min(1, timeSec / blueprint.totalPreviewSec))
    : 0;

  const subtitlesMarkup = blueprint.subtitlesEnabled
    ? renderSubtitlesSvg(scene, timeSec, width, height, palette)
    : '';

  // Optional Five-Layer grain + subtle vignette
  const atmosphereOverlay = blueprint.aeCraft.fiveLayerStack
    ? `<rect x="0" y="0" width="${width}" height="${height}" fill="url(#vignetteGrad)" pointer-events="none" />`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(scene.headline)}">
  <defs>
    <linearGradient id="filmBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${palette.bgTop}" />
      <stop offset="100%" stop-color="${palette.bgBottom}" />
    </linearGradient>
    <radialGradient id="vignetteGrad" cx="50%" cy="50%" r="72%">
      <stop offset="55%" stop-color="rgba(0,0,0,0)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.16)" />
    </radialGradient>
    <pattern id="worldGrid" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="translate(${gridOffsetX} ${gridOffsetY})">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="${palette.hairline}" stroke-width="1" />
    </pattern>
    <clipPath id="headerMatte">
      <rect x="${padX - 6}" y="${topY - 22}" width="${width - padX * 2 + 12}" height="96" />
    </clipPath>
  </defs>

  <!-- Layer 1: Continuous Textured Backdrop & Parallax World Grid -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#filmBg)" />
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#worldGrid)" opacity="0.55" />

  <!-- Layer 2: Continuous Infinite World Camera Stage (Unbroken Across All Beats) -->
  <g transform="${cameraTransform}">
    ${renderContinuitySpineSvg(blueprint.scenes, camera.activeSceneIndex, palette)}
    ${worldGroups.join('')}
  </g>

  <!-- Layer 3: Editorial Chapter & Headline Track Matte -->
  <g clip-path="url(#headerMatte)">
    <g transform="translate(0 ${headSlideY.toFixed(2)})" opacity="${headEase.toFixed(3)}">
      <text x="${padX}" y="${topY}" font-family="${resolveFontFamily('mono')}" font-size="13" font-weight="500" fill="${palette.accent}">${escapeXml(scene.chapter)}</text>
      <text x="${padX}" y="${topY + headlineSize + 6}" font-family="${resolveFontFamily('editorial')}" font-size="${headlineSize}" font-weight="600" fill="${palette.ink}">${escapeXml(scene.headline)}</text>
    </g>
  </g>

  <!-- Layer 4: Optional Bottom-Safe Luxury Reel Captions -->
  ${subtitlesMarkup}

  <!-- Layer 5: Vignette & Precision Timeline Hairline -->
  ${atmosphereOverlay}
  <rect x="0" y="0" width="${width}" height="3" fill="${palette.hairline}" />
  <rect x="0" y="0" width="${(width * totalPct).toFixed(1)}" height="3" fill="${palette.accent}" />
</svg>`;

  return { svg, camera };
}

/**
 * Renders a crisp static thumbnail SVG of a single beat's bespoke procedural artwork
 * for the Step 2 Script & Visual Direction Review board.
 */
export function buildBeatThumbnailSvg(
  scene: SceneBeat,
  paletteMode: PaletteMode
): string {
  const { palette } = resolveFilmPalette(paletteMode, scene.palettePolarity);
  const settleTime = Math.min(scene.durationSec * 0.72, 2.8);
  const layersMarkup = scene.layers
    .map((layer, idx) => renderVectorLayerSvg(layer, settleTime, palette, false, false, idx))
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%" role="img" aria-label="${escapeXml(scene.visualConcept)}">
  <defs>
    <linearGradient id="thumbBg-${escapeXml(scene.id)}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${palette.bgTop}" />
      <stop offset="100%" stop-color="${palette.bgBottom}" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1000" height="1000" fill="url(#thumbBg-${escapeXml(scene.id)})" />
  ${layersMarkup}
</svg>`;
}
