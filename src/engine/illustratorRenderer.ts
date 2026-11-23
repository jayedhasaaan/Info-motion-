import {
  aeSnappyExit,
  aeSpeedGraphEase,
  clampInterpolate,
  idleBreath,
  springCurve,
  staggerDelay,
  trimPathProgress,
} from './motionMath';
import type {
  AeCraftOptions,
  PaletteMode,
  SceneBeat,
  VideoBlueprint,
  ViralMoment,
  VisualObjectId,
} from '../types/engine';

interface LuxuryPalette {
  bgTop: string;
  bgBottom: string;
  surface: string;
  surfaceAlt: string;
  hairline: string;
  ink: string;
  inkMuted: string;
  gold: string;
  goldLight: string;
  goldDark: string;
  emerald: string;
  crimson: string;
  shadow: string;
  grainAlpha: number;
}

const LIGHT_LUXURY: LuxuryPalette = {
  bgTop: '#FAF8F3',
  bgBottom: '#EFEAE0',
  surface: '#FFFFFF',
  surfaceAlt: '#F3EFE6',
  hairline: 'rgba(19, 23, 21, 0.12)',
  ink: '#131715',
  inkMuted: '#5A625D',
  gold: '#A67C37',
  goldLight: '#DFC07F',
  goldDark: '#75531B',
  emerald: '#0F6B4E',
  crimson: '#B53D32',
  shadow: 'rgba(19, 23, 21, 0.11)',
  grainAlpha: 0.032,
};

const DARK_LUXURY: LuxuryPalette = {
  bgTop: '#131816',
  bgBottom: '#0A0D0C',
  surface: '#181F1C',
  surfaceAlt: '#1F2824',
  hairline: 'rgba(244, 241, 234, 0.12)',
  ink: '#F4F1EA',
  inkMuted: '#9AA49E',
  gold: '#D4AF6A',
  goldLight: '#F1D9A5',
  goldDark: '#8D6B2E',
  emerald: '#2BB682',
  crimson: '#E05A47',
  shadow: 'rgba(0, 0, 0, 0.45)',
  grainAlpha: 0.045,
};

export function resolveScenePalette(
  mode: PaletteMode,
  scenePolarity: 'light' | 'dark'
): { palette: LuxuryPalette; isDark: boolean } {
  const isDark = mode === 'dark' ? true : mode === 'light' ? false : scenePolarity === 'dark';
  return { palette: isDark ? DARK_LUXURY : LIGHT_LUXURY, isDark };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Progressive Illustrator Trim Path polyline drawer.
 */
function drawTrimmedPath(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  progress: number
) {
  if (points.length < 2 || progress <= 0) return;
  const segments: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    const len = Math.hypot(dx, dy);
    segments.push(len);
    total += len;
  }
  const targetLen = total * Math.max(0, Math.min(1, progress));
  let drawn = 0;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const segLen = segments[i - 1];
    if (drawn + segLen <= targetLen) {
      ctx.lineTo(points[i][0], points[i][1]);
      drawn += segLen;
    } else {
      const remain = Math.max(0, targetLen - drawn);
      const ratio = segLen > 0 ? remain / segLen : 0;
      const nx = points[i - 1][0] + (points[i][0] - points[i - 1][0]) * ratio;
      const ny = points[i - 1][1] + (points[i][1] - points[i - 1][1]) * ratio;
      ctx.lineTo(nx, ny);
      break;
    }
  }
  ctx.stroke();
}

/**
 * Draws any of the 10 Adobe Illustrator multi-layer non-human real-world money objects.
 * Supports toggling Trim Paths, Track Mattes, and 3-5f Layer Stagger live.
 */
