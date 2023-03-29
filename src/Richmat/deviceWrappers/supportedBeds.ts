import { BluetoothGATTCharacteristic } from '@2colors/esphome-native-api';
import { IDeviceWrapper } from './IDeviceWrapper';
import { NordicDeviceWrapper } from './NordicDeviceWrapper';
import { WiLinkeDeviceWrapper } from './WiLinkeDeviceWrapper';

type SupportedBed = {
  serviceUuid: string;
  writeCharacteristicUuid: string;
  readCharacteristicUuid: string;
  deviceBuilder: (characteristic: BluetoothGATTCharacteristic) => IDeviceWrapper;
};
export const supportedBeds: SupportedBed[] = [
  {
    serviceUuid: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    writeCharacteristicUuid: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    readCharacteristicUuid: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
    deviceBuilder: (characteristic: BluetoothGATTCharacteristic) => new NordicDeviceWrapper(characteristic),
  },
  {
    serviceUuid: '8ebd4f76-da9d-4b5a-a96e-8ebfbeb622e7',
    writeCharacteristicUuid: 'd44bc439-abfd-45a2-b575-925416129600',
    readCharacteristicUuid: 'd44bc439-abfd-45a2-b575-925416129601',
    deviceBuilder: (characteristic: BluetoothGATTCharacteristic) => new WiLinkeDeviceWrapper(characteristic),
  },
  {
    serviceUuid: '0000fee9-0000-1000-8000-00805f9b34fb',
    writeCharacteristicUuid: 'd44bc439-abfd-45a2-b575-925416129600',
    readCharacteristicUuid: 'd44bc439-abfd-45a2-b575-925416129601',
    deviceBuilder: (characteristic: BluetoothGATTCharacteristic) => new WiLinkeDeviceWrapper(characteristic),
  },
  {
    serviceUuid: '0000fee9-0000-1000-8000-00805f9b34bb',
    writeCharacteristicUuid: 'd44bc439-abfd-45a2-b575-925416129622',
    readCharacteristicUuid: 'd44bc439-abfd-45a2-b575-925416129611',
    deviceBuilder: (characteristic: BluetoothGATTCharacteristic) => new WiLinkeDeviceWrapper(characteristic),
  },
  {
    serviceUuid: '0000fff0-0000-1000-8000-00805f9b34fb',
    writeCharacteristicUuid: '0000fff2-0000-1000-8000-00805f9b34fb',
    readCharacteristicUuid: '0000fff1-0000-1000-8000-00805f9b34fb',
    deviceBuilder: (characteristic: BluetoothGATTCharacteristic) => new WiLinkeDeviceWrapper(characteristic),
  },
];
