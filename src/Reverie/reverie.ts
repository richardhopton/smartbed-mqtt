import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo } from '@utils/logger';
import { BLEController } from 'Common/BLEController';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { getDevices } from './options';
import { setupLightEntities } from './setupLightEntities';
import { setupMassageEntities } from './setupMassageEntities';
import { setupPresetButtons } from './setupPresetButtons';

export const reverie = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Reverie] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const deviceNames = Object.keys(devicesMap);
  if (deviceNames.length !== devices.length) return logError('[Reverie] Duplicate name detected in configuration');
  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect, getServices } = bleDevice;
    const device = devicesMap[mac] || devicesMap[name];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Reverie');
    await connect();
    const services = await getServices();
    const service = services.find((s) => s.uuid === '1b1d9641-b942-4da8-89cc-98e6a58fbd93');
    if (!service) {
      logInfo('[Reverie] Could not find expected services for device:', name);
      await disconnect();
      continue;
    }
    const characteristic = service.characteristicsList.find((c) => c.uuid === '6af87926-dc79-412e-a3e0-5f85c2d55de2');
    if (!characteristic) {
      logInfo('[Reverie] Could not find expected characteristic for device:', name);
      await disconnect();
      continue;
    }

    const { handle } = characteristic;
    const controller = new BLEController(deviceData, bleDevice, handle, (bytes: number[]) => bytes, {
      notify: handle,
    });
    logInfo('[Reverie] Setting up entities for device:', name);
    setupPresetButtons(mqtt, controller);
    setupLightEntities(mqtt, controller);
    setupMassageEntities(mqtt, controller);
  }
};
