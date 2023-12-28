import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IDeviceData } from './IDeviceData';
import { EntityConfig } from './base/Entity';
import { StatefulEntity } from './base/StatefulEntity';

export class NumberSlider extends StatefulEntity<number> {
  private commandTopic: string;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityConfig: EntityConfig,
    onChange: (state: number) => Promise<void | number>,
    private config: { min?: number; max?: number }
  ) {
    super(mqtt, deviceData, entityConfig, 'number');
    this.commandTopic = `${this.baseTopic}/command`;

    mqtt.subscribe(this.commandTopic);
    mqtt.on(this.commandTopic, async (message) => {
      const value = parseInt(message);
      let result = await onChange(value);
      this.setState(result === undefined ? value : result);
    });
  }

  mapState(state?: number): string | null {
    return state == undefined ? null : state.toString();
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      command_topic: this.commandTopic,
      min: this.config.min == undefined ? 0 : this.config.min,
      max: this.config.max == undefined ? 100 : this.config.max,
    };
  }
}
