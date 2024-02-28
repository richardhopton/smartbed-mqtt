import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('Logicdata', mqtt, controller, 'PresetFlat', Commands.Flat);
  buildCachedButton('Logicdata', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('Logicdata', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('Logicdata', mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);
  buildCachedButton('Logicdata', mqtt, controller, 'PresetMemory4', Commands.PresetMemory4);

  buildCachedButton('Logicdata', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCachedButton('Logicdata', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCachedButton('Logicdata', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCachedButton('Logicdata', mqtt, controller, 'ProgramMemory4', Commands.ProgramMemory4, 'config');
};
