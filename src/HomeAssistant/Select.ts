import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StatefulEntity } from './base/StatefulEntity';
import { IDeviceData } from './IDeviceData';

export class Select extends StatefulEntity<string> {
  private commandTopic: string;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityDesc: string,
    private options: string[],
    onChange: (state: string) => Promise<void | string>,
    private isConfig = false
  ) {
    super(mqtt, deviceData, entityDesc, 'select');
    this.commandTopic = `${this.baseTopic}/command`;

    mqtt.subscribe(this.commandTopic);
    mqtt.on(this.commandTopic, async (message) => {
      if (!this.options.includes(message)) return;
      let result = await onChange(message);
      this.setState(result === undefined ? message : result);
    });
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      command_topic: this.commandTopic,
      ...(this.isConfig ? { entity_category: 'config' } : {}),
      options: this.options,
    };
  }
}
