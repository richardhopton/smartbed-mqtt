import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildDictionary } from '@utils/buildDictionary';
import { Deferred } from '@utils/deferred';
import { logError, logInfo, logWarn } from '@utils/logger';
import { wait } from '@utils/wait';
import { BLEController } from 'BLE/BLEController';
import { setupDeviceInfoSensor } from 'BLE/setupDeviceInfoSensor';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { IESPConnection } from 'ESPHome/IESPConnection';
import { calculateChecksum } from './calculateChecksum';
import { extractFeatureValuePairFromData } from './extractFeaturesFromData';
import { extractPacketFromMessage } from './extractPacketFromMessage';
import { getDevices } from './options';
import { setupLightSwitch } from './setupLightSwitch';
import { setupMotorEntities } from './setupMotorEntities';
import { byte } from '@utils/byte';

export type Command = {
  command: number[];
  data?: number[];
};

const buildComplexCommand = ({ command, data }: Command) => {
  const dataLen = data?.length || 0;

  const bytes = [
    0x40,
    ...command,
    dataLen >> 8,
    dataLen,
    0x0, // checksum byte
    ...(data || []),
    0x40,
  ].map(byte);
  bytes[5] = calculateChecksum(bytes);
  return bytes;
};

export const octo = async (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[Octo] No devices configured');

  const devicesMap = buildDictionary(devices, (device) => ({ key: device.name.toLowerCase(), value: device }));
  const deviceNames = Object.keys(devicesMap);
  if (deviceNames.length !== devices.length) return logError('[Octo] Duplicate name detected in configuration');
  const bleDevices = await esphome.getBLEDevices(deviceNames);
  for (const bleDevice of bleDevices) {
    const { name, mac, address, connect, disconnect, getCharacteristic, getDeviceInfo } = bleDevice;
    const { pin, ...device } = devicesMap[mac] || devicesMap[name.toLowerCase()];
    const deviceData = buildMQTTDeviceData({ ...device, address }, 'Octo');
    await connect();

    const characteristic = await getCharacteristic(
      '0000ffe0-0000-1000-8000-00805f9b34fb',
      '0000ffe1-0000-1000-8000-00805f9b34fb'
    );
    if (!characteristic) {
      await disconnect();
      continue;
    }

    const controller = new BLEController(
      deviceData,
      bleDevice,
      characteristic.handle,
      (command: number[] | Command) => buildComplexCommand(Array.isArray(command) ? { command: command } : command),
      {
        feedback: characteristic.handle,
      }
    );

    const featureState = { hasLight: false, lightState: false, hasPin: false, pinLock: false };
    const allFeaturesReturned = new Deferred<void>();

    const loadFeatures = (message: Uint8Array) => {
      const packet = extractPacketFromMessage(message);
      if (!packet) return;
      const { command, data } = packet;
      if (command[0] == 0x21 && command[1] == 0x71) {
        // features
        const featureValue = extractFeatureValuePairFromData(data);
        if (featureValue == null) return;

        const { feature, value } = featureValue;
        switch (feature) {
          case 0x3:
            featureState.hasPin = value[0] == 0x1;
            featureState.pinLock = value[1] !== 0x1;
            return;
          case 0x102:
            featureState.hasLight = true;
            featureState.lightState = value[0] == 0x1;
            return;
          case 0xffffff:
            return allFeaturesReturned.resolve();
        }
      }
    };
    controller.on('feedback', loadFeatures);

    logInfo('[Octo] Requesting features for device:', name);
    await controller.writeCommand([0x20, 0x71]); // request bed features
    await allFeaturesReturned;
    controller.off('feedback', loadFeatures);

    if (featureState.hasPin && featureState.pinLock) {
      if (pin?.length !== 4) {
        logError('[Octo] 4 Digit Numeric Pin Required But Not Provided');
        await disconnect();
        continue;
      }

      const sendPin = () => controller.writeCommand({ command: [0x20, 0x43], data: pin.split('').map((c) => parseInt(c)) });

      // Send the pin once up front.
      await sendPin();

      // Octo controllers drop the BLE session after ~30s unless they receive the pin again.
      // Keep sending it periodically so the connection (and controls) stay alive.
      const KEEP_ALIVE_MS = 25_000;
      const keepAlive = async () => {
        while (true) {
          await wait(KEEP_ALIVE_MS);
          try {
            await sendPin();
          } catch (err) {
            logWarn('[Octo] Failed to send keep-alive pin for device', name, err);
          }
        }
      };
      void keepAlive();
    }

    logInfo('[Octo] Setting up entities for device:', name);
    const deviceInfo = await getDeviceInfo();
    if (deviceInfo) setupDeviceInfoSensor(mqtt, controller, deviceInfo);

    if (featureState.hasLight) {
      setupLightSwitch(mqtt, controller, featureState.lightState);
    }
    setupMotorEntities(mqtt, controller);
  }
};
