import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Commands } from './Commands';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCommandButton('Logicdata', mqtt, controller, 'PresetFlat', Commands.Flat);
  buildCommandButton('Logicdata', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCommandButton('Logicdata', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCommandButton('Logicdata', mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);
  buildCommandButton('Logicdata', mqtt, controller, 'PresetMemory4', Commands.PresetMemory4);

  buildCommandButton('Logicdata', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCommandButton('Logicdata', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCommandButton('Logicdata', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCommandButton('Logicdata', mqtt, controller, 'ProgramMemory4', Commands.ProgramMemory4, 'config');
};
