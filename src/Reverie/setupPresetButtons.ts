import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('Richmat', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);
  buildCachedButton('Richmat', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
  buildCachedButton('Richmat', mqtt, controller, 'PresetFlat', Commands.PresetFlat);

  buildCachedButton('Richmat', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('Richmat', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('Richmat', mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);
  buildCachedButton('Richmat', mqtt, controller, 'PresetMemory4', Commands.PresetMemory4);

  buildCachedButton('Richmat', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCachedButton('Richmat', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCachedButton('Richmat', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCachedButton('Richmat', mqtt, controller, 'ProgramMemory4', Commands.ProgramMemory4, 'config');
};
