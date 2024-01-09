import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { logError } from '@utils/logger';
import { IDeviceData } from './IDeviceData';
import { EntityConfig } from './base/Entity';
import { StatefulEntity } from './base/StatefulEntity';

export type SelectConfig = {
  options: string[];
};
export class Select extends StatefulEntity<string> {
  private commandTopic: string;
  private options: string[];

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    { options, ...config }: SelectConfig & EntityConfig,
    onChange: (state: string) => Promise<void | string>
  ) {
    super(mqtt, deviceData, config, 'select');
    this.commandTopic = `${this.baseTopic}/command`;
    this.options = options;

    mqtt.subscribe(this.commandTopic);
    mqtt.on(this.commandTopic, async (message) => {
      if (!this.options.includes(message)) return;
      try {
        const result = await onChange(message);
        this.setState(result === undefined ? message : result);
      } catch (err) {
        logError(err);
      }
    });
  }

  getIndex() {
    const state = this.getState();
    if (state) return this.options.indexOf(state);
    return undefined;
  }

  setIndex(index: number) {
    this.setState(this.options[index]);
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      command_topic: this.commandTopic,
      options: this.options,
    };
  }
}
