import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Controller } from '../Controller';
import { Commands } from './Commands';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetFlat', Commands.PresetFlat);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);

  //   buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  //   buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  //   buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
};
