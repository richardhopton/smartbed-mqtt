import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Dictionary } from '@utils/Dictionary';
import { logInfo } from '@utils/logger';
import { buildMQTTDeviceData } from 'Common/buildMQTTDeviceData';
import { Controller } from './Controller';
import { getDevices } from './options';
import { setupMassageButtons } from './setupMassageButtons';
import { setupPresetButtons } from './setupPresetButtons';
import { setupSafetyLightsButton } from './setupSafetyLightsButton';
import { setupMotorEntities } from './setupMotorEntities';

const controllers: Dictionary<Controller> = {};
export const ergomotion = async (mqtt: IMQTTConnection) => {
  const devices = getDevices();
  if (!devices.length) return logInfo('[ErgoMotion] No devices configured');

  for (const device of devices) {
    const { ipAddress, friendlyName, remoteStyle } = device;
    if (controllers[ipAddress]) continue;

    const deviceData = buildMQTTDeviceData({ friendlyName, address: ipAddress, name: '' }, 'ErgoMotion');
    const controller = new Controller(deviceData, device);
    controllers[ipAddress] = controller;
    logInfo('[ErgoMotion] Setting up bed', ipAddress);
    setupPresetButtons(mqtt, controller, remoteStyle);
    setupMotorEntities(mqtt, controller);
    if (remoteStyle == 'L') continue;

    setupMassageButtons(mqtt, controller);
    setupSafetyLightsButton(mqtt, controller);
  }
};
