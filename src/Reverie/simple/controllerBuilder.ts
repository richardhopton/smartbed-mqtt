import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { setupLightEntities } from './setupLightEntities';
import { setupPresetButtons } from './setupPresetButtons';
import { setupMassageEntities } from './setupMassageEntities';
import { setupMotorEntities } from './setupMotorEntities';
import { setupEventListeners } from './setupEventListeners';

const buildCommand = (bytes: number[]) => [0x55, ...bytes, bytes.reduce((acc, cur) => acc ^ cur, 0x55)];

export const controllerBuilder = async (mqtt: IMQTTConnection, deviceData: IDeviceData, bleDevice: IBLEDevice) => {
  const { name, getCharacteristic } = bleDevice;

  const characteristic = await getCharacteristic(
    '1b1d9641-b942-4da8-89cc-98e6a58fbd93',
    '6af87926-dc79-412e-a3e0-5f85c2d55de2'
  );
  if (!characteristic) return undefined;

  const { handle } = characteristic;
  const controller = new BLEController(deviceData, bleDevice, handle, buildCommand, {
    notify: handle,
  });
  logInfo('[Reverie] Setting up entities for device:', name);
  setupPresetButtons(mqtt, controller);
  setupLightEntities(mqtt, controller);
  setupMassageEntities(mqtt, controller);
  setupMotorEntities(mqtt, controller);
  setupEventListeners(mqtt, controller);

  return controller;
};
