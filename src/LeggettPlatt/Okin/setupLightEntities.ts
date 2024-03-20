import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Controller } from '../Controller';
import { Commands } from './Commands';

export const setupLightEntities = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('LeggettPlatt', mqtt, controller, 'UnderBedLightsToggle', Commands.UnderBedLightsToggle);
};
