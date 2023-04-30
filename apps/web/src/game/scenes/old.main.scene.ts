import { Direction, GridEngine } from 'grid-engine';
import { GridEngineConfig } from 'grid-engine';
import Phaser from 'phaser';

import mapJson from '../assets/GPTRPGMap.json';
import characters from '../assets/characters.png';
import petCat from '../assets/pets/cat-asset-pack.json';
import tileset from '../assets/v2.png';
import Agent from '../entities/Agent';

export default class MainScene extends Phaser.Scene {
  agent?: Agent;

  fieldMapTileMap?: Phaser.Tilemaps.Tilemap;

  plantLayer?: Phaser.GameObjects.Container;

  gridEngine?: GridEngine;

  preload() {
    this.load.image('tiles', tileset);

    this.load.tilemapTiledJSON('field-map', mapJson);

    // this.load.pack('pet-cat', `assets/pets/cat-asset-pack.json`);
    this.load.addPack(petCat);

    this.load.spritesheet('player', characters, {
      frameWidth: 26,
      frameHeight: 36,
    });

    this.load.spritesheet('plant', tileset, {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    if (!this.gridEngine) {
      console.log('Cannot initialise grid engine');
      return;
    }

    this.fieldMapTileMap = this.make.tilemap({ key: 'field-map' });
    if (!this.fieldMapTileMap) {
      console.log('Cannot initialise tilemap');
      return;
    }

    this.fieldMapTileMap.addTilesetImage('GPTRPG', 'tiles');
    for (let i = 0; i < this.fieldMapTileMap.layers.length; i++) {
      const layer = this.fieldMapTileMap.createLayer(i, 'GPTRPG', 0, 0);
      if (layer) {
        layer.scale = 3;
      }
    }

    const plantLayer = this.fieldMapTileMap.createBlankLayer('plants', 'GPTRPG', 0, 0);
    if (plantLayer) {
      plantLayer.scale = 3;
    }

    this.plantLayer = this.add.container();

    const playerSprite = this.add.sprite(0, 0, 'player');
    playerSprite.scale = 3;
    playerSprite.setDepth(6);

    const petCatSprite = this.add.sprite(0, 0, 'pet-cat');
    petCatSprite.scale = 3;
    petCatSprite.setDepth(6);

    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);

    const agentId = 'agent1';

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

    this.gridEngine.create(this.fieldMapTileMap, gridEngineConfig);

    this.agent = new Agent(this.gridEngine, this.fieldMapTileMap, agentId, { x: 6, y: 5 });

    // Create walkable tiles bridge
    this.gridEngine.setTransition({ x: 10, y: 26 }, 'ground', 'bridge');
    this.gridEngine.setTransition({ x: 10, y: 39 }, 'bridge', 'ground');
    this.gridEngine.setTransition({ x: 11, y: 26 }, 'ground', 'bridge');
    this.gridEngine.setTransition({ x: 11, y: 39 }, 'bridge', 'ground');
    this.gridEngine.setTransition({ x: 9, y: 26 }, 'ground', 'bridge');
    this.gridEngine.setTransition({ x: 9, y: 39 }, 'bridge', 'ground');

    // EXPOSE TO EXTENSION
    window.__GRID_ENGINE__ = this.gridEngine;
  }

  update() {
    if (!this.fieldMapTileMap) {
      console.error('Error: tilemap not initialised');
      return;
    }

    if (!this.gridEngine) {
      console.error('Error: grid engine not initialised');
      return;
    }

    if (!this.agent) {
      console.error('Error: agent not initialised');
      return;
    }

    if (!this.plantLayer) {
      console.error('Error: plant layer not initialised');
      return;
    }

    if (!this.input.keyboard) {
      console.error('Error: Keyboard input is undefined. input: ', this.input);
      return;
    }

    const cursors = this.input.keyboard.createCursorKeys();

    const addPlantKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const removePlantKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const randomDestinationKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    if (randomDestinationKey.isDown) {
      this.gridEngine.moveTo('player', { x: 15, y: 18 });
    }

    if (addPlantKey.isDown) {
      const playerPosition = this.gridEngine.getPosition('player');
      const tileX = playerPosition.x;
      const tileY = playerPosition.y;

      // Get the grass layer
      const grassLayer = this.fieldMapTileMap.layers[0].tilemapLayer;

      // Check if there's a grass tile at the character's position and it has the property 'plantable'
      const grassTile = grassLayer.getTileAt(tileX, tileY);

      if (grassTile && grassTile.properties.plantable) {
        // Check if there's no tile at the character's position in other layers
        const noOtherTile = this.fieldMapTileMap.layers.every((layer, index) => {
          if (index === 0) return true; // Skip the grass layer
          return !layer.tilemapLayer.hasTileAt(tileX, tileY);
        });

        if (noOtherTile) {
          const worldPosition = this.fieldMapTileMap.tileToWorldXY(tileX, tileY);
          if (worldPosition) {
            const plant = this.add.sprite(worldPosition.x, worldPosition.y, 'plant');

            plant.setFrame(446);
            plant.setOrigin(0, 0);
            plant.scale = 3;
            this.plantLayer?.add(plant);
          }
        }
      }
    }

    if (removePlantKey.isDown) {
      const playerPosition = this.gridEngine.getPosition('player');
      const worldPosition = this.fieldMapTileMap.tileToWorldXY(playerPosition.x, playerPosition.y);

      if (worldPosition) {
        // Find all overlapping plants
        const plantsToRemove = this.plantLayer.list.filter((plant) => {
          const distance = Phaser.Math.Distance.Between(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            plant.x,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            plant.y,
            worldPosition.x,
            worldPosition.y,
          );
          return distance < (16 * 3) / 2;
        });

        // Remove all the overlapping plants
        plantsToRemove.forEach((plant) => {
          plant.destroy();
        });
      }
    }

    if (cursors.left.isDown) {
      this.agent.moveAndCheckCollision(Direction.LEFT, this.fieldMapTileMap);
    } else if (cursors.right.isDown) {
      this.agent.moveAndCheckCollision(Direction.RIGHT, this.fieldMapTileMap);
    } else if (cursors.up.isDown) {
      this.agent.moveAndCheckCollision(Direction.UP, this.fieldMapTileMap);
    } else if (cursors.down.isDown) {
      this.agent.moveAndCheckCollision(Direction.DOWN, this.fieldMapTileMap);
    }
  }
}
