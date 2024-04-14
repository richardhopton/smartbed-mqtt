import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Commands } from './Commands';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCommandButton('Linak', mqtt, controller, 'MassageAllOff', Commands.MassageAllOff);
  buildCommandButton('Linak', mqtt, controller, 'MassageAllToggle', Commands.MassageAllToggle);
  buildCommandButton('Linak', mqtt, controller, 'MassageAllUp', Commands.MassageAllUp);
  buildCommandButton('Linak', mqtt, controller, 'MassageAllDown', Commands.MassageAllDown);

  buildCommandButton('Linak', mqtt, controller, 'MassageHeadToggle', Commands.MassageHeadToggle);
  buildCommandButton('Linak', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCommandButton('Linak', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);

  buildCommandButton('Linak', mqtt, controller, 'MassageFootToggle', Commands.MassageFootToggle);
  buildCommandButton('Linak', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCommandButton('Linak', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);

  buildCommandButton('Linak', mqtt, controller, 'MassageModeStep', Commands.MassageModeStep);
};
