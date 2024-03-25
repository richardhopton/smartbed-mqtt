import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Controller } from './Controller';

export const setupSafetyLightsButton = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('ErgoMotion', mqtt, controller, 'SafetyLightsToggle', Commands.ToggleSafetyLights);
};
