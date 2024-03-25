import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetFlat', Commands.PresetFlat);

  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetMemory1', Commands.PresetZeroG);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetMemory2', Commands.PresetMemory1);
  buildCachedButton('LeggettPlatt', mqtt, controller, 'PresetMemory3', Commands.PresetMemory2);

  //   buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  //   buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  //   buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
};
