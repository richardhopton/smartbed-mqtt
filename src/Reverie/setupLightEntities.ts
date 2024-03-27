import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';

export const setupLightEntities = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCachedButton('Reverie', mqtt, controller, 'UnderBedLightsToggle', Commands.UnderBedLightsToggle);
};
