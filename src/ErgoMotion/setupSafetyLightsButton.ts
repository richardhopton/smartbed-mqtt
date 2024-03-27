import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';

export const setupSafetyLightsButton = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCachedButton('ErgoMotion', mqtt, controller, 'SafetyLightsToggle', Commands.ToggleSafetyLights);
};
