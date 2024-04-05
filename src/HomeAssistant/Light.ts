import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { logError } from '@utils/logger';
import { IDeviceData } from './IDeviceData';
import { EntityConfig } from './base/Entity';
import { StatefulEntity } from './base/StatefulEntity';

export type LightState = {
  status?: boolean;
  brightness?: number;
  color?: {
    r: number;
    g: number;
    b: number;
  };
};

type LightConfig = {
  supportsBrightness?: boolean;
  supportsRGB?: boolean;
};

export class Light extends StatefulEntity<LightState> {
  private supportsBrightness: boolean;
  private supportsRGB: boolean;
  private commandTopic: string;
  private supportedColorMode: string;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    { supportsBrightness, supportsRGB, ...config }: LightConfig & EntityConfig,
    onChange: (state: LightState) => Promise<void | LightState>
  ) {
    super(mqtt, deviceData, config, 'light');
    this.supportsBrightness = supportsBrightness !== undefined ? supportsBrightness : false;
    this.supportsRGB = supportsRGB !== undefined ? supportsRGB : false;
    this.supportedColorMode = this.supportsRGB ? 'rgb' : this.supportsBrightness ? 'brightness' : 'onoff';
    this.commandTopic = `${this.baseTopic}/command`;
    mqtt.subscribe(this.commandTopic);
    mqtt.on(this.commandTopic, async (message: string) => {
      const { state, ...obj } = JSON.parse(message);
      if (state == 'ON') obj.status = true;
      if (state == 'OFF') obj.status = false;
      try {
        const result = await onChange(obj);
        this.setState(result === undefined ? obj : result);
      } catch (err) {
        logError(err);
      }
    });
  }

  mapState(state: LightState | undefined): any {
    if (state === undefined) return {};
    const { status, ...rest } = state;
    return { state: status ? 'ON' : 'OFF', color_mode: this.supportedColorMode, ...rest };
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      schema: 'json',
      brightness: this.supportsBrightness,
      command_topic: this.commandTopic,
      supported_color_modes: [this.supportedColorMode],
    };
  }
}
