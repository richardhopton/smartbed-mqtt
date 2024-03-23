import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageStep', Commands.MassageStep);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageTimerStep', Commands.MassageTimerStep);
};
