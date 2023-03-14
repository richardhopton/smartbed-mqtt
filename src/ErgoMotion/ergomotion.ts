import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Dictionary } from '@utils/Dictionary';
import { logError, logInfo } from '@utils/logger';
import { buildMQTTDeviceData } from './buildMQTTDeviceData';
import { DeviceInfoSensor } from './entities/DeviceInfoSensor';
import { getUsers } from './options';
import { setupMassageButtons } from './processors/massageButtons';
import { setupPresetButtons } from './processors/presetButtons';
import { processSafetyLightButton } from './processors/safetyLightButton';
import { getDevices } from './requests/getDevices';
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

        await setupPresetButtons(mqtt, bed);
        await setupMassageButtons(mqtt, bed);
        await processSafetyLightButton(mqtt, bed);
      }
    }
  }
};
