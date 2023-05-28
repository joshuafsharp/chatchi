import { GridEngine } from 'grid-engine';
import Phaser from 'phaser';

import { dimensions } from '~/game/common/config';

import { SleepBehaviour } from '../sleep-behaviour.ts/SleepBehaviour';

export class CatPrefab {
  public static id = 'pet-cat' as const;

  public sprite: Phaser.GameObjects.Sprite;

  private gridEngine: GridEngine;
  private scene: Phaser.Scene;

  private sleepBehaviour: SleepBehaviour;

  constructor(scene: Phaser.Scene, gridEngine: GridEngine, startPosX: number, startPosY: number) {
    this.scene = scene;
    this.gridEngine = gridEngine;

    this.sprite = this.scene.add.sprite(startPosX, startPosY, CatPrefab.id);
    this.sprite.scale = dimensions.scale;
    this.sprite.setDepth(2);

    this.sleepBehaviour = new SleepBehaviour(this.scene, this.gridEngine, CatPrefab.id);

    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  private start() {}

  private update(time: number, deltaTime: number) {
    // TODO: Handle animation update when movement changes
    // this.gridEngine.move(CatPrefab.id, Direction.DOWN);

    this.sleepBehaviour.update(time, deltaTime);
  }
}
