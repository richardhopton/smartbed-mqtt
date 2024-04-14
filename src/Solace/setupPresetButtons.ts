import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Commands } from './Commands';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCommandButton('Solace', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCommandButton('Solace', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCommandButton('Solace', mqtt, controller, 'ResetMemory1', Commands.ResetMemory1, 'config');

  buildCommandButton('Solace', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCommandButton('Solace', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCommandButton('Solace', mqtt, controller, 'ResetMemory2', Commands.ResetMemory2, 'config');

  buildCommandButton('Solace', mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);
  buildCommandButton('Solace', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCommandButton('Solace', mqtt, controller, 'ResetMemory3', Commands.ResetMemory3, 'config');

  buildCommandButton('Solace', mqtt, controller, 'PresetMemory4', Commands.PresetMemory4);
  buildCommandButton('Solace', mqtt, controller, 'ProgramMemory4', Commands.ProgramMemory4, 'config');
  buildCommandButton('Solace', mqtt, controller, 'ResetMemory4', Commands.ResetMemory4, 'config');

  buildCommandButton('Solace', mqtt, controller, 'PresetMemory5', Commands.PresetMemory5);
  buildCommandButton('Solace', mqtt, controller, 'ProgramMemory5', Commands.ProgramMemory5, 'config');
  buildCommandButton('Solace', mqtt, controller, 'ResetMemory5', Commands.ResetMemory5, 'config');

  buildCommandButton('Solace', mqtt, controller, 'PresetTV', Commands.PresetTV);
  buildCommandButton('Solace', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);
  buildCommandButton('Solace', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
  buildCommandButton('Solace', mqtt, controller, 'PresetRise', Commands.PresetRise);
  buildCommandButton('Solace', mqtt, controller, 'PresetTiltForward', Commands.PresetTiltForward);
  buildCommandButton('Solace', mqtt, controller, 'PresetFlatBed', Commands.PresetFlatBed);
  buildCommandButton('Solace', mqtt, controller, 'PresetDecline', Commands.PresetDecline);
  buildCommandButton('Solace', mqtt, controller, 'PresetTiltBackward', Commands.PresetTiltBackward);
  buildCommandButton('Solace', mqtt, controller, 'PresetAllFlat', Commands.PresetAllFlat);
};
