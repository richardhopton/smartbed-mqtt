import { BluetoothGATTCharacteristic } from '@2colors/esphome-native-api';
import { IDeviceWrapper } from './IDeviceWrapper';

export class WiLinkeDeviceWrapper implements IDeviceWrapper {
  constructor({ handle }: BluetoothGATTCharacteristic) {
    this.writeHandle = handle;
  }

  controllerType = 'WiLinke';
  getBytes(command: number) {
    return [110, 1, 0, command, command + 111];
  }
  writeHandle: number;
}
