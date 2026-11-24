import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';
import { VolumetricCloudFlythrough } from './aeMotionPrimitives';

// After Effects Graph Editor signature smooth S-curves (snappy whip mid-cut, silky ease settle)
const AE_SMOOTH_CURVE = Easing.bezier(0.76, 0, 0.24, 1);
const AE_CAMERA_DIVE = Easing.bezier(0.65, 0, 0.35, 1);
const AE_EDITORIAL_WIPE = Easing.bezier(0.82, 0, 0.18, 1);

// ============================================================================
// 1. PRO WHIP PAN (Smooth AE Camera Whip + Speed Streaks + Zero Seam Overscan)
// ============================================================================
type WhipPanProps = {
  direction: 'left' | 'right' | 'up' | 'down';
  streakColor?: string;
};

const ProWhipPanComponent: React.FC<TransitionPresentationComponentProps<WhipPanProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: AE_SMOOTH_CURVE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Velocity-derivative speed-ramp stretch + subtle directional skew (zero heavy Gaussian blur!)
  const velocity = Math.sin(p * Math.PI);
  const speedPeak = Math.pow(velocity, 1.45);
  const isHorizontal = passedProps.direction === 'left' || passedProps.direction === 'right';
  const sign =
    passedProps.direction === 'left' || passedProps.direction === 'up' ? -1 : 1;

  // 0.6% overscan guarantees zero sub-pixel seam flash + subtle 1.6% AE anticipation breath on exit
  const anticipation =
    presentationDirection === 'exiting' ? Math.sin(Math.min(1, p * 3.2) * Math.PI) * -1.4 : 0;
  const tx = isHorizontal
    ? presentationDirection === 'exiting'
      ? sign * (p * 100.6 + anticipation)
      : -sign * (1 - p) * 100.6
    : 0;
  const ty = !isHorizontal
    ? presentationDirection === 'exiting'
      ? sign * (p * 100.6 + anticipation)
      : -sign * (1 - p) * 100.6
    : 0;

  const scaleX = isHorizontal ? 1 + speedPeak * 0.115 : 1 - speedPeak * 0.025;
  const scaleY = !isHorizontal ? 1 + speedPeak * 0.115 : 1 - speedPeak * 0.025;
  const skewX = isHorizontal ? sign * speedPeak * -4.2 : 0;
  const streakColor = passedProps.streakColor ?? 'rgba(255, 248, 226, 0.66)';

  return (
    <AbsoluteFill
      style={{
        transform: `translate3d(${tx.toFixed(3)}%, ${ty.toFixed(3)}%, 0) skewX(${skewX.toFixed(2)}deg) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`,
        willChange: 'transform',
      }}
    >
      {children}
      {/* Velocity-derivative directional motion-blur smear streaks at peak whip velocity */}
      {velocity > 0.2 && (
        <svg
          viewBox="0 0 1280 720"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: ((velocity - 0.2) * 0.62).toFixed(3),
          }}
        >
          {isHorizontal ? (
            <>
              <rect x={40} y={96} width={440} height={5} rx={2.5} fill={streakColor} />
              <rect x={680} y={214} width={520} height={3.5} rx={1.75} fill={streakColor} />
              <rect x={160} y={362} width={640} height={4} rx={2} fill={streakColor} opacity={0.45} />
              <rect x={220} y={512} width={420} height={4.5} rx={2.25} fill={streakColor} />
              <rect x={820} y={610} width={340} height={3} rx={1.5} fill={streakColor} />
            </>
          ) : (
            <>
              <rect x={140} y={40} width={5} height={320} rx={2.5} fill={streakColor} />
              <rect x={540} y={260} width={3.5} height={360} rx={1.75} fill={streakColor} />
              <rect x={840} y={80} width={4} height={310} rx={2} fill={streakColor} opacity={0.45} />
              <rect x={1100} y={140} width={4.5} height={340} rx={2.25} fill={streakColor} />
            </>
          )}
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const proWhipPan = (props: WhipPanProps): TransitionPresentation<WhipPanProps> => ({
  component: ProWhipPanComponent,
  props,
});

// ============================================================================
// 2. PRO ZOOM THROUGH (Coupled Documentary Camera Push-In + Warm Optical Bloom)
// ============================================================================
type ZoomThroughProps = {
  zoomIntensity?: number;
  bloomColor?: string;
};

const ProZoomThroughComponent: React.FC<
  TransitionPresentationComponentProps<ZoomThroughProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const intensity = passedProps.zoomIntensity ?? 0.28;
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: AE_CAMERA_DIVE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bloom = Math.sin(p * Math.PI);
  const bloomColor = passedProps.bloomColor ?? 'rgba(255, 244, 214, 0.24)';

  if (presentationDirection === 'exiting') {
    const scale = interpolate(p, [0, 1], [1, 1 + intensity]);
    const opacity = interpolate(p, [0.24, 0.88], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${scale.toFixed(4)})`,
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const scale = interpolate(p, [0, 1], [1 - intensity * 0.58, 1]);
  const opacity = interpolate(p, [0.06, 0.72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale.toFixed(4)})`,
        opacity,
      }}
    >
      {children}
      {bloom > 0.05 && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, ${bloomColor} 0%, transparent 68%)`,
              opacity: bloom * 0.85,
              pointerEvents: 'none',
            }}
          />
          <svg
            viewBox="0 0 1280 720"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              opacity: bloom * 0.42,
            }}
          >
            <circle
              cx={640}
              cy={360}
              r={120 + p * 620}
              fill="none"
              stroke="#FFD166"
              strokeWidth={4}
              strokeDasharray="24 18"
            />
          </svg>
        </>
      )}
    </AbsoluteFill>
  );
};

export const proZoomThrough = (
  props: ZoomThroughProps = {}
): TransitionPresentation<ZoomThroughProps> => ({
  component: ProZoomThroughComponent,
  props,
});

// ============================================================================
// 3. PRO IRIS REVEAL (Signature Infographics Show Inked Circular Aperture Bloom)
// ============================================================================
type IrisRevealProps = {
  originX?: number; // percentage 0..100
  originY?: number; // percentage 0..100
  ringColor?: string;
};

const ProIrisRevealComponent: React.FC<
  TransitionPresentationComponentProps<IrisRevealProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const ox = passedProps.originX ?? 50;
  const oy = passedProps.originY ?? 50;
  const ringColor = passedProps.ringColor ?? '#F5B82E';

  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: AE_SMOOTH_CURVE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (presentationDirection === 'exiting') {
    const scale = interpolate(p, [0, 1], [1, 0.96]);
    return (
      <AbsoluteFill style={{ transform: `scale(${scale.toFixed(4)})` }}>
        {children}
      </AbsoluteFill>
    );
  }

  const radiusPct = interpolate(p, [0, 1], [0, 132]);
  const scale = interpolate(p, [0, 1], [1.06, 1]);
  // Map percentage radius smoothly onto 1280x720 SVG circle for crisp inked aperture rim
  const svgCx = (ox / 100) * 1280;
  const svgCy = (oy / 100) * 720;
  const svgR = (radiusPct / 100) * 1470;

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${radiusPct.toFixed(2)}% at ${ox}% ${oy}%)`,
        transform: `scale(${scale.toFixed(4)})`,
      }}
    >
      {children}
      {p > 0.02 && p < 0.95 && (
        <svg
          viewBox="0 0 1280 720"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <circle
            cx={svgCx}
            cy={svgCy}
            r={Math.max(0, svgR - 4)}
            fill="none"
            stroke="#18222F"
            strokeWidth={14}
            opacity={0.92}
          />
          <circle
            cx={svgCx}
            cy={svgCy}
            r={Math.max(0, svgR - 11)}
            fill="none"
            stroke={ringColor}
            strokeWidth={6}
            opacity={0.95}
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const proIrisReveal = (
  props: IrisRevealProps = {}
): TransitionPresentation<IrisRevealProps> => ({
  component: ProIrisRevealComponent,
  props,
});

// ============================================================================
// 4. PRO DIAGONAL TRACK MATTE SWEEP (Dual-Ribbon Editorial Color Wipe)
// ============================================================================
type DiagonalSweepProps = {
  accentColor?: string;
  secondaryColor?: string;
};

const ProDiagonalSweepComponent: React.FC<
  TransitionPresentationComponentProps<DiagonalSweepProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: AE_EDITORIAL_WIPE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (presentationDirection === 'exiting') {
    const tx = interpolate(p, [0, 1], [0, -5.5]);
    return (
      <AbsoluteFill style={{ transform: `translate3d(${tx.toFixed(2)}%, 0, 0)` }}>
        {children}
      </AbsoluteFill>
    );
  }

  const edgeTop = interpolate(p, [0, 1], [-16, 124]);
  const edgeBot = edgeTop - 16;
  const accent = passedProps.accentColor ?? '#F5B82E';
  const secondary = passedProps.secondaryColor ?? '#18222F';
  const tx = interpolate(p, [0, 1], [3.5, 0]);

  return (
    <AbsoluteFill
      style={{
        clipPath: `polygon(-20% 0%, ${edgeTop.toFixed(2)}% 0%, ${edgeBot.toFixed(2)}% 100%, -20% 100%)`,
        transform: `translate3d(${tx.toFixed(2)}%, 0, 0)`,
      }}
    >
      {children}
      {p > 0.02 && p < 0.98 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              bottom: '-10%',
              left: `${((edgeTop + edgeBot) / 2).toFixed(2)}%`,
              width: 22,
              background: secondary,
              transform: 'translateX(-60%) skewX(-12deg)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              bottom: '-10%',
              left: `${((edgeTop + edgeBot) / 2 - 0.9).toFixed(2)}%`,
              width: 11,
              background: accent,
              transform: 'translateX(-50%) skewX(-12deg)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};

export const proDiagonalSweep = (
  props: DiagonalSweepProps = {}
): TransitionPresentation<DiagonalSweepProps> => ({
  component: ProDiagonalSweepComponent,
  props,
});

// ============================================================================
// 5. PRO SHUTTER WIPE (Cinema Split-Blade Track Matte Reveal — Zero Cliché)
// ============================================================================
type ShutterWipeProps = {
  axis?: 'horizontal' | 'vertical';
  accentColor?: string;
};

const ProShutterWipeComponent: React.FC<
  TransitionPresentationComponentProps<ShutterWipeProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const axis = passedProps.axis ?? 'horizontal';
  const accent = passedProps.accentColor ?? '#F5B82E';
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: AE_EDITORIAL_WIPE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (presentationDirection === 'exiting') {
    const scale = interpolate(p, [0, 1], [1, 0.975]);
    return (
      <AbsoluteFill style={{ transform: `scale(${scale.toFixed(4)})` }}>
        {children}
      </AbsoluteFill>
    );
  }

  // Opens smoothly from center outward like a cinema lens shutter
  const halfOpen = interpolate(p, [0, 1], [0, 52]);
  const insetA = Math.max(0, 50 - halfOpen);
  const scale = interpolate(p, [0, 1], [1.045, 1]);

  const clipPath =
    axis === 'horizontal'
      ? `inset(${insetA.toFixed(2)}% 0% ${insetA.toFixed(2)}% 0%)`
      : `inset(0% ${insetA.toFixed(2)}% 0% ${insetA.toFixed(2)}%)`;

  return (
    <AbsoluteFill
      style={{
        clipPath,
        transform: `scale(${scale.toFixed(4)})`,
      }}
    >
      {children}
      {p > 0.02 && p < 0.96 && axis === 'horizontal' && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${insetA.toFixed(2)}%`,
              height: 6,
              background: accent,
              borderBottom: '3px solid #18222F',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `${insetA.toFixed(2)}%`,
              height: 6,
              background: accent,
              borderTop: '3px solid #18222F',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      {p > 0.02 && p < 0.96 && axis === 'vertical' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${insetA.toFixed(2)}%`,
              width: 6,
              background: accent,
              borderRight: '3px solid #18222F',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: `${insetA.toFixed(2)}%`,
              width: 6,
              background: accent,
              borderLeft: '3px solid #18222F',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};

export const proShutterWipe = (
  props: ShutterWipeProps = {}
): TransitionPresentation<ShutterWipeProps> => ({
  component: ProShutterWipeComponent,
  props,
});

// ============================================================================
// 6. PRO LIQUID WAVE SWEEP (Organic Horizon Curtain Wipe for Ocean/Flight/Sunrise)
// ============================================================================
type LiquidWaveProps = {
  waveColor?: string;
};

const ProLiquidWaveComponent: React.FC<
  TransitionPresentationComponentProps<LiquidWaveProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const waveColor = passedProps.waveColor ?? '#2AD08E';
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: AE_SMOOTH_CURVE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (presentationDirection === 'exiting') {
    const ty = interpolate(p, [0, 1], [0, -4]);
    return (
      <AbsoluteFill style={{ transform: `translate3d(0, ${ty.toFixed(2)}%, 0)` }}>
        {children}
      </AbsoluteFill>
    );
  }

  // Smooth upward curved horizon reveal sweeping from bottom to top
  const baseY = interpolate(p, [0, 1], [114, -14]);
  const curveAmp = Math.sin(p * Math.PI) * 14;
  const p0 = (baseY + curveAmp * 0.4).toFixed(2);
  const p25 = (baseY - curveAmp).toFixed(2);
  const p50 = (baseY + curveAmp * 0.2).toFixed(2);
  const p75 = (baseY - curveAmp * 0.9).toFixed(2);
  const p100 = (baseY + curveAmp * 0.4).toFixed(2);
  const ty = interpolate(p, [0, 1], [3, 0]);

  return (
    <AbsoluteFill
      style={{
        clipPath: `polygon(0% 100%, 0% ${p0}%, 25% ${p25}%, 50% ${p50}%, 75% ${p75}%, 100% ${p100}%, 100% 100%)`,
        transform: `translate3d(0, ${ty.toFixed(2)}%, 0)`,
      }}
    >
      {children}
      {p > 0.03 && p < 0.96 && (
        <svg
          viewBox="0 0 1280 720"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <path
            d={`M -20 ${(Number(p0) / 100) * 720} L 320 ${(Number(p25) / 100) * 720} L 640 ${(Number(p50) / 100) * 720} L 960 ${(Number(p75) / 100) * 720} L 1300 ${(Number(p100) / 100) * 720}`}
            fill="none"
            stroke="#18222F"
            strokeWidth={14}
            strokeLinejoin="round"
          />
          <path
            d={`M -20 ${(Number(p0) / 100) * 720 + 6} L 320 ${(Number(p25) / 100) * 720 + 6} L 640 ${(Number(p50) / 100) * 720 + 6} L 960 ${(Number(p75) / 100) * 720 + 6} L 1300 ${(Number(p100) / 100) * 720 + 6}`}
            fill="none"
            stroke={waveColor}
            strokeWidth={7}
            strokeLinejoin="round"
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const proLiquidWaveSweep = (
  props: LiquidWaveProps = {}
): TransitionPresentation<LiquidWaveProps> => ({
  component: ProLiquidWaveComponent,
  props,
});

// ============================================================================
// 7. PRO 3D VOLUMETRIC CLOUD FLY-THROUGH (Viral AE Z-Depth Cloud Dive!)
// ============================================================================
type CloudFlythroughProps = {
  tint?: string;
  shadeTint?: string;
  mistColor?: string;
};

const ProCloudFlythroughComponent: React.FC<
  TransitionPresentationComponentProps<CloudFlythroughProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: AE_CAMERA_DIVE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (presentationDirection === 'exiting') {
    const scale = interpolate(p, [0, 1], [1, 1.32]);
    const opacity = interpolate(p, [0.35, 0.78], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${scale.toFixed(4)})`,
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const scale = interpolate(p, [0, 1], [0.84, 1]);
  const opacity = interpolate(p, [0.22, 0.65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${scale.toFixed(4)})`,
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
      <VolumetricCloudFlythrough
        progress={p}
        tint={passedProps.tint ?? '#F8FBFF'}
        shadeTint={passedProps.shadeTint ?? '#B8D4EA'}
        mistColor={passedProps.mistColor ?? 'rgba(226, 240, 255, 0.34)'}
      />
    </AbsoluteFill>
  );
};

export const proCloudFlythroughTransition = (
  props: CloudFlythroughProps = {}
): TransitionPresentation<CloudFlythroughProps> => ({
  component: ProCloudFlythroughComponent,
  props,
});

// ============================================================================
// 8. PRO MATCH-CUT MORPH (AE Shared-Anchor Speed-Ramp Rotational Morph)
// ============================================================================
type MatchCutMorphProps = {
  accentColor?: string;
  direction?: 'cw' | 'ccw';
};

const ProMatchCutMorphComponent: React.FC<
  TransitionPresentationComponentProps<MatchCutMorphProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const accent = passedProps.accentColor ?? '#FFD166';
  const sign = passedProps.direction === 'ccw' ? -1 : 1;
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: AE_SMOOTH_CURVE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const speedPeak = Math.sin(p * Math.PI);

  if (presentationDirection === 'exiting') {
    const rot = sign * interpolate(p, [0, 1], [0, 16]);
    const scale = interpolate(p, [0, 1], [1, 1.24]);
    const opacity = interpolate(p, [0.32, 0.8], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${scale.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`,
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const rot = sign * interpolate(p, [0, 1], [-16, 0]);
  const scale = interpolate(p, [0, 1], [0.84, 1]);
  const opacity = interpolate(p, [0.18, 0.66], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${scale.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`,
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
      {speedPeak > 0.08 && (
        <svg
          viewBox="0 0 1280 720"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: (speedPeak * 0.72).toFixed(3),
          }}
        >
          <g transform={`translate(640, 360) rotate(${(sign * p * 180).toFixed(1)})`}>
            <circle
              r={(120 + speedPeak * 280).toFixed(1)}
              fill="none"
              stroke={accent}
              strokeWidth={5}
              strokeDasharray="48 34"
            />
            <circle
              r={(74 + speedPeak * 150).toFixed(1)}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2.5}
              strokeDasharray="18 22"
              opacity={0.7}
            />
          </g>
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const proMatchCutMorph = (
  props: MatchCutMorphProps = {}
): TransitionPresentation<MatchCutMorphProps> => ({
  component: ProMatchCutMorphComponent,
  props,
});
