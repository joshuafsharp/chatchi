import { GridEngine } from 'grid-engine';

import MainScene from './scenes/Main';

let phaserClient: Phaser.Game | undefined;

export const usePhaser = (parentId: string) => {
  if (phaserClient) {
    return phaserClient;
  }

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
    parent: parentId,
    backgroundColor: '#9bd3c3',
  };

  phaserClient = new Phaser.Game(config);

  return phaserClient;
};
