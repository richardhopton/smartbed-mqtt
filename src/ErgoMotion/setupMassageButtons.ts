import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Controller } from './Controller';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageStep', Commands.MassageStep);
  buildCachedButton('ErgoMotion', mqtt, controller, 'MassageTimerStep', Commands.MassageTimerStep);
};
