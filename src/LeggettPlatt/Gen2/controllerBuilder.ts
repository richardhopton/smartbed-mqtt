import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { setupDebugEntities } from './setupDebugEntities';
import { setupLightEntities } from './setupLightEntities';
import { setupMassageEntities } from './setupMassageEntities';
import { setupPresetButtons } from './setupPresetButtons';
import { setupMotorEntities } from './setupMotorEntities';

export const controllerBuilder = async (mqtt: IMQTTConnection, deviceData: IDeviceData, bleDevice: IBLEDevice) => {
  const { name, getCharacteristic } = bleDevice;
  const writeCharacteristic = await getCharacteristic(
    '45e25100-3171-4cfc-ae89-1d83cf8d8071',
    '45e25101-3171-4cfc-ae89-1d83cf8d8071'
  );
  if (!writeCharacteristic) return undefined;

  const readCharacteristic = await getCharacteristic(
    '45e25100-3171-4cfc-ae89-1d83cf8d8071',
    '45e25103-3171-4cfc-ae89-1d83cf8d8071',
    false
  );
  const notifyHandles = readCharacteristic && { read: readCharacteristic.handle };

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
