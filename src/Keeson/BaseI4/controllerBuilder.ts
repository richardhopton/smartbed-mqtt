import { IDeviceData } from '@ha/IDeviceData';
import { byte } from '@utils/byte';
import { intToBytes } from '@utils/intToBytes';
import { sum } from '@utils/sum';
import { BLEController } from 'BLE/BLEController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

const buildCommand = (command: number) => {
  const data = [0xe5, 0xfe, 0x16, ...intToBytes(command).reverse()];
  const checksum = data.reduce(sum) ^ 0xff;
  data.push(checksum);
  return data.map(byte);
};

export const controllerBuilder = async (deviceData: IDeviceData, bleDevice: IBLEDevice) => {
  const { getCharacteristic } = bleDevice;

  const writeCharacteristic = await getCharacteristic(
    '0000ffe5-0000-1000-8000-00805f9b34fb',
    '0000ffe9-0000-1000-8000-00805f9b34fb'
  );
  if (!writeCharacteristic) return undefined;

  return new BLEController(deviceData, bleDevice, writeCharacteristic.handle, buildCommand);
};
