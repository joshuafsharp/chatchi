import React from 'react';
import { useState } from 'react';

import { usePhaser } from '~/game/PhaserGame';

import { AuthContext, supabase } from './AuthProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function PauseDialog({ open, setOpen }: Props) {
  const game = usePhaser();
  const auth = React.useContext(AuthContext);

  const changePauseState = React.useCallback(() => {
    if (open) {
      game.resume();
    } else {
      game.pause();
    }

    setOpen(!open);
  }, [game, open, setOpen]);

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
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold tracking-wide">
            Chatchi
          </DialogTitle>
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
            {auth?.user ? (

              <button onClick={supabase}>Sign out</button>
            ) : (
              // TODO: show supabase Auth UI
              <button onClick={}>Log in or Register</button>
            )
          }
            </li>
          {/* <li>
            <button
              className="w-40 rounded-md bg-green-200 p-4 font-sans font-semibold hover:bg-green-300"
              onClick={handleQuit}
            >
              Quit to Menu
            </button>
          </li> */}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
