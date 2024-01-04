import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton(mqtt, controller, 'PresetFlat', Commands.PresetFlat);

  buildCachedButton(mqtt, controller, 'PresetUnwind', Commands.PresetUnwind);
  buildCachedButton(mqtt, controller, 'PresetSleep', Commands.PresetSleep);
  buildCachedButton(mqtt, controller, 'PresetWakeUp', Commands.PresetWakeUp);
  buildCachedButton(mqtt, controller, 'PresetRelax', Commands.PresetRelax);
  buildCachedButton(mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);

  buildCachedButton(mqtt, controller, 'ProgramUnwind', Commands.ProgramUnwind, 'config');
  buildCachedButton(mqtt, controller, 'ProgramSleep', Commands.ProgramSleep, 'config');
  buildCachedButton(mqtt, controller, 'ProgramWakeUp', Commands.ProgramWakeUp, 'config');
  buildCachedButton(mqtt, controller, 'ProgramRelax', Commands.ProgramRelax, 'config');
  buildCachedButton(mqtt, controller, 'ProgramAntiSnore', Commands.ProgramAntiSnore, 'config');

  buildCachedButton(mqtt, controller, 'Stop', Commands.Stop);
};
