import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Dictionary } from '@utils/Dictionary';
import { logError, logInfo } from '@utils/logger';
import { buildMQTTDeviceData } from './buildMQTTDeviceData';
import { DeviceInfoSensor } from './entities/DeviceInfoSensor';
import { getUsers } from './options';
import { getDevices } from './requests/getDevices';
import { setupMassageButtons } from './setupMassageButtons';
import { setupPresetButtons } from './setupPresetButtons';
import { setupSafetyLightsButton } from './setupSafetyLightsButton';
import { Bed } from './types/Bed';

const beds: Dictionary<Bed> = {};

export const ergomotion = async (mqtt: IMQTTConnection) => {
  const users = getUsers();
  if (!users.length) return logInfo('[ErgoMotion] No users configured');

  for (const user of users) {
    const devices = await getDevices(user);
    if (!devices || devices.length === 0) {
      return logError('[ErgoMotion] Could not load devices');
    }

    for (const device of devices) {
      const { id } = device;
      let bed = beds[id];

      if (!bed) {
        const deviceData = buildMQTTDeviceData(device);
        bed = beds[id] = {
          id,
          deviceData,
          user,
          entities: {
            deviceInfo: new DeviceInfoSensor(mqtt, deviceData).setState(device),
          },
        };
        logInfo('[ErgoMotion] Setting up bed', id);

        setupPresetButtons(mqtt, bed);
        if (user.remoteStyle == 'L') continue;

        setupMassageButtons(mqtt, bed);
        setupSafetyLightsButton(mqtt, bed);
      }
    }
  }
};
