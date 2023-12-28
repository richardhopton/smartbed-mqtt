import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logInfo } from '@utils/logger';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { Controller } from './Controller';
import { getDevices } from './options';
import { setupLightEntities } from './setupLightEntities';
import { setupMassageEntities } from './setupMassageEntities';
import { setupPresetButtons } from './setupPresetButtons';

export const reverie = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Reverie] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const bleDevices = await esphome.getBLEDevices(Object.keys(devicesMap));
  const controllers: Controller[] = [];
  for (const bleDevice of bleDevices) {
    const { name, address, connect, disconnect, getServices } = bleDevice;
    const device = devicesMap[name];
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

    controllers.push(new Controller(deviceData, bleDevice, name, characteristic.handle));
  }

  for (const controller of controllers) {
    logInfo('[Reverie] Setting up entities for device:', controller.name);
    setupPresetButtons(mqtt, controller);
    setupLightEntities(mqtt, controller);
    setupMassageEntities(mqtt, controller);
  }
};
