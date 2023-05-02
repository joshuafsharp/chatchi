import Phaser from 'phaser';

import animations from './animations.json';
import { idle } from './animations.state';

export class CatPrefab extends Phaser.GameObjects.Sprite {
  public id = 'pet-cat' as const;

  constructor(
    scene: Phaser.Scene,
    x?: number,
    y?: number,
    texture?: string,
    frame?: number | string,
  ) {
    super(scene, x ?? 16, y ?? 16, texture || 'pet-cat', frame ?? 0);

    this.scale = 3;
    this.setDepth(2);

    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.updatePet, this);
  }

  private start() {
    this.anims.create(animations as Phaser.Types.Animations.Animation);

    this.anims.play(idle.down);
  }

  private updatePet() {
    // TODO: Handle animation update when movement changes
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
