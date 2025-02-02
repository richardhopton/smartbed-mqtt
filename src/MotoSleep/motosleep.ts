import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { buildCommands } from './CommandBuilder';
import { getDevices } from './options';
import { setupCoverEntities } from './setupCoverEntities';
import { setupButtonEntities } from './setupButtonEntities';

export const motosleep = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[MotoSleep] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name.toLowerCase(), value: device }));
  const deviceNames = Object.keys(devicesMap);
  if (deviceNames.length !== devices.length) return logError('[MotoSleep] Duplicate name detected in configuration');
  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect, getCharacteristic } = bleDevice;
    const device = devicesMap[mac] || devicesMap[name.toLowerCase()];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'MotoSleep');
    await connect();

    const characteristic = await getCharacteristic(
      '0000ffe0-0000-1000-8000-00805f9b34fb',
      '0000ffe1-0000-1000-8000-00805f9b34fb'
    );
    if (!characteristic) {
      await disconnect();
      continue;
    }

    if (!device.stayConnected) await disconnect();

    const controller = new BLEController(
      deviceData,
      bleDevice,
      characteristic.handle,
      (bytes: number[]) => bytes,
      {},
      device.stayConnected
    );
    logInfo('[MotoSleep] Setting up entities for device:', name);
    const { simpleCommands, complexCommands } = buildCommands(name);
    setupButtonEntities(mqtt, controller, simpleCommands);
    setupCoverEntities(mqtt, controller, complexCommands);

    const deviceInfo = await bleDevice.getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);
  }
};
