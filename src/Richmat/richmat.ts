import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo } from '@utils/logger';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { inferDeviceWrapperFromServices } from './deviceWrappers/inferDeviceWrapperFromServices';
import { getDevices } from './options';
import { setupMassageButtons } from './setupMassageButtons';
import { setupPresetButtons } from './setupPresetButtons';
import { setupUnderBedLightButton } from './setupUnderBedLightButton';
import { Controller } from './types/Controller';

export const richmat = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Richmat] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const bleDevices = await esphome.getBLEDevices(Object.keys(devicesMap));
  for (const bleDevice of bleDevices) {
    const { name, address, connect, getServices, disconnect } = bleDevice;
    const device = devicesMap[name];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Richmat');
    await connect();
    const services = await getServices();
    if (!device.stayConnected) await disconnect();
    const deviceWrapper = inferDeviceWrapperFromServices(services);
    if (!deviceWrapper) {
      logError('[Richmat] Could not infer device from services:', services);
      await disconnect();
      continue;
    }

    const controller = new Controller(deviceData, bleDevice, device, deviceWrapper);
    logInfo('[Richmat] Setting up entities for device:', name);
    setupPresetButtons(mqtt, controller);
    setupMassageButtons(mqtt, controller);
    setupUnderBedLightButton(mqtt, controller);
  }
};
