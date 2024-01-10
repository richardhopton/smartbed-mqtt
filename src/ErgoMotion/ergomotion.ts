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

const controllers: Dictionary<Controller> = {};
export const ergomotion = async (mqtt: IMQTTConnection) => {
  const users = getUsers();
  if (!users.length) return logInfo('[ErgoMotion] No users configured');

  for (const user of users) {
    const devices = await getDevices(user);
    if (!devices || devices.length === 0) {
      logError('[ErgoMotion] Could not load devices for user', user.email);
      continue;
    }

    for (const device of devices) {
      const { id, name } = device;
      if (controllers[id]) continue;

      const deviceData = buildMQTTDeviceData({ friendlyName: name, address: id, name: '' }, 'ErgoMotion');
      controllers[id] = new Controller(deviceData, device, user);
    }
  }

  for (const controller of Object.values(controllers)) {
    const {
      device,
      user: { remoteStyle },
    } = controller;
    logInfo('[ErgoMotion] Setting up bed', device.id);
    setupDeviceInfoSensor(mqtt, controller);
    setupPresetButtons(mqtt, controller);
    if (remoteStyle == 'L') continue;

    setupMassageButtons(mqtt, controller);
    setupSafetyLightsButton(mqtt, controller);
  }
};
