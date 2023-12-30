import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { logError } from '@utils/logger';
import { IDeviceData } from './IDeviceData';
import { EntityConfig } from './base/Entity';
import { StatefulEntity } from './base/StatefulEntity';

const supportedMessages = ['ON', 'OFF'];
export class Switch extends StatefulEntity<boolean> {
  private commandTopic: string;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityConfig: EntityConfig,
    onChange: (state: boolean) => Promise<void | boolean>
  ) {
    super(mqtt, deviceData, entityConfig, 'switch');
    this.commandTopic = `${this.baseTopic}/command`;

    mqtt.subscribe(this.commandTopic);
    mqtt.on(this.commandTopic, async (message) => {
      if (!supportedMessages.includes(message)) return;
      const value = message === 'ON';
      try {
        const result = await onChange(value);
        this.setState(result === undefined ? value : result);
      } catch (err) {
        logError(err);
      }
    });
  }

  mapState(state?: boolean): string {
    return state ? 'ON' : 'OFF';
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      command_topic: this.commandTopic,
    };
  }
}
