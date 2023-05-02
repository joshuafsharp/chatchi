import { Direction, GridEngine } from 'grid-engine';
import Phaser from 'phaser';

import { worldScale } from '../../common/config';

export class Player {
  public id = 'player' as const;

  private gridEngine: GridEngine;

  public sprite: Phaser.GameObjects.Sprite;

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gridEngine: GridEngine, startPosX: number, startPosY: number) {
    this.scene = scene;

    this.sprite = this.scene.add.sprite(startPosX, startPosY, 'player');
    this.sprite.scale = worldScale;
    this.sprite.setDepth(7);

    this.gridEngine = gridEngine;

    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.updatePlayer, this);
  }

  get position(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }

  set position(position: Phaser.Math.Vector2) {
    this.sprite.setPosition(position.x, position.y);
  }

  private start() {}

  private updatePlayer() {
    this.handleMovement();
  }

  private handleMovement() {
    const cursors = this.scene?.input.keyboard?.createCursorKeys();
    if (!cursors) {
      console.log('Unable to access scene keyboard input');

      return;
    }

    if (cursors.left.isDown) {
      this.gridEngine.move(this.id, Direction.LEFT);
    } else if (cursors.right.isDown) {
      this.gridEngine.move(this.id, Direction.RIGHT);
    } else if (cursors.up.isDown) {
      this.gridEngine.move(this.id, Direction.UP);
    } else if (cursors.down.isDown) {
      this.gridEngine.move(this.id, Direction.DOWN);
    }
  }
}
