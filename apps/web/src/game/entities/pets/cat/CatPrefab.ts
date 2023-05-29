import { GridEngine } from 'grid-engine';
import Phaser from 'phaser';

import { dimensions } from '~/game/common/config';

import { Agent, AgentState } from '../Agent';
import { SleepBehaviour } from '../sleep-behaviour/SleepBehaviour';
import { useEnergyStore } from '../sleep-behaviour/state';

export class CatPrefab {
  public static id = 'pet-cat' as const;

  public sprite: Phaser.GameObjects.Sprite;

  private gridEngine: GridEngine;
  private scene: Phaser.Scene;

  private agent: Agent;
  private sleepBehaviour: SleepBehaviour;

  constructor(scene: Phaser.Scene, gridEngine: GridEngine, startPosX: number, startPosY: number) {
    this.scene = scene;
    this.gridEngine = gridEngine;

    this.sprite = this.scene.add.sprite(startPosX, startPosY, CatPrefab.id);
    this.sprite.scale = dimensions.scale;
    this.sprite.setDepth(2);

    this.agent = new Agent(this.gridEngine, CatPrefab.id);
    this.sleepBehaviour = new SleepBehaviour(this.scene, this.gridEngine, CatPrefab.id);

    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  private start() {}

  private update(time: number, deltaTime: number) {
    // TODO: Handle animation update when movement changes
    // this.gridEngine.move(CatPrefab.id, Direction.DOWN);
    const energyState = useEnergyStore.getState();

    const agentState: AgentState = {
      availableForActivity: !energyState.isSleeping,
      energy: energyState.value,
    };

    this.agent.handleUpdate(agentState);

    this.processAgentActivities();

    if (this.agent.speechMessage) {
      // TODO: Say thing
    }

    this.sleepBehaviour.update(time, deltaTime);
  }

  private processAgentActivities() {
    if (this.agent.activityQueue.length === 0) {
      return;
    }

    console.log(this.agent.activityQueue);

    const activity = this.agent.activityQueue[0];

    // The activity has been processed
    if (activity.action.type === 'wait') {
      this.agent.activityQueue.shift();

      return;
    }

    if (!this.gridEngine.isMoving(CatPrefab.id)) {
      this.agent.activityQueue.shift();

      this.gridEngine.moveTo(CatPrefab.id, activity.action.position);
    }
  }
}
