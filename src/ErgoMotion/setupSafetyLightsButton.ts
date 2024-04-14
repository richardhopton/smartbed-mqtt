import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';

export const setupSafetyLightsButton = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCommandButton('ErgoMotion', mqtt, controller, 'SafetyLightsToggle', Commands.ToggleSafetyLights);
};
