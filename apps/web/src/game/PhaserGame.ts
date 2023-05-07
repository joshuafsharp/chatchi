import { GridEngine } from 'grid-engine';

import MainScene from './scenes/Main';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Chatchi',
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
  },
  plugins: {
    scene: [
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine',
      },
    ],
  },
  scene: [MainScene],
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: 'game',
  backgroundColor: '#9bd3c3',
};

export const phaser = new Phaser.Game(config);

export default phaser;
