import { BluetoothGATTCharacteristic } from '@2colors/esphome-native-api';
import { IDeviceWrapper } from './IDeviceWrapper';

export class NordicDeviceWrapper implements IDeviceWrapper {
  constructor({ handle }: BluetoothGATTCharacteristic) {
    this.writeHandle = handle;
  }

  controllerType = 'Nordic';
  getBytes(command: number): Uint8Array {
    return new Uint8Array([command]);
  }
  writeHandle: number;
}
