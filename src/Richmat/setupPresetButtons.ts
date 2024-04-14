import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCommandsButton } from 'Common/buildCommandsButton';
import { Commands } from './types/Commands';
import { Controller } from './types/Controller';
import { Features } from './types/Features';

export const setupPresetButtons = (mqtt: IMQTTConnection, { hasFeature, ...controller }: Controller) => {
  if (hasFeature(Features.PresetFlat))
    buildCommandsButton('Richmat', mqtt, controller, 'PresetFlat', [Commands.PresetFlat, Commands.End]);
  if (hasFeature(Features.PresetZeroG))
    buildCommandsButton('Richmat', mqtt, controller, 'PresetZeroG', [Commands.PresetZeroG, Commands.End]);
  if (hasFeature(Features.PresetMemory))
    buildCommandsButton('Richmat', mqtt, controller, 'PresetMemory', [Commands.PresetMemory, Commands.End]);
  if (hasFeature(Features.PresetAntiSnore))
    buildCommandsButton('Richmat', mqtt, controller, 'PresetAntiSnore', [Commands.PresetAntiSnore, Commands.End]);

  if (hasFeature(Features.ProgramZeroG))
    buildCommandsButton('Richmat', mqtt, controller, 'ProgramZeroG', [Commands.ProgramZeroG, Commands.End], 'config');
  if (hasFeature(Features.ProgramMemory))
    buildCommandsButton('Richmat', mqtt, controller, 'ProgramMemory', [Commands.ProgramMemory, Commands.End], 'config');
  if (hasFeature(Features.ProgramAntiSnore))
    buildCommandsButton(
      'Richmat',
      mqtt,
      controller,
      'ProgramAntiSnore',
      [Commands.ProgramAntiSnore, Commands.End],
      'config'
    );
};
