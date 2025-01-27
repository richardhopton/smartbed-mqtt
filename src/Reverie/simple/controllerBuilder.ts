import { BluetoothGATTService } from '@2colors/esphome-native-api';
import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { setupLightEntities } from './setupLightEntities';
import { setupPresetButtons } from './setupPresetButtons';
import { setupMassageEntities } from './setupMassageEntities';
import { setupMotorEntities } from './setupMotorEntities';

const buildCommand = (bytes: number[]) => [0x55, ...bytes, bytes.reduce((acc, cur) => acc ^ cur, 0x55)];

export const controllerBuilder = (
  mqtt: IMQTTConnection,
  deviceData: IDeviceData,
  bleDevice: IBLEDevice,
  services: BluetoothGATTService[]
) => {
  const { name } = bleDevice;

  const service = services.find((s) => s.uuid === '1b1d9641-b942-4da8-89cc-98e6a58fbd93');
  if (!service) {
    logInfo('[Reverie] Could not find expected services for device:', name);
    return undefined;
  }
  const characteristic = service.characteristicsList.find((c) => c.uuid === '6af87926-dc79-412e-a3e0-5f85c2d55de2');
  if (!characteristic) {
    logInfo('[Reverie] Could not find expected characteristic for device:', name);
    return undefined;
  }

  const { handle } = characteristic;
  const controller = new BLEController(deviceData, bleDevice, handle, buildCommand, {
    notify: handle,
  });
  logInfo('[Reverie] Setting up entities for device:', name);
  setupPresetButtons(mqtt, controller);
  setupLightEntities(mqtt, controller);
  setupMassageEntities(mqtt, controller);
  setupMotorEntities(mqtt, controller);

  return controller;
};
