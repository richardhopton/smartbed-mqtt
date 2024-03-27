import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageStep', Commands.MassageStep);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageTimerStep', Commands.MassageTimerStep);
};
