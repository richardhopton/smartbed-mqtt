import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';

export const setupMassageEntities = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCommandButton('LeggettPlatt', mqtt, controller, 'MassageStep', Commands.MassageStep);

  buildCommandButton('LeggettPlatt', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCommandButton('LeggettPlatt', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);

  buildCommandButton('LeggettPlatt', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCommandButton('LeggettPlatt', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);

  buildCommandButton('LeggettPlatt', mqtt, controller, 'MassageWaveStep', Commands.MassageWaveStep);
};
