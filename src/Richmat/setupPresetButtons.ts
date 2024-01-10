import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildFeatureCachedButton } from './buildFeatureCachedButton';
import { Commands } from './types/Commands';
import { Controller } from './types/Controller';
import { Features } from './types/Features';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildFeatureCachedButton(Features.PresetFlat, mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildFeatureCachedButton(Features.PresetZeroG, mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);
  buildFeatureCachedButton(Features.PresetMemory, mqtt, controller, 'PresetMemory', Commands.PresetMemory);
  buildFeatureCachedButton(Features.PresetAntiSnore, mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);

  buildFeatureCachedButton(Features.ProgramZeroG, mqtt, controller, 'ProgramZeroG', Commands.ProgramZeroG, 'config');
  buildFeatureCachedButton(Features.ProgramMemory, mqtt, controller, 'ProgramMemory', Commands.ProgramMemory, 'config');
  buildFeatureCachedButton(
    Features.ProgramAntiSnore,
    mqtt,
    controller,
    'ProgramAntiSnore',
    Commands.ProgramAntiSnore,
    'config'
  );
};
