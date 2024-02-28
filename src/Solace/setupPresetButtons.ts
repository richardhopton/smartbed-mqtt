import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCachedButton('Solace', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('Solace', mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCachedButton('Solace', mqtt, controller, 'ResetMemory1', Commands.ResetMemory1, 'config');

  buildCachedButton('Solace', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('Solace', mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCachedButton('Solace', mqtt, controller, 'ResetMemory2', Commands.ResetMemory2, 'config');

  buildCachedButton('Solace', mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);
  buildCachedButton('Solace', mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCachedButton('Solace', mqtt, controller, 'ResetMemory3', Commands.ResetMemory3, 'config');

  buildCachedButton('Solace', mqtt, controller, 'PresetMemory4', Commands.PresetMemory4);
  buildCachedButton('Solace', mqtt, controller, 'ProgramMemory4', Commands.ProgramMemory4, 'config');
  buildCachedButton('Solace', mqtt, controller, 'ResetMemory4', Commands.ResetMemory4, 'config');

  buildCachedButton('Solace', mqtt, controller, 'PresetMemory5', Commands.PresetMemory5);
  buildCachedButton('Solace', mqtt, controller, 'ProgramMemory5', Commands.ProgramMemory5, 'config');
  buildCachedButton('Solace', mqtt, controller, 'ResetMemory5', Commands.ResetMemory5, 'config');

  buildCachedButton('Solace', mqtt, controller, 'PresetTV', Commands.PresetTV);
  buildCachedButton('Solace', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);
  buildCachedButton('Solace', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
  buildCachedButton('Solace', mqtt, controller, 'PresetRise', Commands.PresetRise);
  buildCachedButton('Solace', mqtt, controller, 'PresetTiltForward', Commands.PresetTiltForward);
  buildCachedButton('Solace', mqtt, controller, 'PresetFlatBed', Commands.PresetFlatBed);
  buildCachedButton('Solace', mqtt, controller, 'PresetDecline', Commands.PresetDecline);
  buildCachedButton('Solace', mqtt, controller, 'PresetTiltBackward', Commands.PresetTiltBackward);
  buildCachedButton('Solace', mqtt, controller, 'PresetAllFlat', Commands.PresetAllFlat);
};
