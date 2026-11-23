import React from 'react';
import { Composition } from 'remotion';
import { BangladeshXFilm } from './BangladeshXFilm';
import { FILM_FPS } from './theme';
import { TOTAL_FILM_FRAMES } from './timingMath';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BangladeshXFilm"
      component={BangladeshXFilm}
      durationInFrames={TOTAL_FILM_FRAMES}
      fps={FILM_FPS}
      width={1280}
      height={720}
      defaultProps={{
        paletteMode: 'mix',
        subtitlesEnabled: true,
      }}
    />
  );
};
