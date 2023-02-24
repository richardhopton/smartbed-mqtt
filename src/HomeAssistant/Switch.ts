import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StatefulEntity } from './base/StatefulEntity';
import { IDeviceData } from './IDeviceData';

const supportedMessages = ['ON', 'OFF'];
export class Switch extends StatefulEntity<boolean> {
  private commandTopic: string;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityDesc: string,
    onChange: (state: boolean) => Promise<void | boolean>,
    private isConfig = false
  ) {
    super(mqtt, deviceData, entityDesc, 'switch');
    this.commandTopic = `${this.baseTopic}/command`;

    mqtt.subscribe(this.commandTopic);
    mqtt.on(this.commandTopic, async (message) => {
      if (!supportedMessages.includes(message)) return;
      const value = message === 'ON';
      let result = await onChange(value);
      this.setState(result === undefined ? value : result);
    });
  }

  mapState(state?: boolean): string {
    return state ? 'ON' : 'OFF';
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      command_topic: this.commandTopic,
      ...(this.isConfig ? { entity_category: 'config' } : {}),
    };
  }
}
