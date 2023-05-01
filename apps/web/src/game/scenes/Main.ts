// You can write more code here
import { Agent, PlayerController } from '@game/entities';
import { GridEngine, GridEngineConfig } from 'grid-engine';

/* START OF COMPILED CODE */
import Phaser from 'phaser';

import CatPrefab from '../entities/pets/cat/CatPrefab';
import PlayerPrefab from '../entities/player/assets/tone1/PlayerPrefab';

/* START-USER-IMPORTS */

/* END-USER-IMPORTS */

export default class Main extends Phaser.Scene {
  constructor() {
    super('Main');

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  preload(): void {
    this.load.pack('village-asset-pack', 'src/game/assets/world/village-asset-pack.json');
    this.load.pack('grass-water-tiles', 'src/game/assets/world/grass-water-tiles.json');
    this.load.pack('cat-asset-pack', 'src/game/entities/pets/cat/cat-asset-pack.json');
    this.load.pack(
      'player-asset-pack',
      'src/game/entities/player/assets/tone1/player-asset-pack.json',
    );
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
    const playerLayer = this.add.layer();

    // playerPrefab
    const playerPrefab = new PlayerPrefab(this, 384, 224);
    playerLayer.add(playerPrefab);

    // petLayer
    const petLayer = this.add.layer();

    // catPrefab
    const catPrefab = new CatPrefab(this, 176, 208);
    petLayer.add(catPrefab);

    this.groundLayer = groundLayer;
    this.playerPrefab = playerPrefab;
    this.catPrefab = catPrefab;
    this.village = village;

    this.events.emit('scene-awake');
  }

  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private playerPrefab!: PlayerPrefab;
  private catPrefab!: CatPrefab;
  private village!: Phaser.Tilemaps.Tilemap;

  /* START-USER-CODE */

  public gridEngine!: GridEngine;

  // Write your code here

  create() {
    this.editorCreate();

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: this.playerPrefab.id,
          sprite: this.playerPrefab,
          walkingAnimationMapping: 0,
          startPosition: { x: 7, y: 6 },
        },
        {
          id: this.catPrefab.id,
          sprite: this.catPrefab,
          walkingAnimationMapping: 0,
          startPosition: { x: 4, y: 4 },
        },
      ],
    };

    this.gridEngine.create(this.groundLayer.tilemap, gridEngineConfig);
  }

  update() {}

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
