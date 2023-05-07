import React from 'react';
import { useState } from 'react';

import Main from '../game/scenes/Main';

interface Props {
  game: Phaser.Game;
}

export function PauseMenu({ game }: Props) {
  const [paused, setPaused] = useState(false);

  document.addEventListener('keyup', (event: KeyboardEvent) => {
    const keyName = event.key;
    if (keyName === 'Escape') {
      console.log('pressed escape');

      setPaused(!paused);
    }
  });

  const handleResume = () => {
    setPaused(false);

    // Only relevant if main gameplay scene is active
    if (game.scene.isActive(Main.key)) {
      const mainScene = game.scene.getScene(Main.key) as Main;
      mainScene.changePauseState(false);
    }
  };

  const handleQuit = () => {
    // TODO: Quit the game and return to main menu
  };

  if (!paused) {
    return null;
  }

  return (
    <div className="fixed inset-0">
      <ul className="flex w-full max-w-sm justify-center space-y-8 p-16">
        <li>
          <button onClick={handleResume}>Resume</button>
        </li>
        <li>
          <button onClick={handleQuit}>Quit to Menu</button>
        </li>
      </ul>

      <div className="bg-black/40" />
    </div>
  );
}
