import * as React from 'react';

import ProgressEmpty from '~/assets/ui/progress/empty.png';

interface Props {
  game: Phaser.Game;
}

export function NeedsMeter({ game }: Props) {
  return (
    <img
      src={ProgressEmpty}
      className="rendering-auto rendering-crisp-edges rendering-pixelated pointer-events-none fixed bottom-4 left-4 z-10 h-10 w-36"
    />
  );
}
