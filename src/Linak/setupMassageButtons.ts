import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCachedButton('Linak', mqtt, controller, 'MassageAllOff', Commands.MassageAllOff);
  buildCachedButton('Linak', mqtt, controller, 'MassageAllToggle', Commands.MassageAllToggle);
  buildCachedButton('Linak', mqtt, controller, 'MassageAllUp', Commands.MassageAllUp);
  buildCachedButton('Linak', mqtt, controller, 'MassageAllDown', Commands.MassageAllDown);

  buildCachedButton('Linak', mqtt, controller, 'MassageHeadToggle', Commands.MassageHeadToggle);
  buildCachedButton('Linak', mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton('Linak', mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);

  buildCachedButton('Linak', mqtt, controller, 'MassageFootToggle', Commands.MassageFootToggle);
  buildCachedButton('Linak', mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton('Linak', mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);

  buildCachedButton('Linak', mqtt, controller, 'MassageModeStep', Commands.MassageModeStep);
};
