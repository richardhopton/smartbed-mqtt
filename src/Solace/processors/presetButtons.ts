import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey, getString } from '@utils/getString';
import { Commands } from '../types/Commands';
import { Controller } from '../types/Controller';

interface PresetButtonEntities {
  presetMemory1?: Button;
  programMemory1?: Button;
  resetMemory1?: Button;

  presetMemory2?: Button;
  programMemory2?: Button;
  resetMemory2?: Button;

  presetTV?: Button;
  programTV?: Button;
  resetTV?: Button;

  presetZeroG?: Button;
  programZeroG?: Button;
  resetZeroG?: Button;

  presetAntiSnore?: Button;
  programAntiSnore?: Button;
  resetAntiSnore?: Button;

  presetRise?: Button;
  presetTiltForward?: Button;
  presetFlatBed?: Button;
  presetDecline?: Button;
  presetTiltBackward?: Button;
  presetAllFlat?: Button;
}

export const setupPresetButtons = async (mqtt: IMQTTConnection, controller: Controller) => {
  const { entities, deviceData, writeData } = controller;
  const cache = entities as PresetButtonEntities;

  const buildCachedButton = (key: keyof PresetButtonEntities, name: StringsKey, command: Uint8Array) => {
    let button = cache[key];
    if (!button) {
      button = cache[key] = new Button(mqtt, deviceData, getString(name), () => {
        writeData(command);
      });
    }
    button.setOnline();
  };

  buildCachedButton('presetMemory1', 'PresetMemory1', Commands.PresetMemory1);
  buildCachedButton('programMemory1', 'ProgramMemory1', Commands.ProgramMemory1);
  buildCachedButton('resetMemory1', 'ResetMemory1', Commands.ResetMemory1);

  buildCachedButton('presetMemory2', 'PresetMemory2', Commands.PresetMemory2);
  buildCachedButton('programMemory2', 'ProgramMemory2', Commands.ProgramMemory2);
  buildCachedButton('resetMemory2', 'ResetMemory2', Commands.ResetMemory2);

  buildCachedButton('presetTV', 'PresetTV', Commands.PresetTV);
  buildCachedButton('programTV', 'ProgramTV', Commands.ProgramTV);
  buildCachedButton('resetTV', 'ResetTV', Commands.ResetTV);

  buildCachedButton('presetZeroG', 'PresetZeroG', Commands.PresetZeroG);
  buildCachedButton('programZeroG', 'ProgramZeroG', Commands.ProgramZeroG);
  buildCachedButton('resetZeroG', 'ResetZeroG', Commands.ResetZeroG);

  buildCachedButton('presetAntiSnore', 'PresetAntiSnore', Commands.PresetAntiSnore);
  buildCachedButton('programAntiSnore', 'ProgramAntiSnore', Commands.ProgramAntiSnore);
  buildCachedButton('resetAntiSnore', 'ResetAntiSnore', Commands.ResetAntiSnore);

  buildCachedButton('presetRise', 'PresetRise', Commands.PresetRise);
  buildCachedButton('presetTiltForward', 'PresetTiltForward', Commands.PresetTiltForward);
  buildCachedButton('presetFlatBed', 'PresetFlatBed', Commands.PresetFlatBed);
  buildCachedButton('presetDecline', 'PresetDecline', Commands.PresetDecline);
  buildCachedButton('presetTiltBackward', 'PresetTiltBackward', Commands.PresetTiltBackward);
  buildCachedButton('presetAllFlat', 'PresetAllFlat', Commands.PresetAllFlat);
};
