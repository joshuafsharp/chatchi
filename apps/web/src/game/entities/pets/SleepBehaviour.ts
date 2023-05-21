import { GridEngine } from 'grid-engine';

import { CharacterId, bedPosition } from '~/game/common/config';

// Time in ms to fully drain energy while awake
const energyDrainDuration = 5 * 60 * 1000;

// Time in ms to fully recover energy while asleep
const recoveryDuration = 2 * 60 * 1000;

export class SleepBehaviour {
  private scene: Phaser.Scene;
  private gridEngine: GridEngine;

  private characterId: CharacterId;

  // Energy remaining as a percentage (0-100)
  private energy: number;

  public sleeping: boolean;

  constructor(scene: Phaser.Scene, gridEngine: GridEngine, characterId: CharacterId) {
    this.scene = scene;
    this.gridEngine = gridEngine;

    this.characterId = characterId;

    this.energy = 100;
    this.sleeping = false;
  }

  public start() {
    // no op
  }

  public update(time: number, deltaTime: number) {
    if (this.sleeping && this.energy >= 100) {
      this.wakeUp();

      return;
    }

    if (this.sleeping) {
      this.updateSleep(deltaTime);

      return;
    }

    if (this.energy < 10 && !this.gridEngine.isMoving(this.characterId)) {
      this.navigateToBed();
    }

    const characterPos = this.gridEngine.getPosition(this.characterId);
    if (characterPos.x === bedPosition.x && characterPos.y === bedPosition.y && this.energy < 10) {
      this.sleeping = true;
    }

    this.energy -= (deltaTime / energyDrainDuration) * 100;
  }

  public wakeUp() {
    this.sleeping = false;
  }

  public stopNavigating() {
    // no op
  }

  private navigateToBed() {
    this.gridEngine.moveTo(this.characterId, bedPosition);
  }

  private updateSleep(deltaTime: number) {
    // TODO: say zzzz

    this.energy += (deltaTime / recoveryDuration) * 100;
  }
}
