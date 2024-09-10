import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey } from '@utils/getString';
import { IController } from 'Common/IController';
import { buildCommandsButton } from 'Common/buildCommandsButton';
import { Commands } from './Commands';
import { Features, HasFeature } from './Features';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number>, hasFeature: HasFeature) => {
  const buildButton = (name: StringsKey, command: Commands, category?: string) => {
    buildCommandsButton('Richmat', mqtt, controller, name, [command, Commands.End], category);
  };

  const hasMemory2 = hasFeature(Features.PresetMemory2);

  if (hasFeature(Features.PresetFlat)) buildButton('PresetFlat', Commands.PresetFlat);

  if (hasFeature(Features.PresetAntiSnore)) buildButton('PresetAntiSnore', Commands.PresetAntiSnore);
  if (hasFeature(Features.PresetLounge)) buildButton('PresetLounge', Commands.PresetLounge);
  if (hasFeature(Features.PresetMemory1))
    buildButton(hasMemory2 ? 'PresetMemory1' : 'PresetMemory', Commands.PresetMemory1);
  if (hasFeature(Features.PresetMemory2)) buildButton('PresetMemory2', Commands.PresetMemory2);
  if (hasFeature(Features.PresetTV)) buildButton('PresetTV', Commands.PresetTV);
  if (hasFeature(Features.PresetZeroG)) buildButton('PresetZeroG', Commands.PresetZeroG);

  if (hasFeature(Features.ProgramAntiSnore)) buildButton('ProgramAntiSnore', Commands.ProgramAntiSnore, 'config');
  if (hasFeature(Features.ProgramLounge)) buildButton('ProgramLounge', Commands.ProgramLounge, 'config');
  if (hasFeature(Features.ProgramMemory1))
    buildButton(hasMemory2 ? 'ProgramMemory1' : 'ProgramMemory', Commands.ProgramMemory1, 'config');
  if (hasFeature(Features.ProgramMemory2)) buildButton('ProgramMemory2', Commands.ProgramMemory2, 'config');
  if (hasFeature(Features.ProgramTV)) buildButton('ProgramTV', Commands.ProgramTV, 'config');
  if (hasFeature(Features.ProgramZeroG)) buildButton('ProgramZeroG', Commands.ProgramZeroG, 'config');
};
