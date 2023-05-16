import { Direction, GridEngine } from 'grid-engine';
import Phaser from 'phaser';

import { dimensions } from '~/game/common/config';

export class Player {
  public static id = 'player' as const;

  private gridEngine: GridEngine;

  public sprite: Phaser.GameObjects.Sprite;

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gridEngine: GridEngine, startPosX: number, startPosY: number) {
    this.scene = scene;

    this.sprite = this.scene.add.sprite(startPosX, startPosY, Player.id);
    this.sprite.scale = dimensions.scale;
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
      this.gridEngine.move(Player.id, Direction.LEFT);
    } else if (cursors.right.isDown) {
      this.gridEngine.move(Player.id, Direction.RIGHT);
    } else if (cursors.up.isDown) {
      this.gridEngine.move(Player.id, Direction.UP);
    } else if (cursors.down.isDown) {
      this.gridEngine.move(Player.id, Direction.DOWN);
    }
  }
}
