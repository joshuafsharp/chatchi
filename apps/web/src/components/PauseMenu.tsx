import React from 'react';
import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Props {
  game: Phaser.Game;
}

export function PauseMenu({ game }: Props) {
  const [paused, setPaused] = useState(false);

  const changePauseState = () => {
    setPaused(!paused);

    if (paused) {
      game.resume();
    } else {
      game.pause();
    }
  };

  document.addEventListener('keyup', (event: KeyboardEvent) => {
    const keyName = event.key;
    if (keyName === 'Escape') {
      changePauseState();
    }
  });

  const handleQuit = () => {
    // TODO: Quit the game and return to main menu
    console.log('TODO');
  };

  if (!paused) {
    return null;
  }

  return (
    <Dialog open={paused} onOpenChange={changePauseState}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">Chatchi</DialogTitle>
        </DialogHeader>

        <ul className="mx-auto mt-12 flex flex-col justify-center space-y-4 text-center">
          <li>
            <button
              className="w-40 rounded-md bg-green-200 p-4 font-sans font-semibold hover:bg-green-300"
              onClick={changePauseState}
            >
              Resume
            </button>
          </li>
          <li>
            <button
              className="w-40 rounded-md bg-green-200 p-4 font-sans font-semibold hover:bg-green-300"
              onClick={handleQuit}
            >
              Quit to Menu
            </button>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
