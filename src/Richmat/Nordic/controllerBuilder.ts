import { BluetoothGATTService } from '@2colors/esphome-native-api';
import { IDeviceData } from '@ha/IDeviceData';
import { logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

export const controllerBuilder = (deviceData: IDeviceData, bleDevice: IBLEDevice, services: BluetoothGATTService[]) => {
  const { name } = bleDevice;

  const service = services.find((s) => s.uuid === '6e400001-b5a3-f393-e0a9-e50e24dcca9e');
  if (!service) {
    logInfo('[Richmat] Could not find expected services for device:', name);
    return undefined;
  }

  const writeCharacteristic = service.characteristicsList.find(
    (c) => c.uuid === '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
  );
  if (!writeCharacteristic) {
    logInfo('[Richmat] Could not find expected characteristic for device:', name);
    return undefined;
  }

  return new BLEController(deviceData, bleDevice, writeCharacteristic.handle, (byte: number) => [byte]);
};
