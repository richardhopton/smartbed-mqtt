import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IDeviceData } from './IDeviceData';
import { Entity, EntityConfig } from './base/Entity';

export class Button extends Entity {
  private commandTopic: string;

  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, entityConfig: EntityConfig, onPress: () => void) {
    super(mqtt, deviceData, entityConfig, 'button');
    this.commandTopic = `${this.baseTopic}/command`;
    mqtt.subscribe(this.commandTopic);
    mqtt.on(this.commandTopic, (message) => {
      if (message !== 'PRESS') return;
      onPress();
    });
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      command_topic: this.commandTopic,
    };
  }
}
