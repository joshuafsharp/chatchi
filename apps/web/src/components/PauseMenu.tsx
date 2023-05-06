import React from 'react';
import { useState } from 'react';

interface Props {
  game: Phaser.Game;
}

export function PauseMenu({ game }: Props) {
  const [paused, setPaused] = useState(false);

  document.addEventListener('keyup', (event: KeyboardEvent) => {
    const keyName = event.key;
    if (keyName === 'Escape') {
      console.log('pressed control');

      setPaused(!paused);
    }
  });

  if (!paused) {
    return null;
  }

  return (
    <ul className="h-full w-full">
      <li>
        <button>Resume</button>
      </li>
    </ul>
  );
}
