import { GridEngine } from 'grid-engine';
import { StoreApi, UseBoundStore, create } from 'zustand';

import { CharacterId, bedPosition } from '~/game/common/config';

// Time in ms to fully drain energy while awake
const energyDrainDuration = 5 * 60 * 1000;

// Time in ms to fully recover energy while asleep
const recoveryDuration = 2 * 60 * 1000;

export interface EnergyState {
  value: number;
  increase: (by: number) => void;
  decrease: (by: number) => void;
}

export const useEnergyStore = create<EnergyState>()((set) => ({
  value: 100,
  increase: (by: number) => set((state) => ({ value: state.value + by })),
  decrease: (by: number) => set((state) => ({ value: state.value + by })),
}));

export class SleepBehaviour {
  private scene: Phaser.Scene;
  private gridEngine: GridEngine;

  private characterId: CharacterId;

  private energy: UseBoundStore<StoreApi<EnergyState>>;

  public sleeping: boolean;

  constructor(scene: Phaser.Scene, gridEngine: GridEngine, characterId: CharacterId) {
    this.scene = scene;
    this.gridEngine = gridEngine;

    this.characterId = characterId;

    this.energy = useEnergyStore;

    this.sleeping = false;
  }

  public start() {
    // no op
  }

  public update(time: number, deltaTime: number) {
    const energyState = this.energy.getState();
    if (this.sleeping && energyState.value >= 100) {
      this.wakeUp();

      return;
    }

    if (this.sleeping) {
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
      this.sleeping = true;
    }

    energyState.decrease(-(deltaTime / energyDrainDuration) * 100);
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

    this.energy.getState().increase((deltaTime / recoveryDuration) * 100);
  }
}
