import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupLightEntities = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('Reverie', mqtt, controller, 'UnderBedLightsToggle', Commands.UnderBedLightsToggle);
};
