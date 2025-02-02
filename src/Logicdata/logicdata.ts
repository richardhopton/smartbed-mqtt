import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo } from '@utils/logger';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { Controller } from './Controller';
import { discoverUDPDevices } from './discoverUDPDevices';
import { getDeviceId } from './getDeviceId';
import { getDevices } from './options';
import { setupMassageEntities } from './setupMassageEntities';
import { setupPresetButtons } from './setupPresetButtons';
import { setupMotorEntities } from './setupMotorEntities';

export const logicdata = async (mqtt: IMQTTConnection) => {
  const devices = getDevices();
  const devicesToDiscover = devices.filter((device) => !device.ipAddress);
  const discoveredDevices = await discoverUDPDevices(devicesToDiscover.map((d) => d.name));
  const devicesMap = buildDictionary(discoveredDevices, (device) => ({
    key: device.name.toLowerCase(),
    value: device,
  }));
  for (const { name, ...device } of devices) {
    if (!device.ipAddress) {
      const updDevice = devicesMap[name.toLowerCase()];
      if (!updDevice) continue;
      device.ipAddress = updDevice.ipAddress;
    }
    const { friendlyName, ipAddress } = device;

    const address = await getDeviceId(ipAddress);
    if (!address) {
      logError('[Logicdata] Could not load address for device:', name, ipAddress);
      continue;
    }

    const deviceData = buildMQTTDeviceData({ friendlyName, name, address }, 'Logicdata');
    const controller = new Controller(deviceData, name, ipAddress);
    logInfo('[Logicdata] Setting up entities for device:', name);
    setupPresetButtons(mqtt, controller);
    setupMassageEntities(mqtt, controller);
    setupMotorEntities(mqtt, controller);
  }
};
