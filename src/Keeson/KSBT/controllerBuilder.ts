import { IDeviceData } from '@ha/IDeviceData';
import { intToBytes } from '@utils/intToBytes';
import { BLEController } from 'BLE/BLEController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

const buildCommand = (command: number) => [0x4, 0x2, ...intToBytes(command)];

export const controllerBuilder = async (deviceData: IDeviceData, bleDevice: IBLEDevice) => {
  const { getCharacteristic } = bleDevice;

  const characteristic = await getCharacteristic(
    '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
  );
  if (!characteristic) return undefined;

  return new BLEController(deviceData, bleDevice, characteristic.handle, buildCommand);
};
