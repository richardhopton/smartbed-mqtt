import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('Reverie', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);
  buildCachedButton('Reverie', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
  buildCachedButton('Reverie', mqtt, controller, 'PresetFlat', Commands.PresetFlat);

  buildCachedButton('Reverie', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('Reverie', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('Reverie', mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);
  buildCachedButton('Reverie', mqtt, controller, 'PresetMemory4', Commands.PresetMemory4);

  buildCachedButton('Reverie', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCachedButton('Reverie', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCachedButton('Reverie', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCachedButton('Reverie', mqtt, controller, 'ProgramMemory4', Commands.ProgramMemory4, 'config');
};
