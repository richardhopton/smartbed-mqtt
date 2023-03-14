import { IDeviceData } from '@ha/IDeviceData';
import { JsonSensor } from '@ha/JsonSensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { MotorStatus } from '../types/Snapshot';

type BedPosition = MotorStatus & {
  angle: number;
};

const round = (value: number, dp: number) => {
  const multiplier = Math.pow(10, dp);
  return Math.round(value * multiplier) / multiplier;
};

export class BedPositionSensor extends JsonSensor<BedPosition> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, entityDesc: string) {
    super(mqtt, deviceData, entityDesc, 'angle');
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
