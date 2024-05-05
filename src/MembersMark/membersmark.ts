// MembersMark/membersMark.ts
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo } from '@utils/logger';
import { BLEController } from 'Common/BLEController';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { getDevices as getMembersMarkDevices } from './options';
import { setupPresetButtons as setupMembersMarkPresetButtons } from './setupPresetButtons';

// Main function to set up the MembersMark bed
export const membersMark = async (mqtt: IMQTTConnection, esphome: IESPConnection): Promise<void> => {
  const devices = getMembersMarkDevices();
  if (!devices.length) {
    logInfo('[MembersMark] No devices configured');
    return;
  }

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const deviceNames = Object.keys(devicesMap);

  if (deviceNames.length !== devices.length) {
    logError('[MembersMark] Duplicate name detected in configuration');
    return;
  }

  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect, getServices } = bleDevice;
    const device = devicesMap[mac] || devicesMap[name];

    if (!device) {
      logInfo(`[MembersMark] Device not found in configuration for MAC: ${mac} or Name: ${name}`);
      continue;
    }

    const deviceData = buildMQTTDeviceData({ ...device, address }, 'MembersMark');
    try {
      await connect();
      const services = await getServices();
      const service = services.find((s) => s.uuid === '6e400001-b5a3-f393-e0a9-e50e24dcca9e');

      if (!service) {
        logInfo('[MembersMark] Could not find expected services for device:', name);
        await disconnect();
        continue;
      }

      const characteristic = service.characteristicsList.find((c) => c.uuid === '6e400002-b5a3-f393-e0a9-e50e24dcca9e');
      if (!characteristic) {
        logInfo('[MembersMark] Could not find expected characteristic for device:', name);
        await disconnect();
        continue;
      }

      const controller = new BLEController(
        deviceData,
        bleDevice,
        characteristic.handle,
        (bytes: number[]) => bytes,
        {},
        true
      );

      logInfo('[MembersMark] Setting up entities for device:', name);
      setupMembersMarkPresetButtons(mqtt, controller);
    } catch (error) {
      logError(`[MembersMark] Error handling device ${name}:`, error);
      await disconnect();
    }
  }
};
