import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Commands } from './Commands';

export const setupLightEntities = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCommandButton('Reverie', mqtt, controller, 'UnderBedLightsToggle', Commands.UnderBedLightsToggle);
};
