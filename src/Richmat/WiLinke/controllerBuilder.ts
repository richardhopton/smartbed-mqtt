import { BluetoothGATTService } from '@2colors/esphome-native-api';
import { IDeviceData } from '@ha/IDeviceData';
import { logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { supportedBeds } from './supportedBeds';

const buildCommand = (command: number) => [110, 1, 0, command, command + 111];

export const controllerBuilder = (deviceData: IDeviceData, bleDevice: IBLEDevice, services: BluetoothGATTService[]) => {
  const { name } = bleDevice;

  for (const { serviceUuid, writeCharacteristicUuid } of supportedBeds) {
    const service = services.find((s) => s.uuid === serviceUuid);
    if (!service) continue;
    const writeCharacteristic = service.characteristicsList.find((c) => c.uuid === writeCharacteristicUuid);
    if (!writeCharacteristic) continue;
    return new BLEController(deviceData, bleDevice, writeCharacteristic.handle, buildCommand);
  }

  logInfo('[Richmat] Could not find expected service for device:', name);
  return undefined;
};
