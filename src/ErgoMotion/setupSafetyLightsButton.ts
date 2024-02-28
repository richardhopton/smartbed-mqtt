import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupSafetyLightsButton = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('ErgoMotion', mqtt, controller, 'SafetyLightsToggle', Commands.ToggleSafetyLights);
};
