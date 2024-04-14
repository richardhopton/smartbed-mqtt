import { IDeviceData } from '@ha/IDeviceData';
import { JsonSensor } from '@ha/JsonSensor';
import { EntityConfig } from '@ha/base/Entity';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { round } from '@utils/round';

type BedPosition = {
  rawPosition: number;
  angle: number;
};

export class BedPositionSensor extends JsonSensor<BedPosition> {
  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    config: EntityConfig,
    private maxPosition: number,
    private maxAngle: number
  ) {
    super(mqtt, deviceData, { ...config, valueField: 'angle' });
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      state_class: 'measurement',
      unit_of_measurement: '°',
      icon: 'mdi:angle-acute',
    };
  }

  setPosition(rawPosition: number) {
    if (rawPosition < 0) rawPosition = 0;
    // if (rawPosition > this.maxPosition) rawPosition = this.maxPosition;
    const angle =
      rawPosition > this.maxPosition ? this.maxAngle : round(this.maxAngle * (rawPosition / this.maxPosition), 1);
    this.setState({ rawPosition, angle }).setOnline();
  }
}
