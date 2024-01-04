import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey } from '@utils/getString';
import { Controller } from 'Common/Controller';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';

interface PresetButtonEntities {
  presetMemory1?: Button;
  programMemory1?: Button;
  resetMemory1?: Button;

  presetMemory2?: Button;
  programMemory2?: Button;
  resetMemory2?: Button;

  presetMemory3?: Button;
  programMemory3?: Button;
  resetMemory3?: Button;

  presetMemory4?: Button;
  programMemory4?: Button;
  resetMemory4?: Button;

  presetMemory5?: Button;
  programMemory5?: Button;
  resetMemory5?: Button;

  presetTV?: Button;
  presetZeroG?: Button;
  presetAntiSnore?: Button;
  presetRise?: Button;
  presetTiltForward?: Button;
  presetFlatBed?: Button;
  presetDecline?: Button;
  presetTiltBackward?: Button;
  presetAllFlat?: Button;
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

  buildCachedButton('presetMemory1', 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('programMemory1', 'ProgramMemory1', Commands.ProgramMemory1, 'config');
  buildCachedButton('resetMemory1', 'ResetMemory1', Commands.ResetMemory1, 'config');

  buildCachedButton('presetMemory2', 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('programMemory2', 'ProgramMemory2', Commands.ProgramMemory2, 'config');
  buildCachedButton('resetMemory2', 'ResetMemory2', Commands.ResetMemory2, 'config');

  buildCachedButton('presetMemory3', 'PresetMemory3', Commands.PresetMemory3);
  buildCachedButton('programMemory3', 'ProgramMemory3', Commands.ProgramMemory3, 'config');
  buildCachedButton('resetMemory3', 'ResetMemory3', Commands.ResetMemory3, 'config');

  buildCachedButton('presetMemory4', 'PresetMemory4', Commands.PresetMemory4);
  buildCachedButton('programMemory4', 'ProgramMemory4', Commands.ProgramMemory4, 'config');
  buildCachedButton('resetMemory4', 'ResetMemory4', Commands.ResetMemory4, 'config');

  buildCachedButton('presetMemory5', 'PresetMemory5', Commands.PresetMemory5);
  buildCachedButton('programMemory5', 'ProgramMemory5', Commands.ProgramMemory5, 'config');
  buildCachedButton('resetMemory5', 'ResetMemory5', Commands.ResetMemory5, 'config');

  buildCachedButton('presetTV', 'PresetTV', Commands.PresetTV);
  buildCachedButton('presetZeroG', 'PresetZeroG', Commands.PresetZeroG);
  buildCachedButton('presetAntiSnore', 'PresetAntiSnore', Commands.PresetAntiSnore);
  buildCachedButton('presetRise', 'PresetRise', Commands.PresetRise);
  buildCachedButton('presetTiltForward', 'PresetTiltForward', Commands.PresetTiltForward);
  buildCachedButton('presetFlatBed', 'PresetFlatBed', Commands.PresetFlatBed);
  buildCachedButton('presetDecline', 'PresetDecline', Commands.PresetDecline);
  buildCachedButton('presetTiltBackward', 'PresetTiltBackward', Commands.PresetTiltBackward);
  buildCachedButton('presetAllFlat', 'PresetAllFlat', Commands.PresetAllFlat);
};
