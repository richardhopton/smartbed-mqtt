import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton(mqtt, controller, 'PresetFlat', Commands.Flat);
  buildCachedButton(mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton(mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton(mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);
  buildCachedButton(mqtt, controller, 'PresetMemory4', Commands.PresetMemory4);

  buildCachedButton(mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCachedButton(mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCachedButton(mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCachedButton(mqtt, controller, 'ProgramMemory4', Commands.ProgramMemory4, 'config');
};
