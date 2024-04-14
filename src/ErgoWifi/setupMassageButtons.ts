import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCommandButton('ErgoWifi', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCommandButton('ErgoWifi', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);
  buildCommandButton('ErgoWifi', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCommandButton('ErgoWifi', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);
  buildCommandButton('ErgoWifi', mqtt, controller, 'MassageStep', Commands.MassageStep);
  buildCommandButton('ErgoWifi', mqtt, controller, 'MassageTimerStep', Commands.MassageTimerStep);
};
