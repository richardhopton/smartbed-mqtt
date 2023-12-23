import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { logInfo } from '@utils/logger';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { BedPositionSensor } from './entities/BedPositionSensor';
import { getDevices } from './options';
import { Commands } from './types/Commands';

export const linak = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Linak] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name, value: device }));
  const bleDevices = await esphome.getBLEDevices(Object.keys(devicesMap));
  for (const bleDevice of bleDevices) {
    const { name, address, connect, getServices } = bleDevice;
    const device = devicesMap[name];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Linak');
    await connect();
    const services = await getServices();

    const controlService = services.find((s) => s.uuid === '99fa0001-338a-1024-8a49-009c0215f78a');
    if (!controlService) {
      logInfo('[Linak] Could not find expected services for device:', name);
      continue;
    }

    const commandCharacteristic = controlService.characteristicsList.find(
      (c) => c.uuid === '99fa0002-338a-1024-8a49-009c0215f78a'
    );
    if (!commandCharacteristic) continue;

    logInfo('[Linak] Setting up entities for device:', name);
    // under bed light toggle
    const underBedLightsButton = new Button(mqtt, deviceData, buildEntityConfig('UnderBedLightsToggle'), () =>
      bleDevice.writeCharacteristic(commandCharacteristic.handle, new Uint8Array([Commands.UnderBedLightsToggle, 0x00]))
    );
    underBedLightsButton.setOnline();

    const outputService = services.find((s) => s.uuid === '99fa0020-338a-1024-8a49-009c0215f78a');
    if (!outputService) continue;

    const mapPositionData = (data: Uint8Array) => (data[1] << 8) | data[0];
    const legsPositionCharacteristic = outputService.characteristicsList.find(
      (c) => c.uuid === '99fa0027-338a-1024-8a49-009c0215f78a'
    );
    if (legsPositionCharacteristic) {
      const { handle } = legsPositionCharacteristic;
      const legPositionSensor = new BedPositionSensor(mqtt, deviceData, buildEntityConfig('AngleLeg'), 548, 45);
      bleDevice.subscribeToCharacteristic(handle, (data) => legPositionSensor.setPosition(mapPositionData(data)));
      legPositionSensor.setPosition(mapPositionData(await bleDevice.readCharacteristic(handle)));
    }

    const backPositionCharacteristic = outputService.characteristicsList.find(
      (c) => c.uuid === '99fa0028-338a-1024-8a49-009c0215f78a'
    );
    if (backPositionCharacteristic) {
      const { handle } = backPositionCharacteristic;
      const backPositionSensor = new BedPositionSensor(mqtt, deviceData, buildEntityConfig('AngleBack'), 820, 68);
      bleDevice.subscribeToCharacteristic(handle, (data) => backPositionSensor.setPosition(mapPositionData(data)));
      backPositionSensor.setPosition(mapPositionData(await bleDevice.readCharacteristic(handle)));
    }
  }
};
