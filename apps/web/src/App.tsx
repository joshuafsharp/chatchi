import * as React from 'react';

import { PauseMenu } from './components/PauseMenu';
import { phaser } from './game/PhaserGame';

export default function App() {
  console.log(phaser);

  return <PauseMenu game={phaser} />;
}
