import * as React from 'react';

import DialogueBox from '~/assets/ui/chat/dialogue-input.png';
import SubmitImagePressed from '~/assets/ui/chat/submit-pressed.png';
import SubmitImage from '~/assets/ui/chat/submit.png';
import MainScene from '~/game/scenes/old.main.scene';
import { cn } from '~/lib/utils';

interface Props {
  game: Phaser.Game;
}

export function UserInput({ game }: Props) {
  const [isMouseDown, setIsMouseDown] = React.useState(false);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleFocus = () => {
    // TODO: Disable movement cursors
    console.log((game.scene.scenes[0] as MainScene).gridEngine);
  };

  return (
    // <div className=" pb-1 pl-4 pr-2 pt-3" style={{ background: `url(${DialogueBox})` }}>
    <div className="flex space-x-2">
      <div
        className="h-10 flex-grow"
        style={{
          borderImage: `url(${DialogueBox})`,
          borderImageSlice: '8 8 8 10',
          borderWidth: '0.5rem',
        }}
      >
        <input
          id="user-input"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-full w-full resize-none appearance-none bg-brown-200 pl-1 text-lg leading-none text-brown-700 focus:outline-none"
        />
      </div>

      <button
        type="button"
        style={{
          backgroundImage: isMouseDown ? `url(${SubmitImagePressed})` : `url(${SubmitImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        aria-label="Submit message"
        className={cn('w-9 bg-bottom focus:outline-none', isMouseDown ? 'h-[39px]' : 'h-10')}
        onFocus={handleFocus}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}
