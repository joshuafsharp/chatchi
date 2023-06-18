import React from 'react';
import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Props {
  game: Phaser.Game;
}

export function PauseDialog({ game }: Props) {
  const [paused, setPaused] = useState(false);

  const changePauseState = React.useCallback(() => {
    if (paused) {
      game.resume();
    } else {
      game.pause();
    }

    setPaused(!paused);
  }, [game, paused]);

  React.useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        changePauseState();
      }
    };

    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [changePauseState]);

  const handleQuit = () => {
    // TODO: Quit the game and return to main menu
    console.log('TODO');
  };

  return (
    <Dialog open={paused} onOpenChange={setPaused}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">Chatchi</DialogTitle>
        </DialogHeader>

        <ul className="mx-auto mt-8 flex flex-col justify-center space-y-4 text-center">
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
