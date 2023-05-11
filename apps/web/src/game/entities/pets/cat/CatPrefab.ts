import { Direction, GridEngine } from 'grid-engine';
import Phaser from 'phaser';

import { worldScale } from '~/game/common/config';

export class CatPrefab {
  public static id = 'pet-cat' as const;

  private gridEngine: GridEngine;

  public sprite: Phaser.GameObjects.Sprite;

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gridEngine: GridEngine, startPosX: number, startPosY: number) {
    this.scene = scene;
    this.gridEngine = gridEngine;

    this.sprite = this.scene.add.sprite(startPosX, startPosY, CatPrefab.id);
    this.sprite.scale = worldScale;
    this.sprite.setDepth(2);

    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.updatePet, this);
  }

  private start() {}

  private updatePet() {
    // TODO: Handle animation update when movement changes
    this.gridEngine.move(CatPrefab.id, Direction.DOWN);
  }
}
