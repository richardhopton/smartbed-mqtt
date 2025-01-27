import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Cover } from './Cover';
import { IDeviceData } from './IDeviceData';
import { EntityConfig } from './base/Entity';

export class PositionalCover extends Cover {
  private positionTopic: string;
  private setPositionTopic: string;

  private position: number = 0;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    config: EntityConfig,
    onSetPosition: (position: number) => void,
    private options: { positionOpen?: number; positionClosed?: number; onStop?: () => void } = {}
  ) {
    super(mqtt, deviceData, config, (message) => {
      switch (message) {
        case 'OPEN':
          return onSetPosition(options.positionOpen || 100);
        case 'CLOSE':
          return onSetPosition(options.positionClosed || 0);
        case 'STOP':
          if (options.onStop) return options.onStop();
          return onSetPosition(this.position || 0);
      }
    });
    this.positionTopic = `${this.baseTopic}/position`;
    this.setPositionTopic = `${this.baseTopic}/set_position`;
    mqtt.subscribe(this.setPositionTopic);
    mqtt.on(this.setPositionTopic, (message) => onSetPosition(parseInt(message)));
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      position_topic: this.positionTopic,
      set_position_topic: this.setPositionTopic,
      position_open: this.options.positionOpen || 100,
      position_closed: this.options.positionClosed || 0,
    };
  }

  setPosition(position: number | null) {
    if (position === null) {
      return this.setOffline();
    }
    this.position = position;
    this.sendPosition();
    this.setOnline();
    return this;
  }

  getPosition() {
    return this.position;
  }

  protected mapPosition(position: number | undefined): any {
    return position === undefined ? null : position.toString();
  }

  private sendPosition() {
    setTimeout(() => {
      const message = this.mapPosition(this.position);
      this.mqtt.publish(this.positionTopic, message);
    }, 250);
  }
}
