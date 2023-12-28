import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey, getString } from '@utils/getString';
import { logError } from '@utils/logger';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './types/Commands';
import { Controller } from './types/Controller';

interface PresetButtonEntities {
  presetMemory1?: Button;
  programMemory1?: Button;

  presetMemory2?: Button;
  programMemory2?: Button;

  presetMemory3?: Button;
  programMemory3?: Button;

  presetMemory4?: Button;
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
      button = cache[key] = new Button(mqtt, deviceData, buildEntityConfig(name, category), async () => {
        try {
          await writeData(command);
        } catch (e) {
          logError(`[Linak] Failed to write '${getString(name)}'`, e);
        }
      });
    }
    button.setOnline();
  };

  buildCachedButton('presetMemory1', 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('presetMemory2', 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('presetMemory3', 'PresetMemory3', Commands.PresetMemory3);
  buildCachedButton('presetMemory4', 'PresetMemory4', Commands.PresetMemory4);

  buildCachedButton('programMemory1', 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCachedButton('programMemory2', 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCachedButton('programMemory3', 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCachedButton('programMemory4', 'ProgramMemory4', Commands.ProgramMemory4, 'config');
};
