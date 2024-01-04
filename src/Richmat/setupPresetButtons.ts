import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './types/Commands';
import { Controller } from './types/Controller';
import { Features } from './types/Features';

interface PresetButtonEntities {
  presetFlat?: Button;
  presetZeroG?: Button;
  programZeroG?: Button;
  presetMemory?: Button;
  programMemory?: Button;
  presetAntiSnore?: Button;
  programAntiSnore?: Button;
}

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  const { entities, deviceData, hasFeature, writeData } = controller;
  const cache = entities as PresetButtonEntities;
  if (hasFeature(Features.PresetFlat)) {
    let { presetFlat } = cache;
    if (!presetFlat) {
      presetFlat = cache.presetFlat = new Button(mqtt, deviceData, buildEntityConfig('PresetFlat'), () =>
        writeData(Commands.PresetFlat)
      );
    }
    presetFlat.setOnline();
  }

  if (hasFeature(Features.PresetZeroG)) {
    let { presetZeroG } = cache;
    if (!presetZeroG) {
      presetZeroG = cache.presetZeroG = new Button(mqtt, deviceData, buildEntityConfig('PresetZeroG'), () =>
        writeData(Commands.PresetZeroG)
      );
    }
    presetZeroG.setOnline();
  }

  if (hasFeature(Features.ProgramZeroG)) {
    let { programZeroG } = cache;
    if (!programZeroG) {
      programZeroG = cache.programZeroG = new Button(
        mqtt,
        deviceData,
        buildEntityConfig('ProgramZeroG', 'config'),
        () => writeData(Commands.ProgramZeroG)
      );
    }
    programZeroG.setOnline();
  }

  if (hasFeature(Features.PresetMemory)) {
    let { presetMemory } = cache;
    if (!presetMemory) {
      presetMemory = cache.presetMemory = new Button(mqtt, deviceData, buildEntityConfig('PresetMemory'), () =>
        writeData(Commands.PresetMemory)
      );
    }
    presetMemory.setOnline();
  }

  if (hasFeature(Features.ProgramMemory)) {
    let { programMemory } = cache;
    if (!programMemory) {
      programMemory = cache.programMemory = new Button(
        mqtt,
        deviceData,
        buildEntityConfig('ProgramMemory', 'config'),
        () => writeData(Commands.ProgramMemory)
      );
    }
    programMemory.setOnline();
  }

  if (hasFeature(Features.PresetAntiSnore)) {
    let { presetAntiSnore } = cache;
    if (!presetAntiSnore) {
      presetAntiSnore = cache.presetAntiSnore = new Button(mqtt, deviceData, buildEntityConfig('PresetAntiSnore'), () =>
        writeData(Commands.PresetAntiSnore)
      );
    }
    presetAntiSnore.setOnline();
  }

  if (hasFeature(Features.ProgramAntiSnore)) {
    let { programAntiSnore } = cache;
    if (!programAntiSnore) {
      programAntiSnore = cache.programAntiSnore = new Button(
        mqtt,
        deviceData,
        buildEntityConfig('ProgramAntiSnore', 'config'),
        () => writeData(Commands.ProgramAntiSnore)
      );
    }
    programAntiSnore.setOnline();
  }
};
