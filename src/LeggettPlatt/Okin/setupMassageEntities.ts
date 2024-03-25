import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';

export const setupMassageEntities = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageStep', Commands.MassageStep);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'MassageWaveStep', Commands.MassageWaveStep);
};
