import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCommandButton('Keeson', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCommandButton('Keeson', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);
  buildCommandButton('Keeson', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCommandButton('Keeson', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);
  buildCommandButton('Keeson', mqtt, controller, 'MassageTimerStep', Commands.MassageTimerStep);
  buildCommandButton('Keeson', mqtt, controller, 'MassageAllToggle', Commands.MassageStep);
};
