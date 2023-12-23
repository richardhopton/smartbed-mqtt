import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logInfo } from '@utils/logger';
import { Controller } from 'Common/Controller';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { buildCommands } from './CommandBuilder';
import { getDevices } from './options';

export const motosleep = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[MotoSleep] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const bleDevices = await esphome.getBLEDevices(Object.keys(devicesMap));
  const controllers: Controller[] = [];
  for (const bleDevice of bleDevices) {
    const { name, address, connect, disconnect, getServices } = bleDevice;
    const device = devicesMap[name];
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

    controllers.push(new Controller(deviceData, bleDevice, name, characteristic.handle, device.stayConnected));
  }

  for (const { name, entities, deviceData, writeData } of controllers) {
    logInfo('[MotoSleep] Setting up entities for device:', name);
    const commands = buildCommands(name);
    for (const { name, command, category } of commands.filter((c) => !c.repeat)) {
      if (!entities[name]) {
        entities[name] = new Button(mqtt, deviceData, buildEntityConfig(name, category), () => writeData(command));
      }
      entities[name].setOnline();
    }
  }
};
