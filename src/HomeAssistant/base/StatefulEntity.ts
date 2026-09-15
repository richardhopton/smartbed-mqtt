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

  // Re-send availability and the current state. Messages are published without the
  // retain flag, so anything HA missed (restart, broker reconnect) is gone; and setState
  // is a no-op when the value is unchanged, which would otherwise leave the entity
  // permanently unavailable. Callers invoke this on each refresh cycle.
  republish() {
    if (this.state === undefined) return this;
    this.sendState();
    this.setOnline();
    return this;
  }

  private sendState() {
    setTimeout(() => {
      const message = this.mapState(this.state);
      this.mqtt.publish(this.stateTopic, message);
    }, 250);
  }
}
