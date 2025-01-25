import { BluetoothGATTService } from '@2colors/esphome-native-api';
import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { intToBytes } from '@utils/intToBytes';
import { logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { setupLightEntities } from './setupLightEntities';
import { setupMassageEntities } from './setupMassageEntities';
import { setupPresetButtons } from './setupPresetButtons';
import { setupMotorEntities } from './setupMotorEntities';

const buildCommand = (command: number) => [0x4, 0x2, ...intToBytes(command)];

export const controllerBuilder = async (
  mqtt: IMQTTConnection,
  deviceData: IDeviceData,
  bleDevice: IBLEDevice,
  services: BluetoothGATTService[]
) => {
  const { name } = bleDevice;
  await bleDevice.pair();

  const service = services.find((s) => s.uuid === '62741523-52f9-8864-b1ab-3b3a8d65950b');
  if (!service) {
    logInfo('[LeggettPlatt] Could not find expected services for device:', name);
    return undefined;
  }

  const writeCharacteristic = service.characteristicsList.find(
    (c) => c.uuid === '62741525-52f9-8864-b1ab-3b3a8d65950b'
  );
  if (!writeCharacteristic) {
    logInfo('[LeggettPlatt] Could not find expected characteristic for device:', name);
    return undefined;
  }

  const controller = new BLEController(deviceData, bleDevice, writeCharacteristic.handle, buildCommand);

  logInfo('[LeggettPlatt] Setting up entities for LP Okin device:', name);
  setupPresetButtons(mqtt, controller);
  setupLightEntities(mqtt, controller);
  setupMassageEntities(mqtt, controller);
  setupMotorEntities(mqtt, controller);

  return controller;
};
