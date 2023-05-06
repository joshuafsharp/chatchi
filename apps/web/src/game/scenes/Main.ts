import { Direction, GridEngine, GridEngineConfig } from 'grid-engine';
import Phaser from 'phaser';

import { worldScale } from '../common/config';
import { CatPrefab } from '../entities/pets/cat/CatPrefab';
import { Player } from '../entities/player/Player';

export default class Main extends Phaser.Scene {
  public gridEngine!: GridEngine;

  // Tiles
  private village!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;

  // Characters
  private player!: Player;
  private catPrefab!: CatPrefab;

  private gameState = {
    paused: false,
  };

  preload(): void {
    // TODO: Load village.json directly, not using an asset pack
    this.load.pack('village-asset-pack', 'src/game/assets/world/village-asset-pack.json');
    this.load.pack('grass-water-tiles', 'src/game/assets/world/grass-water-tiles.json');
    this.load.pack('cat-asset-pack', 'src/game/entities/pets/cat/cat-asset-pack.json');

    this.load.spritesheet('player', 'src/game/entities/player/characters.png', {
      frameWidth: 26,
      frameHeight: 36,
    });
  }

  create(): void {
    // village
    this.village = this.add.tilemap('village');
    this.village.addTilesetImage('grass-water', 'Grass tiles v.2');

    // groundLayer
    const groundLayer = this.village.createLayer('Tile Layer 1', ['grass-water'], 0, 0);
    if (groundLayer) {
      this.groundLayer = groundLayer;
      this.groundLayer.name = 'groundLayer';
      this.groundLayer.scale = worldScale;
    }

    // petLayer
    const petLayer = this.add.layer();

    // catPrefab
    this.catPrefab = new CatPrefab(this, 176, 208);
    petLayer.add(this.catPrefab);

    // playerLayer
    const playerLayer = this.add.layer();

    // player
    const position = new Phaser.Math.Vector2(384, 224);
    this.player = new Player(this, this.gridEngine, position.x, position.y);
    playerLayer.add(this.player.sprite);

    this.events.emit('scene-awake');

    // TODO: Fix layering of player/pet in world, player on top
    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: this.catPrefab.id,
          sprite: this.catPrefab,
          walkingAnimationMapping: 0,
          startPosition: { x: 4, y: 4 },
        },
        {
          id: this.player.id,
          sprite: this.player.sprite,
          startPosition: { x: 7, y: 6 },
          facingDirection: Direction.DOWN,
          speed: 3,
          walkingAnimationMapping: 1,
        },
      ],
    };

    this.gridEngine.create(this.groundLayer.tilemap, gridEngineConfig);

    this.cameras.main.startFollow(this.player.sprite, true);
    this.cameras.main.setFollowOffset(-this.player.sprite.width, -this.player.sprite.height);
  }

  public changePauseState(paused: boolean) {
    this.gameState.paused = paused;
  }

  public update() {
    // TODO: things
  }
}
