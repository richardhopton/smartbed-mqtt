import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Commands } from './Commands';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetFlat', Commands.PresetFlat);

  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetUnwind', Commands.PresetUnwind);
  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetSleep', Commands.PresetSleep);
  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetWakeUp', Commands.PresetWakeUp);
  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetRelax', Commands.PresetRelax);
  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);

  buildCommandButton('LeggettPlatt', mqtt, controller, 'ProgramUnwind', Commands.ProgramUnwind, 'config');
  buildCommandButton('LeggettPlatt', mqtt, controller, 'ProgramSleep', Commands.ProgramSleep, 'config');
  buildCommandButton('LeggettPlatt', mqtt, controller, 'ProgramWakeUp', Commands.ProgramWakeUp, 'config');
  buildCommandButton('LeggettPlatt', mqtt, controller, 'ProgramRelax', Commands.ProgramRelax, 'config');
  buildCommandButton('LeggettPlatt', mqtt, controller, 'ProgramAntiSnore', Commands.ProgramAntiSnore, 'config');

  buildCommandButton('LeggettPlatt', mqtt, controller, 'Stop', Commands.Stop);
};
