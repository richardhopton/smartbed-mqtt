import { Cover } from '@ha/Cover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { arrayEquals } from '@utils/arrayEquals';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
import { buildCommandButton } from 'Common/buildCommandButton';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { buildCommands } from './CommandBuilder';
import { getDevices } from './options';

interface MotorState {
  command?: number[];
  canceled?: boolean;
}

export const motosleep = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[MotoSleep] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const deviceNames = Object.keys(devicesMap);
  if (deviceNames.length !== devices.length) return logError('[MotoSleep] Duplicate name detected in configuration');
  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect, getServices } = bleDevice;
    const device = devicesMap[mac] || devicesMap[name];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'MotoSleep');
    await connect();
    const services = await getServices();
    if (!device.stayConnected) await disconnect();

    const service = services.find((s) => s.uuid === '0000ffe0-0000-1000-8000-00805f9b34fb');
    if (!service) {
      logInfo('[MotoSleep] Could not find expected services for device:', name);
      await disconnect();
      continue;
    }

    const characteristic = service.characteristicsList.find((c) => c.uuid === '0000ffe1-0000-1000-8000-00805f9b34fb');
    if (!characteristic) {
      logInfo('[MotoSleep] Could not find expected characteristic for device:', name);
      await disconnect();
      continue;
    }

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
    for (const { name, command, category } of simpleCommands) {
      buildCommandButton('MotoSleep', mqtt, controller, name, command, category);
    }

    const { cache, writeCommand, cancelCommands } = controller;
    if (!cache.motorState) cache.motorState = {};

    for (const {
      name,
      commands: { up, down },
    } of complexCommands) {
      const coverCommand = async (command: string) => {
        const motorState = cache.motorState as MotorState;
        const originalCommand = motorState.command || [];
        motorState.command = command === 'OPEN' ? up : command === 'CLOSE' ? down : [];
        const newCommand = motorState.command;
        if (arrayEquals(originalCommand, newCommand)) return;

        motorState.canceled = true;
        await cancelCommands();
        motorState.canceled = false;

        if (newCommand.length) {
          await writeCommand(newCommand, 50, 100);
          if (motorState.canceled) return;
          cache.motorState = {};
        }
        await writeCommand([0x24, 0x62], 5, 100);
      };
      new Cover(mqtt, deviceData, buildEntityConfig(name), coverCommand).setOnline();
    }

    const deviceInfo = await bleDevice.getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);
  }
};
