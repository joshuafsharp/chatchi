import * as React from 'react';

import './App.styles.css';
import { PauseMenu } from './components/PauseMenu';
import { NeedsMeter } from './components/needs/NeedsMeter';
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
      <NeedsMeter game={phaser} />
    </div>
  );
}
