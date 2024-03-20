import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Controller } from '../Controller';
import { Commands } from './Commands';

export const setupMassageEntities = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageAllOff', Commands.MassageAllOff);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageWaveStep', Commands.MassageWaveStep);
};
