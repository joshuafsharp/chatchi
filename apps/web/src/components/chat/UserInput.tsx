import * as React from 'react';

import DialogueBox from '~/assets/ui/chat/dialogue-input.png';
import SubmitImagePressed from '~/assets/ui/chat/submit-pressed.png';
import SubmitImage from '~/assets/ui/chat/submit.png';
import MainScene from '~/game/scenes/old.main.scene';
import { conversation } from '~/game/services/conversation';
import { cn } from '~/lib/utils';

interface Props {
  game: Phaser.Game;
}

export function UserInput({ game }: Props) {
  const inputRef = React.createRef<HTMLInputElement>();

  const [isMouseDown, setIsMouseDown] = React.useState(false);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleFocus = () => {
    const scene = game.scene.scenes[0] as MainScene;

    scene.input.keyboard?.disableGlobalCapture();
    if (scene.input.keyboard) {
      scene.input.keyboard.enabled = false;
    }
  };

  const handleBlur = () => {
    const scene = game.scene.scenes[0] as MainScene;

    scene.input.keyboard?.enableGlobalCapture();

    if (scene.input.keyboard) {
      scene.input.keyboard.enabled = true;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = inputRef.current?.value;

    if (!message) {
      console.error('Invalid message', inputRef.current);

      return;
    }

    conversation.addMessage('player', message);
  };

  return (
    <form className="flex space-x-2" onSubmit={handleSubmit}>
      <div
        className="h-10 flex-grow"
        style={{
          borderImage: `url(${DialogueBox})`,
          borderImageSlice: '8 8 8 10',
          borderWidth: '0.5rem',
        }}
      >
        <input
          ref={inputRef}
          id="user-input"
          placeholder="Say something to your pet"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-full w-full resize-none appearance-none bg-brown-200 pl-1 text-lg leading-none text-brown-700 focus:outline-none"
          onFocus={handleFocus}
          onBlur={handleBlur}
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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </form>
  );
}
