import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetFlat', Commands.PresetFlat);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetUnwind', Commands.PresetUnwind);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetSleep', Commands.PresetSleep);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetWakeUp', Commands.PresetWakeUp);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetRelax', Commands.PresetRelax);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramUnwind', Commands.ProgramUnwind, 'config');
  buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramSleep', Commands.ProgramSleep, 'config');
  buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramWakeUp', Commands.ProgramWakeUp, 'config');
  buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramRelax', Commands.ProgramRelax, 'config');
  buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramAntiSnore', Commands.ProgramAntiSnore, 'config');

  buildCachedButton('LeggettPlatt', mqtt, controller, 'Stop', Commands.Stop);
};
