import { IDeviceData } from '@ha/IDeviceData';
import { JsonSensor } from '@ha/JsonSensor';
import { EntityConfig } from '@ha/base/Entity';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { round } from '@utils/round';
import { MotorStatus } from '../types/Snapshot';

type BedPosition = MotorStatus & {
  angle: number;
};

export class BedPositionSensor extends JsonSensor<BedPosition> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, config: EntityConfig) {
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

  setBedPosition(motorStatus: MotorStatus, degreesPerTick: number) {
    this.setState({ ...motorStatus, angle: round(motorStatus.pulseCount / degreesPerTick, 2) }).setOnline();
  }
}
