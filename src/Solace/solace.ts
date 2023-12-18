import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logInfo } from '@utils/logger';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { buildMQTTDeviceData } from './buildMQTTDeviceData';
import { getDevices } from './options';
import { setupPresetButtons } from './processors/presetButtons';
import { Controller } from './types/Controller';

export const solace = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Solace] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const bleDevices = await esphome.getBLEDevices(Object.keys(devicesMap));
  const controllers: Controller[] = [];
  for (const bleDevice of bleDevices) {
    const { name, address, connect, getServices, disconnect } = bleDevice;
    const device = devicesMap[name];
    const deviceData = buildMQTTDeviceData({ ...device, address });
    await connect();
    const services = await getServices();
    await disconnect();
    const service = services.find((s) => s.uuid === '0000ffe0-0000-1000-8000-00805f9b34fb');
    if (!service) continue;
    const characteristic = service.characteristicsList.find((c) => c.uuid === '0000ffe1-0000-1000-8000-00805f9b34fb');
    if (!characteristic) continue;

    controllers.push(new Controller(deviceData, bleDevice, device, characteristic.handle));
  }

  for (const controller of controllers) {
    logInfo('[Solace] Setting up entities for device:', controller.name);
    setupPresetButtons(mqtt, controller);
  }
};
