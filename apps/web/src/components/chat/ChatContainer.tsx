import * as React from 'react';

import { UserInput } from './UserInput';

interface Props {
  game: Phaser.Game;
}

export function ChatContainer({ game }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-10 max-h-32 w-72">
      <UserInput game={game} />
    </div>
  );
}