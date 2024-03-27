import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageStep', Commands.MassageStep);
  buildCachedButton('ErgoWifi', mqtt, controller, 'MassageTimerStep', Commands.MassageTimerStep);
};
