import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Dictionary } from '@utils/Dictionary';
import { buildDictionary } from '@utils/buildDictionary';
import { logError, logInfo } from '@utils/logger';
import { BLEController } from 'BLE/BLEController';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { BedPositionSensor } from './entities/BedPositionSensor';
import { getDevices } from './options';
import { setupLightEntities } from './setupLightsEntities';
import { setupMassageButtons } from './setupMassageButtons';
import { setupMotorEntities } from './setupMotorEntities';
import { setupPresetButtons } from './setupPresetButtons';

export const linak = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Linak] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name.toLowerCase(), value: device }));
  const deviceNames = Object.keys(devicesMap);
  if (deviceNames.length !== devices.length) return logError('[Linak] Duplicate name detected in configuration');
  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect, getCharacteristic } = bleDevice;
    const { hasMassage, ...device } = devicesMap[mac] || devicesMap[name.toLowerCase()];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Linak');
    await connect();

    const characteristic = await getCharacteristic(
      '99fa0001-338a-1024-8a49-009c0215f78a',
      '99fa0002-338a-1024-8a49-009c0215f78a'
    );
    if (!characteristic) {
      await disconnect();
      continue;
    }

    const { motorCount = 2 } = device;
    const notifyHandles: Dictionary<number> = {};

    const backCharacteristic = await getCharacteristic(
      '99fa0020-338a-1024-8a49-009c0215f78a',
      '99fa0028-338a-1024-8a49-009c0215f78a',
      false
    );
    if (backCharacteristic) notifyHandles['back'] = backCharacteristic.handle;

    const legCharacteristic = await getCharacteristic(
      '99fa0020-338a-1024-8a49-009c0215f78a',
      '99fa0027-338a-1024-8a49-009c0215f78a',
      false
    );
    if (legCharacteristic) notifyHandles['leg'] = legCharacteristic.handle;

    if (motorCount > 2) {
      const headCharacteristic = await getCharacteristic(
        '99fa0020-338a-1024-8a49-009c0215f78a',
        '99fa0026-338a-1024-8a49-009c0215f78a',
        false
      );
      if (headCharacteristic) notifyHandles['head'] = headCharacteristic.handle;
    }
    if (motorCount > 3) {
      const feetCharacteristic = await getCharacteristic(
        '99fa0020-338a-1024-8a49-009c0215f78a',
        '99fa0025-338a-1024-8a49-009c0215f78a',
        false
      );
      if (feetCharacteristic) notifyHandles['feet'] = feetCharacteristic.handle;
    }
    const isAdvanced = Object.keys(notifyHandles).length > 0;
    const controller = new BLEController(
      deviceData,
      bleDevice,
      characteristic.handle,
      (bytes: number[]) => bytes,
      notifyHandles
    );
    logInfo('[Linak] Setting up entities for device:', name);
    setupLightEntities(mqtt, controller);

    if (hasMassage) setupMassageButtons(mqtt, controller);

    setupMotorEntities(mqtt, controller, motorCount);

    const deviceInfo = await bleDevice.getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);

    if (!isAdvanced) continue;
    setupPresetButtons(mqtt, controller);

    const mapPositionData = (data: Uint8Array) => (data[1] << 8) | data[0];
    if (notifyHandles.head) {
      const headPositionSensor = new BedPositionSensor(mqtt, deviceData, buildEntityConfig('AngleHead'), 820, 68);
      controller.on('head', (data) => headPositionSensor.setPosition(mapPositionData(data)));
    }
    if (notifyHandles.back) {
      const backPositionSensor = new BedPositionSensor(mqtt, deviceData, buildEntityConfig('AngleBack'), 820, 68);
      controller.on('back', (data) => backPositionSensor.setPosition(mapPositionData(data)));
    }
    if (notifyHandles.leg) {
      const legPositionSensor = new BedPositionSensor(mqtt, deviceData, buildEntityConfig('AngleLeg'), 548, 45);
      controller.on('leg', (data) => legPositionSensor.setPosition(mapPositionData(data)));
    }
    if (notifyHandles.feet) {
      const feetPositionSensor = new BedPositionSensor(mqtt, deviceData, buildEntityConfig('AngleFoot'), 548, 45);
      controller.on('feet', (data) => feetPositionSensor.setPosition(mapPositionData(data)));
    }
  }
};
