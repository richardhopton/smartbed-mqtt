import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Entity } from './base/Entity';
import { IDeviceData } from './IDeviceData';

export class Button extends Entity {
  private commandTopic: string;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityDesc: string,
    onPress: () => void,
    private isConfig = false
  ) {
    super(mqtt, deviceData, entityDesc, 'button');
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
      ...(this.isConfig ? { entity_category: 'config' } : {}),
    };
  }
}
