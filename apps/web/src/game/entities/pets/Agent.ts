import { Direction, GridEngine } from 'grid-engine';

import { Surroundings, ValidDirection } from '@chatchi/types';

export class Agent {
  private gridEngine: GridEngine;

  private fieldMapTileMap: Phaser.Tilemaps.Tilemap;

  private agent_id: string;

  private sleepiness: number;

  private bedPosition: {
    x: number;
    y: number;
  };

  private socket: WebSocket;

  constructor(
    gridEngine: GridEngine,
    fieldMapTileMap: Phaser.Tilemaps.Tilemap,
    agent_id: string,
    bedPosition = { x: 3, y: 3 },
  ) {
    this.gridEngine = gridEngine;
    this.fieldMapTileMap = fieldMapTileMap;
    this.agent_id = agent_id;
    this.sleepiness = 0;
    this.bedPosition = bedPosition;

    const socket = new WebSocket('ws://localhost:8080');
    this.socket = socket;

    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({ type: 'create_agent', agent_id }));
    });

    this.initializeServerListener();
    this.initializeMovementStoppedListener();
  }

  initializeServerListener() {
    // Listen to events from the server
    this.socket.addEventListener('message', (event) => {
      const res = JSON.parse(event.data);

      if (res.type === 'error') {
        console.error(res.message);
        return;
      }

      // Whether the agent was created or not, we want to start the next move
      if (res.type === 'agent_created') {
        console.log(res.message);
        this.nextMove();
        return;
      }

      if (res.type === 'nextMove') {
        const { data } = res;

        switch (data.action.type) {
          case 'move': {
            this.moveAndCheckCollision(data.action.direction, this.fieldMapTileMap);

            break;
          }
          case 'navigate': {
            this.gridEngine.moveTo(this.agent_id, { x: data.action.x, y: data.action.y });

            break;
          }
          case 'sleep': {
            const { x, y } = this.getCharacterPosition();

            if (x === this.bedPosition.x && y === this.bedPosition.y) {
              this.sleepiness = 0;
            } else {
              console.log(`Character ${this.agent_id} tried to sleep out of bed.`);
            }

            this.nextMove();

            break;
          }
          default: {
            setTimeout(() => {
              this.nextMove();
            }, 2000);
          }
        }
        return;
      }
    });
  }

  initializeMovementStoppedListener() {
    this.gridEngine.movementStopped().subscribe(() => {
      this.nextMove();
    });
  }

  getCharacterPosition() {
    return this.gridEngine.getPosition(this.agent_id);
  }

  getSurroundings() {
    const playerPosition = this.getCharacterPosition();
    const { x: playerX, y: playerY } = playerPosition;

    const surroundings: Surroundings = {
      up: 'walkable',
      down: 'walkable',
      left: 'walkable',
      right: 'walkable',
    };

    const directions: {
      key: ValidDirection;
      dx: -1 | 0 | 1;
      dy: -1 | 0 | 1;
    }[] = [
      { key: Direction.UP, dx: 0, dy: -1 },
      { key: Direction.DOWN, dx: 0, dy: 1 },
      { key: Direction.LEFT, dx: -1, dy: 0 },
      { key: Direction.RIGHT, dx: 1, dy: 0 },
    ];

    this.fieldMapTileMap.layers.forEach((layer) => {
      const tilemapLayer = layer.tilemapLayer;

      directions.forEach((direction) => {
        const tile = tilemapLayer.getTileAt(playerX + direction.dx, playerY + direction.dy);

        if (tile && tile.properties.ge_collide) {
          surroundings[direction.key] = 'wall';
        }
      });
    });

    return surroundings;
  }

  moveAndCheckCollision(direction: ValidDirection, fieldMapTileMap: Phaser.Tilemaps.Tilemap) {
    const currentPosition = this.gridEngine.getPosition(this.agent_id);
    const nextPosition = { ...currentPosition };

    switch (direction) {
      case 'left':
        nextPosition.x -= 1;

        break;
      case 'right':
        nextPosition.x += 1;

        break;
      case 'up':
        nextPosition.y -= 1;

        break;
      case 'down':
        nextPosition.y += 1;

        break;
      default:
        break;
    }

    // Check if the next position has a tile with the 'ge_collide' property set to true
    const collision = fieldMapTileMap.layers.some((layer) => {
      const tile = layer.tilemapLayer.getTileAt(nextPosition.x, nextPosition.y);
      return tile && tile.properties.ge_collide;
    });

    if (collision) {
      this.nextMove();
    } else {
      // TODO: Address this issue of requiring enum values instead of string literals
      this.gridEngine.move(this.agent_id, direction);
    }
  }

  increaseSleepiness() {
    this.sleepiness = Math.min(this.sleepiness + 1, 10);
  }

  nextMove() {
    const characterPosition = this.getCharacterPosition();
    // const bedP
    const surroundings = this.getSurroundings();
    this.increaseSleepiness();

    this.socket.send(
      JSON.stringify({
        type: 'requestNextMove',
        agent_id: this.agent_id,
        position: characterPosition,
        surroundings: surroundings,
        sleepiness: this.sleepiness,
      }),
    );
  }
}
