import { Direction, GridEngine, GridEngineConfig } from 'grid-engine';
import Phaser from 'phaser';

import { dimensions, tilesets, worldLayers } from '../common/config';
import { CatPrefab } from '../entities/pets/cat/CatPrefab';
import { Player } from '../entities/player/Player';

export default class Main extends Phaser.Scene {
  public static key = 'main';

  public gridEngine!: GridEngine;

  // Tiles
  private village!: Phaser.Tilemaps.Tilemap;

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
    this.load.tilemapTiledJSON('village', 'src/game/assets/world/village.json');

    for (const tileset of tilesets) {
      this.load.spritesheet(tileset, `src/game/assets/world/tilesets/${tileset}.png`, {
        frameWidth: dimensions.frameWidth,
        frameHeight: dimensions.frameHeight,
      });
    }

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
    for (const tileset of tilesets) {
      this.village.addTilesetImage(tileset);
    }

    for (const layer of worldLayers) {
      const villageLayer = this.village.createLayer(layer, tilesets, 0, 0);
      if (villageLayer) {
        villageLayer.name = layer;
        villageLayer.scale = dimensions.scale;
      }
    }

    const objects1 = this.village.createFromObjects('Objects', {});
    const objects2 = this.village.createFromObjects('Objects2', {});
    for (const object of [...objects1, ...objects2]) {
      if (object instanceof Phaser.GameObjects.Sprite) {
        object.setPosition(object.x * dimensions.scale, object.y * dimensions.scale);
        object.setScale(dimensions.scale);
        object.setDepth(4);
      }
    }

    // petLayer
    const petLayer = this.add.layer();
    petLayer.setName('Pet');
    petLayer.setDepth(10);

    // catPrefab
    const catPosition = new Phaser.Math.Vector2(3, 4);
    this.catPrefab = new CatPrefab(this, this.gridEngine, catPosition.x, catPosition.y);
    petLayer.add(this.catPrefab.sprite);

    // playerLayer
    const playerLayer = this.add.layer();
    playerLayer.setName('Player');
    playerLayer.setDepth(11);

    // player
    const playerPosition = new Phaser.Math.Vector2(7, 6);
    this.player = new Player(this, this.gridEngine, playerPosition.x, playerPosition.y);
    playerLayer.add(this.player.sprite);

    this.events.emit('scene-awake');

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: CatPrefab.id,
          sprite: this.catPrefab.sprite,
          speed: 3,
          facingDirection: Direction.DOWN,
          startPosition: catPosition,
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
          startPosition: playerPosition,
          facingDirection: Direction.DOWN,
          speed: 3,
          walkingAnimationMapping: 1,
        },
      ],
    };

    this.gridEngine.create(this.village, gridEngineConfig);

    this.cameras.main.startFollow(this.player.sprite, true);
    this.cameras.main.setFollowOffset(-this.player.sprite.width, -this.player.sprite.height);
  }

  public changePauseState(paused: boolean) {
    this.gameState.paused = paused;
  }

  public update(time, deltaTime) {
    // TODO: things
  }
}
