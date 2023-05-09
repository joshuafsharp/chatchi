import * as React from 'react';

import { PauseMenu } from './components/PauseMenu';
import { usePhaser } from './game/PhaserGame';

export default function App() {
  const [phaser, setPhaser] = React.useState<Phaser.Game | null>(null);

  const canvasParentId = 'phaser-parent';

  React.useEffect(() => {
    if (phaser) {
      return;
    }

    const phaserGame = usePhaser(canvasParentId);

    setPhaser(phaserGame);
  }, []);

  if (!phaser) {
    return null;
  }

  return (
    <div id={canvasParentId}>
      <PauseMenu game={phaser} />
    </div>
  );
}
