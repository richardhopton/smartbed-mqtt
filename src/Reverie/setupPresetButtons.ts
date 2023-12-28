import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey } from '@utils/getString';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { Controller } from './Controller';

interface PresetButtonEntities {
  presetZeroG?: Button;
  presetAntiSnore?: Button;
  presetFlat?: Button;

  presetMemory1?: Button;
  presetMemory2?: Button;
  presetMemory3?: Button;
  presetMemory4?: Button;

  programMemory1?: Button;
  programMemory2?: Button;
  programMemory3?: Button;
  programMemory4?: Button;
}

export const setupPresetButtons = (mqtt: IMQTTConnection, { entities, deviceData, writeData }: Controller) => {
  const cache = entities as PresetButtonEntities;

  const buildCachedButton = (
    key: keyof PresetButtonEntities,
    name: StringsKey,
    command: number[],
    category?: string
  ) => {
    let button = cache[key];
    if (!button) {
      button = cache[key] = new Button(mqtt, deviceData, buildEntityConfig(name, category), () => writeData(command));
    }
    button.setOnline();
  };

  buildCachedButton('presetZeroG', 'PresetZeroG', Commands.PresetZeroG);
  buildCachedButton('presetAntiSnore', 'PresetAntiSnore', Commands.PresetAntiSnore);
  buildCachedButton('presetFlat', 'PresetFlat', Commands.PresetFlat);

  buildCachedButton('presetMemory1', 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('presetMemory2', 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('presetMemory3', 'PresetMemory3', Commands.PresetMemory3);
  buildCachedButton('presetMemory4', 'PresetMemory4', Commands.PresetMemory4);

  buildCachedButton('programMemory1', 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCachedButton('programMemory2', 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCachedButton('programMemory3', 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCachedButton('programMemory4', 'ProgramMemory4', Commands.ProgramMemory4, 'config');
};
