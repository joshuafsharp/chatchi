import * as React from 'react';

import PetDialogueBox from '~/assets/ui/chat/dialogue-box-pet.png';
import PlayerDialogueBox from '~/assets/ui/chat/dialogue-box-player.png';
import { useConversationStore } from '~/game/state/conversation';
import { cn } from '~/lib/utils';

import { UserInput } from './UserInput';

interface Props {
  game: Phaser.Game;
}

export function ChatContainer({ game }: Props) {
  const conversation = useConversationStore();

  return (
    <div className="fixed bottom-4 right-4 z-10 w-72">
      <ul className="mb-4 max-h-40 space-y-2 overflow-y-auto">
        {conversation.messages.map((message) => (
          <li
            key={message.timestamp}
            className={cn('w-3/4 border-[0.5rem]  text-brown-700', {
              'ml-auto': message.sender === 'pet-cat',
            })}
            style={{
              borderImage:
                message.sender === 'player'
                  ? `url(${PlayerDialogueBox})`
                  : `url(${PetDialogueBox})`,
              borderImageSlice: message.sender === 'player' ? '8 8 10 8' : '8 10 8 8',
            }}
          >
            <div className="bg-brown-200 px-2">{message.content}</div>
          </li>
        ))}
      </ul>

      <UserInput game={game} />
    </div>
  );
}
