import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { intToBytes } from '@utils/intToBytes';
import { logError, logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { getDevices } from './options';
import { setupMassageButtons } from './setupMassageButtons';
import { setupPresetButtons } from './setupPresetButtons';
import { setupMotorEntities } from './setupMotorEntities';

const buildCommand = (command: number) => [0x4, 0x2, ...intToBytes(command)];

export const keeson = async (mqtt: IMQTTConnection, esphome: IESPConnection): Promise<void> => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Keeson] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const deviceNames = Object.keys(devicesMap);

  if (deviceNames.length !== devices.length) return logError('[Keeson] Duplicate name detected in configuration');

  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect, getServices, getDeviceInfo } = bleDevice;
    const device = devicesMap[mac] || devicesMap[name];

    if (!device) {
      logInfo(`[Keeson] Device not found in configuration for MAC: ${mac} or Name: ${name}`);
      continue;
    }
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Keeson');
    await connect();
    const services = await getServices();

    const service = services.find((s) => s.uuid === '6e400001-b5a3-f393-e0a9-e50e24dcca9e');
    if (!service) {
      logInfo('[Keeson] Could not find expected services for device:', name);
      await disconnect();
      continue;
    }

    const characteristic = service.characteristicsList.find((c) => c.uuid === '6e400002-b5a3-f393-e0a9-e50e24dcca9e');
    if (!characteristic) {
      logInfo('[Keeson] Could not find expected characteristic for device:', name);
      await disconnect();
      continue;
    }

    const controller = new BLEController(deviceData, bleDevice, characteristic.handle, buildCommand, {}, true);

    logInfo('[Keeson] Setting up entities for device:', name);
    const deviceInfo = await getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);
    setupPresetButtons(mqtt, controller);
    setupMassageButtons(mqtt, controller);
    setupMotorEntities(mqtt, controller);
  }
};
