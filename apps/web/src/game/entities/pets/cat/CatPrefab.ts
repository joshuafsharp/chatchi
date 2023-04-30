/* START OF COMPILED CODE */
import Phaser from 'phaser';

/* START-USER-IMPORTS */
import animations from './animations.json';
import { idle } from './animations.state';

/* END-USER-IMPORTS */

export default class CatPrefab extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x?: number,
    y?: number,
    texture?: string,
    frame?: number | string,
  ) {
    super(scene, x ?? 16, y ?? 16, texture || 'pet-cat', frame ?? 0);

    this.scaleX = 3;
    this.scaleY = 3;

    /* START-USER-CTR-CODE */

    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.updatePet, this);

    /* END-USER-CTR-CODE */
  }

  /* START-USER-CODE */
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
