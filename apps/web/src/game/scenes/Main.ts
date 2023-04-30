// You can write more code here
import { Agent, PlayerController } from '@game/entities';
import { GridEngine, GridEngineConfig } from 'grid-engine';

/* START OF COMPILED CODE */
import Phaser from 'phaser';

import CatPrefab from '../entities/pets/cat/CatPrefab';

/* START-USER-IMPORTS */

/* END-USER-IMPORTS */

export default class Main extends Phaser.Scene {
  private gridEngine?: GridEngine;

  private village!: Phaser.Tilemaps.Tilemap;

  preload(): void {
    this.load.pack('asset-pack', 'src/game/entities/pets/cat/asset-pack.json');
    this.load.pack('grass-water-tiles', 'src/game/assets/world/grass-water-tiles.json');
    this.load.pack('village-asset-pack', 'src/game/assets/world/village-asset-pack.json');
  }

  editorCreate(): void {
    // village
    const village = this.add.tilemap('village');
    village.addTilesetImage('grass-water', 'Grass tiles v.2');

    // groundLayer
    const groundLayer = village.createLayer('Tile Layer 1', ['grass-water'], 0, 0);
    groundLayer.name = 'groundLayer';
    groundLayer.scaleX = 3;
    groundLayer.scaleY = 3;

    // playerLayer
    this.add.layer();

    // petLayer
    const petLayer = this.add.layer();

    // prefab
    const prefab = new CatPrefab(this, 224, 288);
    petLayer.add(prefab);

    this.village = village;

    this.events.emit('scene-awake');
  }

  /* START-USER-CODE */

  // Write your code here

  create() {
    this.editorCreate();

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: agentId,
          sprite: playerSprite,
          walkingAnimationMapping: 6,
          startPosition: { x: 7, y: 6 },
        },
        {
          id: 'pet-cat',
          sprite: petCatSprite,
          walkingAnimationMapping: 0,
          startPosition: { x: 10, y: 10 },
        },
      ],
    };

    this.gridEngine?.create(this.fieldMapTileMap, gridEngineConfig);
  }

  update() {}

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
