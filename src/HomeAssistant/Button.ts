import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { logError } from '@utils/logger';
import { IDeviceData } from './IDeviceData';
import { Entity, EntityConfig } from './base/Entity';

export class Button extends Entity {
  private commandTopic: string;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityConfig: EntityConfig,
    onPress: () => Promise<void>
  ) {
    super(mqtt, deviceData, entityConfig, 'button');
    this.commandTopic = `${this.baseTopic}/command`;
    mqtt.subscribe(this.commandTopic);
    mqtt.on(this.commandTopic, async (message) => {
      if (message !== 'PRESS') return;
      try {
        await onPress();
      } catch (err) {
        logError(err);
      }
    });
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      command_topic: this.commandTopic,
    };
  }
}
