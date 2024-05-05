import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCachedButton('MembersMark', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCachedButton('MembersMark', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);
  buildCachedButton('MembersMark', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('MembersMark', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('MembersMark', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);

  buildCachedButton('MembersMark', mqtt, controller, 'MassageHead', Commands.MassageHead);
  buildCachedButton('MembersMark', mqtt, controller, 'MassageFoot', Commands.MassageFoot);
  buildCachedButton('MembersMark', mqtt, controller, 'MassageTimerStep', Commands.MassageTimerStep);
  buildCachedButton('MembersMark', mqtt, controller, 'MassageAllToggle', Commands.MassageAllToggle);
};
