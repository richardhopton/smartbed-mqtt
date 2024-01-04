import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logInfo } from '@utils/logger';
import { Controller } from 'Common/Controller';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { getDevices } from './options';
import { setupPresetButtons } from './setupPresetButtons';

const nameMapper = (name: string) =>
  name.replace(':', 'A').replace(';', 'B').replace('<', 'C').replace('=', 'D').replace('>', 'E').replace('?', 'F');

export const solace = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Solace] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: nameMapper(device.name), value: device }));
  const bleDevices = await esphome.getBLEDevices(Object.keys(devicesMap), nameMapper);
  const controllers: Controller[] = [];
  for (const bleDevice of bleDevices) {
    const { name, address, connect, disconnect, getServices } = bleDevice;
    const device = devicesMap[name];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Solace');
    await connect();
    const services = await getServices();
    const service = services.find((s) => s.uuid === '0000ffe0-0000-1000-8000-00805f9b34fb');
    if (!service) {
      logInfo('[Solace] Could not find expected services for device:', name);
      await disconnect();
      continue;
    }
    const characteristic = service.characteristicsList.find((c) => c.uuid === '0000ffe1-0000-1000-8000-00805f9b34fb');
    if (!characteristic) {
      logInfo('[Solace] Could not find expected characteristic for device:', name);
      await disconnect();
      continue;
    }

    controllers.push(new Controller(deviceData, bleDevice, name, characteristic.handle, true));
  }

  for (const controller of controllers) {
    logInfo('[Solace] Setting up entities for device:', controller.name);
    setupPresetButtons(mqtt, controller);
  }
};
