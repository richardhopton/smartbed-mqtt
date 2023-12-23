import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Controller } from 'Richmat/types/Controller';
import { Features } from 'Richmat/types/Features';
import { Commands } from '../types/Commands';

interface MassageButtonEntities {
  massageHeadStep?: Button;
  massageFootStep?: Button;
  massageToggle?: Button;
  massageMode?: Button;
}

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  const { entities, deviceData, hasFeature, writeData } = controller;
  const cache = entities as MassageButtonEntities;
  if (hasFeature(Features.MassageHeadStep)) {
    if (!cache.massageHeadStep) {
      cache.massageHeadStep = new Button(mqtt, deviceData, buildEntityConfig('MassageHeadStep'), () =>
        writeData(Commands.MassageHeadStep)
      );
    }
    cache.massageHeadStep.setOnline();
  }

  if (hasFeature(Features.MassageFootStep)) {
    if (!cache.massageFootStep) {
      cache.massageFootStep = new Button(mqtt, deviceData, buildEntityConfig('MassageFootStep'), () =>
        writeData(Commands.MassageFootStep)
      );
    }
    cache.massageFootStep.setOnline();
  }

  if (hasFeature(Features.MassageToggle)) {
    if (!cache.massageToggle) {
      cache.massageToggle = new Button(mqtt, deviceData, buildEntityConfig('MassageToggle'), () =>
        writeData(Commands.MassageToggle)
      );
    }
    cache.massageToggle.setOnline();
  }

  if (hasFeature(Features.MassageMode)) {
    if (!cache.massageMode) {
      cache.massageMode = new Button(mqtt, deviceData, buildEntityConfig('MassageMode'), () =>
        writeData(Commands.MassagePatternStep)
      );
    }
    cache.massageMode.setOnline();
  }
};
