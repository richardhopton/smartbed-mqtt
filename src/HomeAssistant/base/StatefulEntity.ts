import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { ComponentType } from './ComponentTypeWithState';
import { Entity, EntityConfig } from './Entity';
import { IStateful } from './IStateful';

export class StatefulEntity<T> extends Entity implements IStateful<T> {
  stateTopic: string;

  private state?: T;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityConfig: EntityConfig,
    componentType: ComponentType
  ) {
    super(mqtt, deviceData, entityConfig, componentType);
    this.stateTopic = `${this.baseTopic}/state`;
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      state_topic: this.stateTopic,
    };
  }

  protected mapState(state: T | undefined): any {
    return state === undefined ? null : state;
  }

  setState(state: T | null) {
    if (state === null) {
      return this.setOffline();
    }
    if (this.state === state) return this;
    this.state = state;
    this.sendState();
    this.setOnline();
    return this;
  }

  getState() {
    return this.state;
  }

  // Re-publish the current state even if unchanged. Publishes aren't retained,
  // so a one-shot setState can lose the race with Home Assistant's discovery
  // processing (leaving the entity "unknown"). Call this each poll for entities
  // whose state would otherwise never be re-sent.
  resendState() {
    if (this.getState() !== undefined) this.sendState();
    return this;
  }

  private sendState() {
    setTimeout(() => {
      const message = this.mapState(this.state);
      this.mqtt.publish(this.stateTopic, message);
    }, 250);
  }
}
