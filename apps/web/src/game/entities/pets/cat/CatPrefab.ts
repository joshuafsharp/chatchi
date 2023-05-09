import { Direction, GridEngine } from 'grid-engine';
import Phaser from 'phaser';

import animations from './animations.json';
import { idle } from './animations.state';

export class CatPrefab {
  public id = 'pet-cat' as const;

  private gridEngine: GridEngine;

  public sprite: Phaser.GameObjects.Sprite;

  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    gridEngine: GridEngine,
    x?: number,
    y?: number,
    texture?: string,
    frame?: number | string,
  ) {
    this.scene = scene;
    this.gridEngine = gridEngine;

    this.sprite = this.scene.add.sprite(x || 0, y || 0, 'pet-cat');
    this.sprite.scale = 3;
    this.sprite.setDepth(2);

    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.updatePet, this);
  }

  private start() {}

  private updatePet() {
    // TODO: Handle animation update when movement changes
    this.gridEngine.move(this.id, Direction.RIGHT);
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
