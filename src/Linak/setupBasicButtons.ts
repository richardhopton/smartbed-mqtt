import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Commands } from './Commands';

export const setupBasicButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCommandButton('Linak', mqtt, controller, 'AllUp', Commands.BasicAllUp);
  buildCommandButton('Linak', mqtt, controller, 'AllDown', Commands.BasicAllDown);

  buildCommandButton('Linak', mqtt, controller, 'HeadUp', Commands.BasicHeadUp);
  buildCommandButton('Linak', mqtt, controller, 'HeadDown', Commands.BasicHeadDown);

  buildCommandButton('Linak', mqtt, controller, 'FootUp', Commands.BasicFootUp);
  buildCommandButton('Linak', mqtt, controller, 'FootDown', Commands.BasicFootDown);
};
