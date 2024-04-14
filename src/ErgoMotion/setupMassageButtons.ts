import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCommandButton('ErgoMotion', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCommandButton('ErgoMotion', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);
  buildCommandButton('ErgoMotion', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCommandButton('ErgoMotion', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);
  buildCommandButton('ErgoMotion', mqtt, controller, 'MassageStep', Commands.MassageStep);
  buildCommandButton('ErgoMotion', mqtt, controller, 'MassageTimerStep', Commands.MassageTimerStep);
};
