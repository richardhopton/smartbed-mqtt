import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { logError } from '@utils/logger';
import { IDeviceData } from './IDeviceData';
import { EntityConfig } from './base/Entity';
import { StatefulEntity } from './base/StatefulEntity';

export type NumberSliderConfig = {
  min?: number;
  max?: number;
  icon?: string;
};

export class NumberSlider extends StatefulEntity<number> {
  private commandTopic: string;
  private min: number;
  private max: number;
  private icon?: string;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    { min = 0, max = 100, icon, ...config }: EntityConfig & NumberSliderConfig,
    onChange: (state: number) => Promise<void | number>
  ) {
    super(mqtt, deviceData, config, 'number');
    this.min = min;
    this.max = max;
    this.icon = icon;
    this.commandTopic = `${this.baseTopic}/command`;

    mqtt.subscribe(this.commandTopic);
    mqtt.on(this.commandTopic, async (message) => {
      const value = parseInt(message);
      if (Number.isNaN(value)) return;
      try {
        const result = await onChange(value);
        this.setState(result === undefined ? value : result);
      } catch (err) {
        logError(err);
      }
    });
  }

  mapState(state?: number): string | null {
    return state == undefined ? null : state.toString();
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      command_topic: this.commandTopic,
      mode: 'slider',
      icon: this.icon,
      min: this.min,
      max: this.max,
    };
  }
}
