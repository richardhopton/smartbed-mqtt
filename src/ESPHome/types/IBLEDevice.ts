import { BluetoothGATTCharacteristic } from '@2colors/esphome-native-api';
import { BLEManufacturerData } from './BLEAdvertisement';
import { BLEDeviceInfo } from './BLEDeviceInfo';

export interface IBLEDevice {
  name: string;
  mac: string;
  address: number;
  manufacturerDataList: BLEManufacturerData[];
  serviceUuidsList: string[];
  pair(): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  writeCharacteristic(handle: number, bytes: Uint8Array, response?: boolean): Promise<void>;
  getCharacteristic(
    serviceUuid: string,
    characteristicUuid: string,
    writeLogs?: boolean
  ): Promise<BluetoothGATTCharacteristic | undefined>;
  subscribeToCharacteristic(handle: number, notify: (data: Uint8Array) => void): Promise<void>;
  readCharacteristic(handle: number): Promise<Uint8Array>;
  getDeviceInfo(): Promise<BLEDeviceInfo | undefined>;
}
