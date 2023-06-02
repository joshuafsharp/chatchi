import { GridEngine } from 'grid-engine';
import { DebouncedFunc, throttle } from 'lodash-es';

import { ActionResponse, MessageReponse } from '@chatchi/agent/src/ServerAgent';

import { useConversationStore } from '~/game/state/conversation';

export interface AgentState {
  availableForActivity: boolean;
  energy: number;
  userMessage?: string;
}

export class Agent {
  private gridEngine: GridEngine;

  private agentId: string;

  private socket: WebSocket;

  private agentCreated: boolean;
  private awaitingResponse: boolean;

  public handleUpdate: DebouncedFunc<(state: AgentState) => void>;

  public activityQueue: ActionResponse[];

  constructor(gridEngine: GridEngine, agentId: string) {
    this.gridEngine = gridEngine;
    this.agentId = agentId;

    this.agentCreated = false;
    this.awaitingResponse = false;

    this.activityQueue = [];

    const socket = new WebSocket('ws://localhost:8080');
    this.socket = socket;

    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({ type: 'createAgent', agentId }));
    });

    this.initializeServerListener();

    this.handleUpdate = throttle(this.update, 10000);

    // this.initializeMovementStoppedListener();
  }

  get characterPosition() {
    return this.gridEngine.getPosition(this.agentId);
  }

  private initializeServerListener() {
    // Listen to events from the server
    this.socket.addEventListener('message', (event) => {
      const res = JSON.parse(event.data);

      console.log(res);

      switch (res.type) {
        case 'error': {
          console.error(res.message);
          return;
        }

        case 'agentCreated': {
          this.agentCreated = true;

          console.log(res.message);
          return;
        }

        case 'nextActivity': {
          this.awaitingResponse = false;
          this.activityQueue.push(res.data);

          if ('speak' in res.data) {
            useConversationStore.getState().addMessage('pet-cat', res.data.speak);
          }
          return;
        }

        case 'nextMessage': {
          // TODO
        }
      }
    });
  }

  // private initializeMovementStoppedListener() {
  //   this.gridEngine.movementStopped().subscribe(() => {
  //     this.nextMove();
  //   });
  // }

  private update(state: AgentState) {
    if (!this.agentCreated || this.awaitingResponse) {
      return;
    }

    if (state.userMessage) {
      this.socket.send(
        JSON.stringify({
          agentId: this.agentId,
          type: 'requestMessage',
          userMessage: state.userMessage,
        }),
      );

      this.awaitingResponse = true;
    }

    if (state.availableForActivity) {
      this.socket.send(
        JSON.stringify({
          agentId: this.agentId,
          position: this.characterPosition,
          type: 'requestActivity',
        }),
      );

      this.awaitingResponse = true;
    }
  }

  // getSurroundings() {
  //   const playerPosition = this.getCharacterPosition();
  //   const { x: playerX, y: playerY } = playerPosition;

  //   const surroundings: Surroundings = {
  //     up: 'walkable',
  //     down: 'walkable',
  //     left: 'walkable',
  //     right: 'walkable',
  //   };

  //   const directions: {
  //     key: ValidDirection;
  //     dx: -1 | 0 | 1;
  //     dy: -1 | 0 | 1;
  //   }[] = [
  //     { key: Direction.UP, dx: 0, dy: -1 },
  //     { key: Direction.DOWN, dx: 0, dy: 1 },
  //     { key: Direction.LEFT, dx: -1, dy: 0 },
  //     { key: Direction.RIGHT, dx: 1, dy: 0 },
  //   ];

  //   this.tileMap.layers.forEach((layer) => {
  //     const tilemapLayer = layer.tilemapLayer;

  //     directions.forEach((direction) => {
  //       const tile = tilemapLayer.getTileAt(playerX + direction.dx, playerY + direction.dy);

  //       if (tile && tile.properties.ge_collide) {
  //         surroundings[direction.key] = 'wall';
  //       }
  //     });
  //   });

  //   return surroundings;
  // }

  // moveAndCheckCollision(direction: ValidDirection, tileMap: Phaser.Tilemaps.Tilemap) {
  //   const currentPosition = this.gridEngine.getPosition(this.agentId);
  //   const nextPosition = { ...currentPosition };

  //   switch (direction) {
  //     case 'left':
  //       nextPosition.x -= 1;

  //       break;
  //     case 'right':
  //       nextPosition.x += 1;

  //       break;
  //     case 'up':
  //       nextPosition.y -= 1;

  //       break;
  //     case 'down':
  //       nextPosition.y += 1;

  //       break;
  //     default:
  //       break;
  //   }

  //   // Check if the next position has a tile with the 'ge_collide' property set to true
  //   const collision = tileMap.layers.some((layer) => {
  //     const tile = layer.tilemapLayer.getTileAt(nextPosition.x, nextPosition.y);
  //     return tile && tile.properties.ge_collide;
  //   });

  //   if (collision) {
  //     this.nextMove();
  //   } else {
  //     // TODO: Address this issue of requiring enum values instead of string literals
  //     this.gridEngine.move(this.agentId, direction);
  //   }
  // }

  // nextMove() {
  //   const characterPosition = this.getCharacterPosition();
  //   const surroundings = this.getSurroundings();

  //   this.socket.send(
  //     JSON.stringify({
  //       type: 'requestNextMove',
  //       agentId: this.agentId,
  //       position: characterPosition,
  //       surroundings: surroundings,
  //       sleepiness: this.sleepiness,
  //     }),
  //   );
  // }
}
