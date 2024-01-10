import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  buildCachedButton(mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton(mqtt, controller, 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCachedButton(mqtt, controller, 'ResetMemory1', Commands.ResetMemory1, 'config');

  buildCachedButton(mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton(mqtt, controller, 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCachedButton(mqtt, controller, 'ResetMemory2', Commands.ResetMemory2, 'config');

  buildCachedButton(mqtt, controller, 'PresetMemory3', Commands.PresetMemory3);
  buildCachedButton(mqtt, controller, 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCachedButton(mqtt, controller, 'ResetMemory3', Commands.ResetMemory3, 'config');

  buildCachedButton(mqtt, controller, 'PresetMemory4', Commands.PresetMemory4);
  buildCachedButton(mqtt, controller, 'ProgramMemory4', Commands.ProgramMemory4, 'config');
  buildCachedButton(mqtt, controller, 'ResetMemory4', Commands.ResetMemory4, 'config');

  buildCachedButton(mqtt, controller, 'PresetMemory5', Commands.PresetMemory5);
  buildCachedButton(mqtt, controller, 'ProgramMemory5', Commands.ProgramMemory5, 'config');
  buildCachedButton(mqtt, controller, 'ResetMemory5', Commands.ResetMemory5, 'config');

  buildCachedButton(mqtt, controller, 'PresetTV', Commands.PresetTV);
  buildCachedButton(mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);
  buildCachedButton(mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
  buildCachedButton(mqtt, controller, 'PresetRise', Commands.PresetRise);
  buildCachedButton(mqtt, controller, 'PresetTiltForward', Commands.PresetTiltForward);
  buildCachedButton(mqtt, controller, 'PresetFlatBed', Commands.PresetFlatBed);
  buildCachedButton(mqtt, controller, 'PresetDecline', Commands.PresetDecline);
  buildCachedButton(mqtt, controller, 'PresetTiltBackward', Commands.PresetTiltBackward);
  buildCachedButton(mqtt, controller, 'PresetAllFlat', Commands.PresetAllFlat);
};
