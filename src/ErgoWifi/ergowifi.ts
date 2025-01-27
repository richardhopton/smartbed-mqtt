import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Dictionary } from '@utils/Dictionary';
import { logError, logInfo } from '@utils/logger';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { Controller } from './Controller';
import { getUsers } from './options';
import { getDevices } from './requests/getDevices';
import { setupDeviceInfoSensor } from './setupDeviceInfoSensor';
import { setupMassageButtons } from './setupMassageButtons';
import { setupPresetButtons } from './setupPresetButtons';
import { setupSafetyLightsButton } from './setupSafetyLightsButton';
import { setupMotorEntities } from './setupMotorEntities';

const controllers: Dictionary<Controller> = {};
export const ergowifi = async (mqtt: IMQTTConnection) => {
  const users = getUsers();
  if (!users.length) return logInfo('[ErgoWifi] No users configured');

  for (const { remoteStyle, ...user } of users) {
    const devices = await getDevices(user);
    if (!devices || devices.length === 0) {
      logError('[ErgoWifi] Could not load devices for user', user.email);
      continue;
    }

    for (const device of devices) {
      const { id, name } = device;
      if (controllers[id]) continue;

      const deviceData = buildMQTTDeviceData({ friendlyName: name, address: id, name: '' }, 'ErgoWifi');
      const controller = new Controller(deviceData, device, user);
      controllers[id] = controller;
      logInfo('[ErgoWifi] Setting up bed', device.id);
      setupDeviceInfoSensor(mqtt, controller);
      setupPresetButtons(mqtt, controller, remoteStyle);
      setupMotorEntities(mqtt, controller);
      if (remoteStyle == 'L') continue;

      setupMassageButtons(mqtt, controller);
      setupSafetyLightsButton(mqtt, controller);
    }
  }
};
