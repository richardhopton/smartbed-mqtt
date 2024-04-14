import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Commands } from './Commands';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCommandButton('Reverie', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);
  buildCommandButton('Reverie', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
  buildCommandButton('Reverie', mqtt, controller, 'PresetFlat', Commands.PresetFlat);

  buildCommandButton('Reverie', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCommandButton('Reverie', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCommandButton('Reverie', mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);
  buildCommandButton('Reverie', mqtt, controller, 'PresetMemory4', Commands.PresetMemory4);

  buildCommandButton('Reverie', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCommandButton('Reverie', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCommandButton('Reverie', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCommandButton('Reverie', mqtt, controller, 'ProgramMemory4', Commands.ProgramMemory4, 'config');
};
