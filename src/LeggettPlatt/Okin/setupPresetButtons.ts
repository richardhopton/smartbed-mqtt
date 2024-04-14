import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetFlat', Commands.PresetFlat);

  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetMemory1', Commands.PresetZeroG);
  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetMemory2', Commands.PresetMemory1);
  buildCommandButton('LeggettPlatt', mqtt, controller, 'PresetMemory3', Commands.PresetMemory2);

  //   buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  //   buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  //   buildCachedButton('LeggettPlatt', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
};