export function drawIllustratorMoneyObject(
  ctx: CanvasRenderingContext2D,
  objectId: VisualObjectId,
  cx: number,
  cy: number,
  radius: number,
  localTime: number,
  palette: LuxuryPalette,
  craft: AeCraftOptions
) {
  const sDelay = (idx: number) => (craft.layerStagger ? staggerDelay(idx, 4, 60) : 0);
  const trim = (idx: number, dur = 0.85) =>
    craft.trimPaths ? trimPathProgress(localTime, sDelay(idx), dur) : 1;
  const breath = idleBreath(localTime, radius * 0.028, 0.42);

  ctx.save();
  ctx.translate(cx, cy + breath);

  // Architectural drafting halo behind every Illustrator object
  const ringP = trim(0, 0.9);
  ctx.save();
  ctx.strokeStyle = palette.hairline;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.08, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ringP);
  ctx.stroke();
  ctx.setLineDash([4, 7]);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.86, 0, Math.PI * 2 * ringP);
  ctx.stroke();
  ctx.restore();

  switch (objectId) {
    case 'sovereign-coins': {
      // Multi-layer sovereign gold bullion stack with extruded milled rims & specular gleam
      const coinCount = 5;
      const coinW = radius * 1.24;
      const coinH = radius * 0.34;
      for (let i = 0; i < coinCount; i++) {
        const drop = springCurve(localTime - sDelay(i), 155, 16, 1);
        const yOff = radius * 0.56 - i * (radius * 0.24) - (1 - drop) * radius * 0.9;
        const alpha = clampInterpolate(localTime, sDelay(i), sDelay(i) + 0.16, 0, 1);
        ctx.save();
        ctx.globalAlpha = alpha;
        // Layer 1: Cast shadow
        if (i === 0) {
          ctx.fillStyle = palette.shadow;
          ctx.beginPath();
          ctx.ellipse(0, yOff + coinH * 0.72, coinW * 0.58, coinH * 0.48, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        // Layer 2: Extruded milled rim
        const rimGrad = ctx.createLinearGradient(-coinW / 2, 0, coinW / 2, 0);
        rimGrad.addColorStop(0, palette.goldDark);
        rimGrad.addColorStop(0.45, palette.goldLight);
        rimGrad.addColorStop(1, palette.goldDark);
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.ellipse(0, yOff + coinH * 0.28, coinW * 0.5, coinH * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-coinW * 0.5, yOff, coinW, coinH * 0.28);

        // Layer 3: Brushed gold face
        const faceGrad = ctx.createLinearGradient(-coinW / 2, yOff - coinH, coinW / 2, yOff + coinH);
        faceGrad.addColorStop(0, palette.goldLight);
        faceGrad.addColorStop(0.55, palette.gold);
        faceGrad.addColorStop(1, palette.goldDark);
        ctx.fillStyle = faceGrad;
        ctx.beginPath();
        ctx.ellipse(0, yOff, coinW * 0.5, coinH * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();

        // Layer 4: Illustrator engraved inner ring + monogram
        ctx.strokeStyle = palette.surface;
        ctx.globalAlpha = alpha * 0.65;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(0, yOff, coinW * 0.39, coinH * 0.31, 0, 0, Math.PI * 2 * trim(i + 1, 0.5));
        ctx.stroke();
        ctx.restore();
      }
      break;
    }

    case 'compound-staircase': {
      // Stepped architectural risers + Trim-Path exponential gold curve
      const bars = [0.16, 0.24, 0.36, 0.54, 0.82, 1.12];
      const baseLeft = -radius * 0.84;
      const baseBottom = radius * 0.68;
      const barW = (radius * 1.56) / bars.length - 10;
      const curvePts: Array<[number, number]> = [];

      // Baseline axis
      ctx.strokeStyle = palette.hairline;
      ctx.lineWidth = 1.8;
      drawTrimmedPath(ctx, [[baseLeft - 12, baseBottom], [radius * 0.88, baseBottom]], trim(0, 0.5));

      bars.forEach((hFactor, i) => {
        const sp = springCurve(localTime - sDelay(i), 140, 17, 1);
        const h = radius * 1.18 * hFactor * sp;
        const x = baseLeft + i * (barW + 10);
        const y = baseBottom - h;

        // Cast depth
        ctx.fillStyle = palette.shadow;
        drawRoundedRect(ctx, x + 5, y + 6, barW, Math.max(2, h), 4);
        ctx.fill();

        // Main riser
        ctx.fillStyle = i === bars.length - 1 ? palette.emerald : palette.surface;
        ctx.strokeStyle = i === bars.length - 1 ? palette.emerald : palette.hairline;
        ctx.lineWidth = 1.5;
        drawRoundedRect(ctx, x, y, barW, Math.max(2, h), 4);
        ctx.fill();
        ctx.stroke();

        // Gold top cap bevel
        ctx.fillStyle = i === bars.length - 1 ? palette.goldLight : palette.gold;
        ctx.fillRect(x, y, barW, Math.min(4, Math.max(2, h)));

        curvePts.push([x + barW / 2, y - 14]);
      });

      // Exponential Illustrator Trim Path curve
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      drawTrimmedPath(ctx, curvePts, trim(3, 1.05));

      // Summit diamond beacon
      if (curvePts.length > 0 && trim(4, 0.6) > 0.6) {
        const [sx, sy] = curvePts[curvePts.length - 1];
        ctx.fillStyle = palette.gold;
        ctx.beginPath();
        ctx.arc(sx, sy, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = palette.surface;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      break;
    }

    case 'eroding-banknote': {
      // Engraved cotton-linen banknote with Alpha Track Matte inflation erosion wipe
      const w = radius * 1.66;
      const h = radius * 0.94;
      const enter = springCurve(localTime - sDelay(0), 130, 16, 1);
      const erosion = clampInterpolate(localTime, 0.55, 3.2, 0.04, 0.38);

      ctx.save();
      ctx.scale(0.84 + 0.16 * enter, 0.84 + 0.16 * enter);

      // Layer 1: Cast paper shadow
      ctx.fillStyle = palette.shadow;
      drawRoundedRect(ctx, -w / 2 + 8, -h / 2 + 12, w, h, 8);
      ctx.fill();

      // Layer 2: Preserved banknote surface (Track Matte clipped)
      const splitX = w / 2 - w * erosion;
      ctx.save();
      if (craft.trackMattes) {
        ctx.beginPath();
        ctx.rect(-w / 2 - 4, -h / 2 - 4, w * (1 - erosion) + 4, h + 8);
        ctx.clip();
      }
      ctx.fillStyle = palette.surface;
      ctx.strokeStyle = palette.emerald;
      ctx.lineWidth = 2.4;
      drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 8);
      ctx.fill();
      ctx.stroke();

      // Inner engraved Illustrator border
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 1.25;
      drawRoundedRect(ctx, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 4);
      ctx.stroke();

      // Guilloche center medallion
      ctx.strokeStyle = palette.emerald;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, h * 0.3, 0, Math.PI * 2 * trim(1, 0.75));
      ctx.stroke();
      ctx.fillStyle = palette.ink;
      ctx.font = `600 ${Math.round(h * 0.3)}px "Playfair Display", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 2);
      ctx.restore();

      // Layer 3: Eroded ghost zone (crimson hatched purchasing loss)
      ctx.save();
      ctx.strokeStyle = palette.crimson;
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.8;
      drawRoundedRect(ctx, splitX, -h / 2, w * erosion, h, 6);
      ctx.stroke();
      ctx.fillStyle = `${palette.crimson}22`;
      ctx.fill();

      // Active laser erosion line
      ctx.setLineDash([]);
      ctx.strokeStyle = palette.crimson;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(splitX, -h / 2 - 14);
      ctx.lineTo(splitX, h / 2 + 14);
      ctx.stroke();
      ctx.restore();
      ctx.restore();
      break;
    }

    case 'watch-escapement': {
      // Luxury horological bezel + interlocking rotating brass gears
      const enter = springCurve(localTime - sDelay(0), 135, 16, 1);
      ctx.save();
      ctx.scale(enter, enter);

      // Outer watch case shadow & metallic bezel
      ctx.fillStyle = palette.shadow;
      ctx.beginPath();
      ctx.arc(6, 10, radius * 0.78, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = palette.surface;
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.76, 0, Math.PI * 2 * trim(0, 0.7));
      ctx.fill();
      ctx.stroke();

      // Hour baton indices
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const r1 = radius * (i % 3 === 0 ? 0.58 : 0.63);
        const r2 = radius * 0.69;
        ctx.strokeStyle = i % 3 === 0 ? palette.gold : palette.inkMuted;
        ctx.lineWidth = i % 3 === 0 ? 2.6 : 1.3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
        ctx.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
        ctx.stroke();
      }

      // Rotating inner brass gear
      const drawGear = (gx: number, gy: number, gr: number, teeth: number, rot: number, col: string) => {
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(rot);
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let t = 0; t < teeth * 2; t++) {
          const a = (t / (teeth * 2)) * Math.PI * 2;
          const rr = t % 2 === 0 ? gr : gr * 0.82;
          if (t === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
          else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, gr * 0.32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      drawGear(-radius * 0.16, radius * 0.14, radius * 0.25, 10, localTime * 0.9, palette.gold);
      drawGear(radius * 0.22, -radius * 0.14, radius * 0.18, 8, -localTime * 1.15, palette.emerald);

      // Sweeping luxury hand
      const secAngle = -Math.PI / 2 + localTime * 1.45;
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(secAngle * 0.25 - 0.6) * radius * 0.36, Math.sin(secAngle * 0.25 - 0.6) * radius * 0.36);
      ctx.stroke();

      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(secAngle) * radius * 0.54, Math.sin(secAngle) * radius * 0.54);
      ctx.stroke();

      ctx.fillStyle = palette.gold;
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'credit-trap-ledger': {
      // Matte dark metallic credit card + rising compound APR warning rings
      const w = radius * 1.56;
      const h = radius * 0.98;
      const sp = springCurve(localTime - sDelay(0), 145, 15, 1);

      ctx.save();
      ctx.rotate(-0.08 * sp);
      ctx.scale(0.85 + 0.15 * sp, 0.85 + 0.15 * sp);

      // Expanding crimson APR shockwaves behind card
      for (let k = 0; k < 2; k++) {
        const pulse = (localTime * 0.7 + k * 0.5) % 1;
        ctx.strokeStyle = palette.crimson;
        ctx.globalAlpha = (1 - pulse) * 0.45;
        ctx.lineWidth = 2;
        drawRoundedRect(
          ctx,
          -w / 2 - pulse * 24,
          -h / 2 - pulse * 24,
          w + pulse * 48,
          h + pulse * 48,
          14
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Shadow
      ctx.fillStyle = palette.shadow;
      drawRoundedRect(ctx, -w / 2 + 8, -h / 2 + 12, w, h, 12);
      ctx.fill();

      // Card surface
      ctx.fillStyle = palette.surface;
      ctx.strokeStyle = palette.crimson;
      ctx.lineWidth = 2.2;
      drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 12);
      ctx.fill();
      ctx.stroke();

      // Metallic EMV chip
      ctx.fillStyle = palette.gold;
      drawRoundedRect(ctx, -w / 2 + 22, -h / 2 + 24, 34, 24, 4);
      ctx.fill();

      // Rising interest vector curve inside card
      const pts: Array<[number, number]> = [
        [-w * 0.34, h * 0.32],
        [-w * 0.12, h * 0.25],
        [w * 0.1, h * 0.08],
        [w * 0.34, -h * 0.26],
      ];
      ctx.strokeStyle = palette.crimson;
      ctx.lineWidth = 3;
      drawTrimmedPath(ctx, pts, trim(2, 0.9));

      ctx.fillStyle = palette.crimson;
      ctx.font = `600 13px "IBM Plex Mono", monospace`;
      ctx.textAlign = 'right';
      ctx.fillText('24.9% APR', w / 2 - 20, h / 2 - 18);
      ctx.restore();
      break;
    }

    case 'vault-dial': {
      // Heavy concentric bank vault door with spring-locked dial & radial bolts
      const enter = springCurve(localTime - sDelay(0), 125, 16, 1);
      const dialRot = aeSpeedGraphEase(clampInterpolate(localTime, 0.25, 1.85, 0, 1)) * Math.PI * 1.45;
      ctx.save();
      ctx.scale(enter, enter);

      // Vault chassis
      ctx.fillStyle = palette.shadow;
      drawRoundedRect(ctx, -radius * 0.78 + 8, -radius * 0.78 + 12, radius * 1.56, radius * 1.56, 22);
      ctx.fill();

      ctx.fillStyle = palette.surface;
      ctx.strokeStyle = palette.hairline;
      ctx.lineWidth = 2.4;
      drawRoundedRect(ctx, -radius * 0.78, -radius * 0.78, radius * 1.56, radius * 1.56, 22);
      ctx.fill();
      ctx.stroke();

      // Concentric gold dial ring
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.48, 0, Math.PI * 2 * trim(1, 0.75));
      ctx.stroke();

      // Rotating locking spokes
      ctx.save();
      ctx.rotate(dialRot);
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.strokeStyle = palette.ink;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * radius * 0.14, Math.sin(a) * radius * 0.14);
        ctx.lineTo(Math.cos(a) * radius * 0.44, Math.sin(a) * radius * 0.44);
        ctx.stroke();
      }
      ctx.fillStyle = palette.emerald;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.restore();
      break;
    }

    case 'asset-balance-scale': {
      // Classical brass balance beam tilting toward sovereign assets
      const tilt = springCurve(localTime - 0.35, 95, 11, 1) * -0.18;
      // Fulcrum pillar
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 4;
      drawTrimmedPath(ctx, [[0, radius * 0.65], [0, -radius * 0.42]], trim(0, 0.6));
      drawTrimmedPath(ctx, [[-radius * 0.42, radius * 0.65], [radius * 0.42, radius * 0.65]], trim(0, 0.5));

      ctx.save();
      ctx.translate(0, -radius * 0.35);
      ctx.rotate(tilt);

      // Beam
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 3.5;
      drawTrimmedPath(ctx, [[-radius * 0.74, 0], [radius * 0.74, 0]], trim(1, 0.6));

      // Left pan (Emerald Assets - heavier)
      const drawPan = (px: number, col: string, label: string, blocks: number) => {
        ctx.strokeStyle = palette.hairline;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px - 26, radius * 0.48);
        ctx.moveTo(px, 0);
        ctx.lineTo(px + 26, radius * 0.48);
        ctx.stroke();

        ctx.fillStyle = col;
        drawRoundedRect(ctx, px - 34, radius * 0.48, 68, 9, 4);
        ctx.fill();

        for (let b = 0; b < blocks; b++) {
          ctx.fillStyle = b === blocks - 1 ? palette.gold : col;
          drawRoundedRect(ctx, px - 22, radius * 0.48 - 14 - b * 14, 44, 11, 2);
          ctx.fill();
        }
        ctx.fillStyle = palette.inkMuted;
        ctx.font = `600 11px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(label, px, radius * 0.68);
      };

      drawPan(-radius * 0.66, palette.emerald, 'ASSETS', 3);
      drawPan(radius * 0.66, palette.crimson, 'DEBT', 1);
      ctx.restore();
      break;
    }

    case 'statement-scanner': {
      // Archival bank statement with animated crimson fee-leak audit scanner bar
      const w = radius * 1.24;
      const h = radius * 1.48;
      const enter = springCurve(localTime - sDelay(0), 140, 17, 1);
      const scanY = -h * 0.34 + ((Math.sin(localTime * 1.8) + 1) / 2) * h * 0.68;

      ctx.save();
      ctx.scale(enter, enter);
      ctx.fillStyle = palette.shadow;
      drawRoundedRect(ctx, -w / 2 + 7, -h / 2 + 10, w, h, 8);
      ctx.fill();

      ctx.fillStyle = palette.surface;
      ctx.strokeStyle = palette.hairline;
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 8);
      ctx.fill();
      ctx.stroke();

      // Statement ledger rows
      for (let r = 0; r < 5; r++) {
        const ry = -h * 0.32 + r * (h * 0.16);
        const isLeak = r === 2 || r === 3;
        ctx.fillStyle = isLeak ? `${palette.crimson}22` : palette.surfaceAlt;
        drawRoundedRect(ctx, -w * 0.4, ry - 10, w * 0.8, 22, 4);
        ctx.fill();
        ctx.fillStyle = isLeak ? palette.crimson : palette.inkMuted;
        ctx.fillRect(-w * 0.34, ry - 2, w * 0.36, 4);
        ctx.fillRect(w * 0.16, ry - 2, w * 0.18, 4);
      }

      // Active scanner bar
      ctx.strokeStyle = palette.crimson;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-w * 0.56, scanY);
      ctx.lineTo(w * 0.56, scanY);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'property-blueprint': {
      // Architectural isometric real-estate elevation drafted via Illustrator Trim Paths
      const s = radius * 0.72;
      const p1 = trim(0, 0.8);
      const p2 = trim(2, 0.9);

      // Isometric wireframe structure
      const outline: Array<[number, number]> = [
        [0, -s],
        [s * 0.92, -s * 0.42],
        [s * 0.92, s * 0.55],
        [0, s * 0.98],
        [-s * 0.92, s * 0.55],
        [-s * 0.92, -s * 0.42],
        [0, -s],
      ];

      ctx.fillStyle = `${palette.gold}18`;
      ctx.beginPath();
      outline.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
      ctx.fill();

      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 2.6;
      drawTrimmedPath(ctx, outline, p1);

      // Interior architectural elevation lines
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.8;
      drawTrimmedPath(ctx, [[0, -s * 0.02], [0, s * 0.98]], p2);
      drawTrimmedPath(ctx, [[-s * 0.92, -s * 0.42], [0, -s * 0.02], [s * 0.92, -s * 0.42]], p2);

      // Equity progress fill bar inside right facade
      const fillH = s * 0.7 * aeSpeedGraphEase(clampInterpolate(localTime, 0.45, 1.5, 0, 1));
      ctx.fillStyle = `${palette.emerald}44`;
      ctx.beginPath();
      ctx.moveTo(4, s * 0.92);
      ctx.lineTo(s * 0.86, s * 0.52);
      ctx.lineTo(s * 0.86, s * 0.52 - fillH);
      ctx.lineTo(4, s * 0.92 - fillH);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'split-ledger-compare': {
      // Side-by-side luxury wealth ledger contrasting idle cash vs sovereign compounding
      const w = radius * 1.72;
      const h = radius * 1.12;
      const enter = springCurve(localTime - sDelay(0), 135, 16, 1);
      ctx.save();
      ctx.scale(enter, enter);

      // Left column (Idle / Erosion)
      ctx.fillStyle = palette.surface;
      ctx.strokeStyle = palette.hairline;
      ctx.lineWidth = 1.8;
      drawRoundedRect(ctx, -w / 2, -h / 2, w * 0.47, h, 8);
      ctx.fill();
      ctx.stroke();

      // Right column (Compounding / Wealth)
      ctx.fillStyle = palette.surface;
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 2.2;
      drawRoundedRect(ctx, w * 0.03, -h / 2, w * 0.47, h, 8);
      ctx.fill();
      ctx.stroke();

      const leftBar = h * 0.24 * trim(1, 0.7);
      const rightBar = h * 0.66 * trim(2, 0.95);

      ctx.fillStyle = palette.crimson;
      drawRoundedRect(ctx, -w * 0.38, h * 0.36 - leftBar, w * 0.24, Math.max(4, leftBar), 4);
      ctx.fill();

      ctx.fillStyle = palette.emerald;
      drawRoundedRect(ctx, w * 0.14, h * 0.36 - rightBar, w * 0.24, Math.max(4, rightBar), 4);
      ctx.fill();

      ctx.fillStyle = palette.inkMuted;
      ctx.font = `600 11px "IBM Plex Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('IDLE CASH', -w * 0.26, -h * 0.3);
      ctx.fillStyle = palette.gold;
      ctx.fillText('COMPOUNDED', w * 0.26, -h * 0.3);
      ctx.restore();
      break;
    }
  }

  ctx.restore();
}

/**
 * Interpolates displayed financial metric counter smoothly (e.g. $10,000 -> $46,610).
 */
function interpolateMetricLabel(startStr: string, endStr: string, progress: number): string {
  const numRegex = /-?\d[\d,]*(?:\.\d+)?/;
  const m1 = startStr.match(numRegex);
  const m2 = endStr.match(numRegex);
  if (!m1 || !m2) {
    return progress < 0.45 ? startStr : endStr;
  }
  const n1 = parseFloat(m1[0].replace(/,/g, ''));
  const n2 = parseFloat(m2[0].replace(/,/g, ''));
  if (!Number.isFinite(n1) || !Number.isFinite(n2)) return endStr;

  const hasDecimal = m2[0].includes('.');
  const val = n1 + (n2 - n1) * progress;
  const formatted = hasDecimal
    ? val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : Math.round(val).toLocaleString('en-US');

  return endStr.replace(m2[0], formatted);
}

/**
 * Renders a complete deterministic 60fps broadcast frame of the active VideoBlueprint
 * using the Five-Layer Cinematic Stack, Illustrator Trim Paths, Alpha Track Mattes,
 * After Effects Speed Graph camera motion, and optional luxury Reel captions.
 */
export function renderMotionBlueprintFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  blueprint: VideoBlueprint,
  playheadSec: number
): { activeSceneIndex: number; activeScene: SceneBeat } {
  const scenes = blueprint.scenes;
  let activeSceneIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    if (playheadSec >= scenes[i].startSec) activeSceneIndex = i;
  }
  const scene = scenes[activeSceneIndex] ?? scenes[0];
  const localTime = Math.max(0, playheadSec - scene.startSec);
  const timeLeft = Math.max(0, scene.durationSec - localTime);
  const isVertical = blueprint.aspectRatio === '9:16';

  const { palette } = resolveScenePalette(blueprint.paletteMode, scene.palettePolarity);
  const craft = blueprint.aeCraft;

  ctx.save();

  // =========================================================================
  // LAYER 1: Ambient Textured Luxury Background (Never a flat solid color)
  // =========================================================================
  const bgGrad = ctx.createLinearGradient(0, 0, width * 0.4, height);
  bgGrad.addColorStop(0, palette.bgTop);
  bgGrad.addColorStop(1, palette.bgBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  if (craft.fiveLayerStack) {
    // Subtle architectural drafting ledger lines drifting gently
    const driftX = (playheadSec * 8) % 48;
    ctx.strokeStyle = palette.hairline;
    ctx.globalAlpha = 0.38;
    ctx.lineWidth = 1;
    const step = isVertical ? 56 : 72;
    for (let x = -step + driftX; x < width + step; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Soft ambient warm gold radial studio key light
    const radial = ctx.createRadialGradient(
      width * 0.5,
      height * (isVertical ? 0.44 : 0.48),
      10,
      width * 0.5,
      height * 0.48,
      Math.max(width, height) * 0.65
    );
    radial.addColorStop(0, `${palette.gold}1A`);
    radial.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  }

  // =========================================================================
  // CAMERA RIG + ASYMMETRIC ENTRANCE / SNAPPY EXIT + 240° MOTION BLUR
  // =========================================================================
  const enterProgress = aeSpeedGraphEase(clampInterpolate(localTime, 0, 0.55, 0, 1));
  const exitProgress = timeLeft < 0.22 ? aeSnappyExit(1 - timeLeft / 0.22) : 0;

  let camScale = 1;
  let camX = 0;
  let camY = 0;
  const sceneNorm = clampInterpolate(localTime, 0, scene.durationSec, 0, 1);

  if (scene.cameraMove === 'push-in') camScale = 1 + sceneNorm * 0.055;
  else if (scene.cameraMove === 'pull-back') camScale = 1.06 - sceneNorm * 0.055;
  else if (scene.cameraMove === 'pan-right') camX = (sceneNorm - 0.5) * -22;
  else if (scene.cameraMove === 'whip-cut') camX = (1 - enterProgress) * 90;

  if (exitProgress > 0) {
    camY -= exitProgress * 22;
  }

  ctx.save();
  ctx.translate(width / 2 + camX, height / 2 + camY);
  ctx.scale(camScale, camScale);
  ctx.translate(-width / 2, -height / 2);

  // Subtle 240° shutter-angle directional ghost trail during rapid entrance/exit
  const inMotionWindow = (localTime < 0.22 || timeLeft < 0.18) && craft.motionBlur;

  // =========================================================================
  // LAYER 2: Multi-Layer Adobe Illustrator Vector Object
  // =========================================================================
  const objCx = isVertical ? width * 0.5 : width * 0.68;
  const objCy = isVertical ? height * 0.46 : height * 0.5;
  const objRadius = isVertical ? Math.min(width, height) * 0.28 : Math.min(width, height) * 0.29;

  if (inMotionWindow) {
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.translate(10 * (1 - enterProgress + exitProgress), 0);
    drawIllustratorMoneyObject(ctx, scene.visualObject, objCx, objCy, objRadius, localTime, palette, craft);
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = 1 - exitProgress * 0.85;
  drawIllustratorMoneyObject(ctx, scene.visualObject, objCx, objCy, objRadius, localTime, palette, craft);
  ctx.restore();

  // =========================================================================
  // LAYER 3: Editorial Kinetic Typography & Animated Metric Counter (Track Matte)
  // =========================================================================
  const padX = isVertical ? width * 0.085 : width * 0.075;
  const textMaxW = isVertical ? width * 0.83 : width * 0.44;
  const headerY = isVertical ? height * 0.12 : height * 0.24;

  // Chapter kicker + hairline rule
  const kickerP = aeSpeedGraphEase(clampInterpolate(localTime, 0.04, 0.45, 0, 1));
  ctx.save();
  ctx.globalAlpha = kickerP * (1 - exitProgress);
  ctx.fillStyle = palette.gold;
  ctx.font = `600 ${isVertical ? 14 : 15}px "IBM Plex Mono", monospace`;
  ctx.textAlign = isVertical ? 'center' : 'left';
  ctx.fillText(scene.chapter, isVertical ? width / 2 : padX, headerY);

  // Trim path divider rule under chapter
  ctx.strokeStyle = palette.gold;
  ctx.lineWidth = 1.5;
  const ruleW = 72 * (craft.trimPaths ? kickerP : 1);
  ctx.beginPath();
  if (isVertical) {
    ctx.moveTo(width / 2 - ruleW / 2, headerY + 14);
    ctx.lineTo(width / 2 + ruleW / 2, headerY + 14);
  } else {
    ctx.moveTo(padX, headerY + 14);
    ctx.lineTo(padX + ruleW, headerY + 14);
  }
  ctx.stroke();

  // Alpha Track Matte Headline Reveal (slides cleanly out of clip boundary—no lonely fade!)
  const headP = aeSpeedGraphEase(clampInterpolate(localTime, 0.1, 0.62, 0, 1));
  const headFontSize = isVertical ? Math.round(width * 0.068) : Math.round(width * 0.036);
  ctx.font = `600 ${headFontSize}px "Playfair Display", Georgia, serif`;
  ctx.fillStyle = palette.ink;

  const words = scene.headline.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > textMaxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  lines.forEach((ln, idx) => {
    const lineY = headerY + 52 + idx * (headFontSize * 1.16);
    const staggerP = aeSpeedGraphEase(
      clampInterpolate(localTime, 0.1 + idx * 0.07, 0.62 + idx * 0.07, 0, 1)
    );
    ctx.save();
    if (craft.trackMattes) {
      ctx.beginPath();
      ctx.rect(0, lineY - headFontSize, width, headFontSize * 1.28);
      ctx.clip();
    }
    const ySlide = (1 - staggerP) * headFontSize * 0.85;
    ctx.globalAlpha = staggerP * (1 - exitProgress);
    ctx.fillText(ln, isVertical ? width / 2 : padX, lineY + ySlide);
    ctx.restore();
  });

  // Animated Tabular Financial Counter
  const counterP = aeSpeedGraphEase(clampInterpolate(localTime, 0.35, Math.min(2.3, scene.durationSec * 0.65), 0, 1));
  const metricText = interpolateMetricLabel(scene.metricStart, scene.metricEnd, counterP);
  const metricY = isVertical
    ? height * 0.72
    : headerY + 76 + lines.length * (headFontSize * 1.18) + 34;

  const counterAppear = aeSpeedGraphEase(clampInterpolate(localTime, 0.22, 0.65, 0, 1));
  ctx.save();
  ctx.globalAlpha = counterAppear * (1 - exitProgress);
  ctx.fillStyle = palette.inkMuted;
  ctx.font = `500 ${isVertical ? 13 : 14}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(scene.sublabel, isVertical ? width / 2 : padX, metricY - 26);

  ctx.fillStyle = scene.visualObject === 'eroding-banknote' || scene.visualObject === 'credit-trap-ledger' || scene.visualObject === 'statement-scanner'
    ? palette.crimson
    : palette.gold;
  ctx.font = `600 ${isVertical ? Math.round(width * 0.092) : Math.round(width * 0.044)}px "IBM Plex Mono", monospace`;
  ctx.fillText(metricText, isVertical ? width / 2 : padX, metricY + 14);

  if (scene.metricUnit) {
    ctx.fillStyle = palette.inkMuted;
    ctx.font = `500 ${isVertical ? 12 : 13}px "IBM Plex Mono", monospace`;
    ctx.fillText(scene.metricUnit, isVertical ? width / 2 : padX, metricY + 40);
  }
  ctx.restore();
  ctx.restore(); // end typography

  ctx.restore(); // end camera rig

  // =========================================================================
  // LAYER 4 & 5: Luxury Reel Kinetic Subtitles + Film Grain & Vignette Stack
  // =========================================================================
  if (blueprint.subtitlesEnabled && scene.words.length > 0) {
    // Render sleek bottom-safe 4-word Reel caption window synchronized to playheadSec
    let activeIdx = scene.words.findIndex(
      (w) => playheadSec >= w.startSec && playheadSec <= w.endSec
    );
    if (activeIdx === -1) {
      activeIdx = scene.words.reduce((best, w, i) => (playheadSec >= w.startSec ? i : best), 0);
    }
    const groupSize = isVertical ? 4 : 6;
    const groupStart = Math.floor(activeIdx / groupSize) * groupSize;
    const windowWords = scene.words.slice(groupStart, groupStart + groupSize);

    const subY = isVertical ? height * 0.875 : height * 0.89;
    const subFont = isVertical ? Math.round(width * 0.042) : Math.round(width * 0.021);
    ctx.save();
    ctx.font = `600 ${subFont}px "Plus Jakarta Sans", sans-serif`;
    ctx.textBaseline = 'middle';

    // Measure total line width for crisp centering
    const spaceW = ctx.measureText(' ').width * 1.25;
    const widths = windowWords.map((w) => ctx.measureText(w.word).width);
    const totalW = widths.reduce((a, b) => a + b, 0) + spaceW * Math.max(0, windowWords.length - 1);

    // Subtle luxury frosted scrim behind caption text only (no chunky pill boxes)
    const scrimGrad = ctx.createRadialGradient(width / 2, subY, 10, width / 2, subY, totalW * 0.65);
    scrimGrad.addColorStop(0, `${palette.bgBottom}D8`);
    scrimGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = scrimGrad;
    ctx.fillRect(width / 2 - totalW * 0.7, subY - subFont * 1.2, totalW * 1.4, subFont * 2.4);

    let cursorX = width / 2 - totalW / 2;
    windowWords.forEach((w, idx) => {
      const globalIdx = groupStart + idx;
      const isSpoken = globalIdx === activeIdx;
      const isPast = globalIdx < activeIdx;
      const wWidth = widths[idx];

      ctx.save();
      if (isSpoken) {
        ctx.translate(cursorX + wWidth / 2, subY - 2);
        ctx.scale(1.06, 1.06);
        ctx.fillStyle = w.emphasis ? palette.gold : palette.ink;
        ctx.textAlign = 'center';
        ctx.fillText(w.word, 0, 0);
        // Subtle editorial gold hairline under active word
        ctx.fillStyle = palette.gold;
        ctx.fillRect(-wWidth * 0.42, subFont * 0.56, wWidth * 0.84, 2.2);
      } else {
        ctx.fillStyle = isPast ? palette.ink : palette.inkMuted;
        ctx.globalAlpha = isPast ? 0.82 : 0.45;
        ctx.textAlign = 'left';
        ctx.fillText(w.word, cursorX, subY);
      }
      ctx.restore();
      cursorX += wWidth + spaceW;
    });
    ctx.restore();
  }

  // Layer 5: Archival paper/film grain + measured corner vignette
  if (craft.fiveLayerStack) {
    const vig = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.36,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.74
    );
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.16)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, width, height);

    // Deterministic lightweight micro-grain dots (zero pixel buffer overhead)
    ctx.fillStyle = palette.ink;
    ctx.globalAlpha = palette.grainAlpha;
    const frameSeed = Math.floor(playheadSec * 24);
    for (let g = 0; g < 65; g++) {
      const gx = ((g * 9301 + frameSeed * 49297) % 233280) / 233280;
      const gy = ((g * 49297 + frameSeed * 9301 + 17) % 233280) / 233280;
      ctx.fillRect(gx * width, gy * height, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;
  }

  // Editorial bottom timeline hairline
  const progress = blueprint.totalPreviewSec > 0 ? playheadSec / blueprint.totalPreviewSec : 0;
  ctx.fillStyle = palette.hairline;
  ctx.fillRect(0, height - 3, width, 3);
  ctx.fillStyle = palette.gold;
  ctx.fillRect(0, height - 3, width * Math.max(0, Math.min(1, progress)), 3);

  ctx.restore();

  return { activeSceneIndex, activeScene: scene };
}

/**
 * Renders the live 9:16 Viral Clipper Studio simulator showing EMA-smoothed smart cropping,
 * 2-panel podcast split or motion split, animated Illustrator vector overlay card, and
 * luxury .ASS Reel caption preview.
 */
export function renderViralClipSimulatorFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  moment: ViralMoment,
  timeSec: number,
  injectMotionOverlay: boolean
) {
  const palette = moment.palettePolarity === 'dark' ? DARK_LUXURY : LIGHT_LUXURY;
  const craft: AeCraftOptions = {
    trimPaths: true,
    trackMattes: true,
    motionBlur: true,
    fiveLayerStack: true,
    layerStagger: true,
  };

  ctx.save();
  // Base studio slate backdrop representing clipped source video
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#171C1A');
  bg.addColorStop(1, '#0D100F');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const drawCameraFeedRegion = (
    rx: number,
    ry: number,
    rw: number,
    rh: number,
    label: string,
    panPhase: number
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(rx, ry, rw, rh);
    ctx.clip();

    // Subtle studio lighting backdrop representing captured YouTube interview
    const studioGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
    studioGrad.addColorStop(0, '#222A27');
    studioGrad.addColorStop(0.5, '#171E1B');
    studioGrad.addColorStop(1, '#101513');
    ctx.fillStyle = studioGrad;
    ctx.fillRect(rx, ry, rw, rh);

    // Subtle acoustic wall paneling lines moving smoothly under EMA crop pan
    const emaPan = Math.sin(timeSec * 0.75 + panPhase) * 18;
    ctx.strokeStyle = 'rgba(212, 175, 106, 0.08)';
    ctx.lineWidth = 1;
    for (let x = -40 + emaPan; x < rw + 40; x += 32) {
      ctx.beginPath();
      ctx.moveTo(rx + x, ry);
      ctx.lineTo(rx + x, ry + rh);
      ctx.stroke();
    }

    // Abstract acoustic waveform & MediaPipe EMA active-speaker tracking reticle
    const cx = rx + rw / 2 + emaPan * 0.55;
    const cy = ry + rh * 0.46;

    // Live audio RMS rings
    const rms = 0.5 + 0.5 * Math.sin(timeSec * 7.5 + panPhase);
    ctx.strokeStyle = 'rgba(212, 175, 106, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 34 + rms * 14, 0, Math.PI * 2);
    ctx.stroke();

    // MediaPipe EMA crop focus corners (clean framing guide)
    const boxW = rw * 0.54;
    const boxH = rh * 0.48;
    const bx = cx - boxW / 2;
    const by = cy - boxH / 2;
    ctx.strokeStyle = '#D4AF6A';
    ctx.lineWidth = 1.6;
    const corner = 14;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(bx, by + corner);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + corner, by);
    // Top-right
    ctx.moveTo(bx + boxW - corner, by);
    ctx.lineTo(bx + boxW, by);
    ctx.lineTo(bx + boxW, by + corner);
    // Bottom-left
    ctx.moveTo(bx, by + boxH - corner);
    ctx.lineTo(bx, by + boxH);
    ctx.lineTo(bx + corner, by + boxH);
    // Bottom-right
    ctx.moveTo(bx + boxW - corner, by + boxH);
    ctx.lineTo(bx + boxW, by + boxH);
    ctx.lineTo(bx + boxW, by + boxH - corner);
    ctx.stroke();

    // Audio RMS bars
    for (let b = -6; b <= 6; b++) {
      const barH = 8 + Math.abs(Math.sin(timeSec * 9 + b * 0.65 + panPhase)) * 28;
      ctx.fillStyle = Math.abs(b) < 3 ? '#D4AF6A' : 'rgba(244,241,234,0.45)';
      ctx.fillRect(cx + b * 7 - 2, cy - barH / 2, 3.5, barH);
    }

    ctx.fillStyle = 'rgba(244, 241, 234, 0.72)';
    ctx.font = '500 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(label, rx + 14, ry + 22);
    ctx.restore();
  };

  if (moment.framingMode === 'podcast-split') {
    drawCameraFeedRegion(0, 0, width, height * 0.5 - 1, 'SPEAKER A · EMA TRACK', 0);
    drawCameraFeedRegion(0, height * 0.5 + 1, width, height * 0.5 - 1, 'SPEAKER B · ACTIVE AUDIO', 1.8);
    ctx.fillStyle = '#D4AF6A';
    ctx.fillRect(0, height * 0.5 - 1, width, 2);
  } else if (moment.framingMode === 'motion-split') {
    drawCameraFeedRegion(0, 0, width, height * 0.46, 'SOURCE FOOTAGE · EMA CROP', 0);
    // Bottom half: Native luxury Illustrator Motion Graphics panel!
    const my = height * 0.46;
    const mh = height * 0.54;
    ctx.fillStyle = palette.bgTop;
    ctx.fillRect(0, my, width, mh);
    ctx.fillStyle = palette.gold;
    ctx.fillRect(0, my, width, 2);
    if (injectMotionOverlay) {
      drawIllustratorMoneyObject(
        ctx,
        moment.overlayObject,
        width / 2,
        my + mh * 0.44,
        Math.min(width, mh) * 0.34,
        timeSec % 6,
        palette,
        craft
      );
      ctx.fillStyle = palette.gold;
      ctx.font = '600 18px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(moment.overlayMetric, width / 2, my + 34);
    }
  } else {
    // Full 9:16 EMA Single-Speaker frame
    drawCameraFeedRegion(0, 0, width, height, '9:16 EMA ACTIVE SPEAKER', 0);
  }

  // Floating Illustrator B-Roll Callout Card for ema-single & podcast-split when enabled
  if (injectMotionOverlay && moment.framingMode !== 'motion-split') {
    const pop = springCurve((timeSec % 5.5) - 0.25, 145, 16, 1);
    const cardW = width * 0.84;
    const cardH = 128;
    const cardX = (width - cardW) / 2;
    const cardY = 42 - (1 - pop) * 34;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, pop));
    ctx.fillStyle = palette.surface;
    ctx.strokeStyle = palette.gold;
    ctx.lineWidth = 1.6;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 10);
    ctx.fill();
    ctx.stroke();

    drawIllustratorMoneyObject(
      ctx,
      moment.overlayObject,
      cardX + 58,
      cardY + cardH / 2,
      38,
      timeSec % 5.5,
      palette,
      craft
    );

    ctx.textAlign = 'left';
    ctx.fillStyle = palette.inkMuted;
    ctx.font = '500 11px "IBM Plex Mono", monospace';
    ctx.fillText('ILLUSTRATOR CALLOUT', cardX + 112, cardY + 34);
    ctx.fillStyle = palette.ink;
    ctx.font = '600 16px "Playfair Display", serif';
    ctx.fillText(moment.overlayHeadline, cardX + 112, cardY + 60);
    ctx.fillStyle = palette.gold;
    ctx.font = '600 22px "IBM Plex Mono", monospace';
    ctx.fillText(moment.overlayMetric, cardX + 112, cardY + 94);
    ctx.restore();
  }

  // Optional Luxury Reel .ASS Captions overlay preview
  if (moment.captionsEnabled) {
    const tokens = moment.hookLine.split(/\s+/).filter(Boolean);
    const activeWordIdx = Math.floor(timeSec * 3.1) % Math.max(1, tokens.length);
    const groupStart = Math.floor(activeWordIdx / 4) * 4;
    const lineWords = tokens.slice(groupStart, groupStart + 4);
    const capY = height * 0.86;

    ctx.save();
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'middle';
    const spaceW = 7;
    const widths = lineWords.map((w) => ctx.measureText(w).width);
    const totalW = widths.reduce((a, b) => a + b, 0) + spaceW * Math.max(0, lineWords.length - 1);

    ctx.fillStyle = 'rgba(13, 16, 15, 0.72)';
    drawRoundedRect(ctx, width / 2 - totalW / 2 - 16, capY - 22, totalW + 32, 44, 8);
    ctx.fill();

    let cx = width / 2 - totalW / 2;
    lineWords.forEach((w, idx) => {
      const isAct = groupStart + idx === activeWordIdx;
      ctx.fillStyle = isAct ? '#D4AF6A' : '#F4F1EA';
      ctx.textAlign = 'left';
      ctx.fillText(w, cx, capY);
      cx += widths[idx] + spaceW;
    });
    ctx.restore();
  }

  ctx.restore();
}
