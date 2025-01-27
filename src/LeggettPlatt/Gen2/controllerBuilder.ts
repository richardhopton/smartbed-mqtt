import { BluetoothGATTService } from '@2colors/esphome-native-api';
import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Dictionary } from '@utils/Dictionary';
import { logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { setupDebugEntities } from './setupDebugEntities';
import { setupLightEntities } from './setupLightEntities';
import { setupMassageEntities } from './setupMassageEntities';
import { setupPresetButtons } from './setupPresetButtons';
import { setupMotorEntities } from './setupMotorEntities';

export const controllerBuilder = (
  mqtt: IMQTTConnection,
  deviceData: IDeviceData,
  bleDevice: IBLEDevice,
  services: BluetoothGATTService[]
) => {
  const { name } = bleDevice;
  const service = services.find((s) => s.uuid === '45e25100-3171-4cfc-ae89-1d83cf8d8071');
  if (!service) {
    logInfo('[LeggettPlatt] Could not find expected services for device:', name);
    return undefined;
  }

  const writeCharacteristic = service.characteristicsList.find(
    (c) => c.uuid === '45e25101-3171-4cfc-ae89-1d83cf8d8071'
  );
  if (!writeCharacteristic) {
    logInfo('[LeggettPlatt] Could not find expected characteristic for device:', name);
    return undefined;
  }

  const notifyHandles: Dictionary<number> = {};
  const readCharacteristic = service.characteristicsList.find((c) => c.uuid === '45e25103-3171-4cfc-ae89-1d83cf8d8071');
  if (readCharacteristic) notifyHandles['read'] = readCharacteristic.handle;

  const controller = new BLEController(
    deviceData,
    bleDevice,
    writeCharacteristic.handle,
    (bytes: number[]) => bytes,
    notifyHandles
  );

  logInfo('[LeggettPlatt] Setting up entities for LP Gen2 device:', name);
  setupPresetButtons(mqtt, controller);
  setupLightEntities(mqtt, controller);
  setupMassageEntities(mqtt, controller);
  setupMotorEntities(mqtt, controller);
  setupDebugEntities(mqtt, controller);

  return controller;
};
