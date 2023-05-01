// You can write more code here

/* START OF COMPILED CODE */
import { Direction, GridEngine } from 'grid-engine';
import Phaser from 'phaser';

import Main from '~/game/scenes/Main';

/* START-USER-IMPORTS */
import animations from './animations.json';
import { idle, walk } from './animations.state';

/* END-USER-IMPORTS */

export default class PlayerPrefab extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x?: number,
    y?: number,
    texture?: string,
    frame?: number | string,
  ) {
    super(scene, x ?? 16, y ?? 16, texture || 'spritesheet', frame ?? 0);

    this.scaleX = 3;
    this.scaleY = 3;

    // upKey
    const upKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

    // rightKey
    const rightKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // downKey
    const downKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    // leftKey
    const leftKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    this.upKey = upKey;
    this.rightKey = rightKey;
    this.downKey = downKey;
    this.leftKey = leftKey;

    /* START-USER-CTR-CODE */

    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.updatePlayer, this);

    this.gridEngine = (this.scene as Main).gridEngine;

    /* END-USER-CTR-CODE */
  }

  private upKey: Phaser.Input.Keyboard.Key;
  private rightKey: Phaser.Input.Keyboard.Key;
  private downKey: Phaser.Input.Keyboard.Key;
  private leftKey: Phaser.Input.Keyboard.Key;

  /* START-USER-CODE */
  public id = 'player';

  private gridEngine!: GridEngine;

  private start() {
    this.anims.create(animations as Phaser.Types.Animations.Animation);

    this.anims.play(idle.down);
  }

  private updatePlayer() {
    this.move();
  }

  // TODO: Fix animations
  private move() {
    if (this.upKey.isDown) {
      this.gridEngine.move(this.id, Direction.UP);

      this.anims.play(walk.up);
    } else if (this.rightKey.isDown) {
      this.gridEngine.move(this.id, Direction.RIGHT);

      this.anims.play(walk.right);
    } else if (this.downKey.isDown) {
      this.gridEngine.move(this.id, Direction.DOWN);

      this.anims.play(walk.down);
    } else if (this.leftKey.isDown) {
      this.gridEngine.move(this.id, Direction.LEFT);

      this.anims.play(walk.left);
    }
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
