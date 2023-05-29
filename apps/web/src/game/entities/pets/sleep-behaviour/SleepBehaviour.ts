import { GridEngine } from 'grid-engine';
import { StoreApi, UseBoundStore } from 'zustand';

import { CharacterId, bedPosition } from '~/game/common/config';

import { EnergyState, useEnergyStore } from './state';

// Time in ms to fully drain energy while awake
const energyDrainDuration = 5 * 60 * 1000;

// Time in ms to fully recover energy while asleep
const recoveryDuration = 2 * 60 * 1000;

export class SleepBehaviour {
  private scene: Phaser.Scene;
  private gridEngine: GridEngine;

  private characterId: CharacterId;

  private energyStore: UseBoundStore<StoreApi<EnergyState>>;

  constructor(scene: Phaser.Scene, gridEngine: GridEngine, characterId: CharacterId) {
    this.scene = scene;
    this.gridEngine = gridEngine;

    this.characterId = characterId;

    this.energyStore = useEnergyStore;
  }

  public start() {
    // no op
  }

  public update(time: number, deltaTime: number) {
    const energyState = this.energyStore.getState();
    if (energyState.isSleeping && energyState.value >= 100) {
      this.wakeUp();

      return;
    }

    if (energyState.isSleeping) {
      this.updateSleep(deltaTime);

      return;
    }

    if (energyState.value < 10 && !this.gridEngine.isMoving(this.characterId)) {
      this.navigateToBed();
    }

    const characterPos = this.gridEngine.getPosition(this.characterId);
    if (
      characterPos.x === bedPosition.x &&
      characterPos.y === bedPosition.y &&
      energyState.value < 10
    ) {
      energyState.isSleeping = true;
    }

    energyState.decrease(-(deltaTime / energyDrainDuration) * 100);
  }

  public wakeUp() {
    this.energyStore.getState().toggleSleeping(false);
  }

  public stopNavigating() {
    // no op
  }

  private navigateToBed() {
    this.gridEngine.moveTo(this.characterId, bedPosition);
  }

  private updateSleep(deltaTime: number) {
    // TODO: say zzzz

    this.energyStore.getState().increase((deltaTime / recoveryDuration) * 100);
  }
}
