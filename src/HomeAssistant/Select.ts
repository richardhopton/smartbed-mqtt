import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IDeviceData } from './IDeviceData';
import { EntityConfig } from './base/Entity';
import { StatefulEntity } from './base/StatefulEntity';

export class Select extends StatefulEntity<string> {
  private commandTopic: string;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityConfig: EntityConfig,
    private options: string[],
    onChange: (state: string) => Promise<void | string>
  ) {
    super(mqtt, deviceData, entityConfig, 'select');
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
      options: this.options,
    };
  }
}
