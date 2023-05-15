import { Direction, GridEngine, GridEngineConfig } from 'grid-engine';
import Phaser from 'phaser';

import { worldScale } from '../common/config';
import { CatPrefab } from '../entities/pets/cat/CatPrefab';
import { Player } from '../entities/player/Player';

export default class Main extends Phaser.Scene {
  public static key = 'main';

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

  initialize() {
    Reflect.apply(Phaser.Scene.call, this, Main.key);
  }

  preload(): void {
    // TODO: Load village.json directly, not using an asset pack
    this.load.tilemapTiledJSON('village', 'src/game/assets/world/village.json');
    this.load.spritesheet('grass-water-tiles', 'src/game/assets/world/Grass tiles v.2.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet(CatPrefab.id, 'src/game/entities/pets/cat/spritesheet.png', {
      frameWidth: 17,
      frameHeight: 17,
    });

    this.load.spritesheet(Player.id, 'src/game/entities/player/characters.png', {
      frameWidth: 26,
      frameHeight: 36,
    });
  }

  create(): void {
    // village
    this.village = this.make.tilemap({ key: 'village' });
    this.village.addTilesetImage('grass-water', 'Grass tiles v.2');

    // groundLayer
    const groundLayer = this.village.createLayer('GroundLevel1', ['grass-water'], 0, 0);
    if (groundLayer) {
      this.groundLayer = groundLayer;
      this.groundLayer.name = 'groundLayer';
      this.groundLayer.scale = worldScale;
    }

    // petLayer
    const petLayer = this.add.layer();

    // catPrefab
    this.catPrefab = new CatPrefab(this, this.gridEngine, 176, 208);
    petLayer.add(this.catPrefab.sprite);

    // playerLayer
    const playerLayer = this.add.layer();

    // player
    const position = new Phaser.Math.Vector2(384, 224);
    this.player = new Player(this, this.gridEngine, position.x, position.y);
    playerLayer.add(this.player.sprite);

    this.events.emit('scene-awake');

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: CatPrefab.id,
          sprite: this.catPrefab.sprite,
          speed: 3,
          facingDirection: Direction.DOWN,
          startPosition: { x: 4, y: 4 },
          walkingAnimationMapping: {
            down: {
              leftFoot: 0,
              standing: 1,
              rightFoot: 2,
            },
            up: {
              leftFoot: 3,
              standing: 4,
              rightFoot: 5,
            },
            left: {
              leftFoot: 6,
              standing: 7,
              rightFoot: 8,
            },
            right: {
              leftFoot: 9,
              standing: 10,
              rightFoot: 11,
            },
          },
        },
        {
          id: Player.id,
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
