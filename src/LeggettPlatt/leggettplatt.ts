import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Dictionary } from '@utils/Dictionary';
import { buildDictionary } from '@utils/buildDictionary';
import { logInfo, logWarn } from '@utils/logger';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { Controller } from './Controller';
import { getDevices } from './options';
import { setupDebugEntities } from './setupDebugEntities';
import { setupLightEntities } from './setupLightEntities';
import { setupMassageEntities } from './setupMassageEntities';
import { setupPresetButtons } from './setupPresetButtons';

const getProductId = (bleDevice: IBLEDevice) => {
  if ((bleDevice?.manufacturerDataList || []).length === 0) return undefined;
  for (const { legacyDataList } of bleDevice.manufacturerDataList) {
    if (legacyDataList.length >= 3 && legacyDataList[1] == 80 && [88, 67].includes(legacyDataList[0])) {
      return legacyDataList
        .slice(2)
        .reverse()
        .reduce((acc, cur) => (acc << 8) + cur, 0);
    }
  }
  return undefined;
};
export const leggettplatt = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[LeggettPlatt] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const bleDevices = await esphome.getBLEDevices(Object.keys(devicesMap));
  const controllers: Controller[] = [];
  for (const bleDevice of bleDevices) {
    const { name, address, connect, disconnect, getServices } = bleDevice;
    const productId = getProductId(bleDevice);
    if (![5, 7].includes(productId || 0)) {
      logWarn(
        '[LeggettPlatt] Device not supported, please contact me on Discord:',
        name,
        JSON.stringify(bleDevice.manufacturerDataList)
      );
      continue;
    }

    const device = devicesMap[name];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'LeggettPlatt');
    await connect();
    const services = await getServices();

    const service = services.find((s) => s.uuid === '45e25100-3171-4cfc-ae89-1d83cf8d8071');
    if (!service) {
      logInfo('[LeggettPlatt] Could not find expected services for device:', name);
      await disconnect();
      continue;
    }

    const writeCharacteristic = service.characteristicsList.find(
      (c) => c.uuid === '45e25101-3171-4cfc-ae89-1d83cf8d8071'
    );
    if (!writeCharacteristic) {
      logInfo('[LeggettPlatt] Could not find expected characteristic for device:', name);
      await disconnect();
      continue;
    }

    const outputHandles: Dictionary<number> = {};
    const readCharacteristic = service.characteristicsList.find(
      (c) => c.uuid === '45e25103-3171-4cfc-ae89-1d83cf8d8071'
    );
    if (readCharacteristic) outputHandles['read'] = readCharacteristic.handle;

    // const responseCharacteristic = service.characteristicsList.find(
    //   (c) => c.uuid === '45e25102-3171-4cfc-ae89-1d83cf8d8071'
    // );
    // if (responseCharacteristic) outputHandles['response'] = responseCharacteristic.handle;

    controllers.push(new Controller(deviceData, bleDevice, device, writeCharacteristic.handle, outputHandles));
  }

  for (const controller of controllers) {
    const {
      device: { name },
    } = controller;
    logInfo('[LeggettPlatt] Setting up entities for device:', name);
    setupPresetButtons(mqtt, controller);
    setupLightEntities(mqtt, controller);
    setupMassageEntities(mqtt, controller);
    setupDebugEntities(mqtt, controller);
  }
};
