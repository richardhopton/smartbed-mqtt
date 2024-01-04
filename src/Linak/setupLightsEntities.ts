import { Button } from '@ha/Button';
import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { Controller } from './Controller';

interface UnderBedLightEntities {
  underBedLights?: Switch;
  underBedLightsToggle?: Button;
}

export const setupLightEntities = (mqtt: IMQTTConnection, controller: Controller) => {
  const { entities, deviceData, writeData } = controller;
  const cache = entities as UnderBedLightEntities;

  let { underBedLights } = cache;
  if (!underBedLights) {
    underBedLights = cache.underBedLights = new Switch(mqtt, deviceData, buildEntityConfig('UnderBedLights'), (state) =>
      writeData(state ? Commands.UnderBedLightsOn : Commands.UnderBedLightsOff)
    );
  }
  underBedLights.setOnline();

  let { underBedLightsToggle } = cache;
  if (!underBedLightsToggle) {
    underBedLightsToggle = cache.underBedLightsToggle = new Button(
      mqtt,
      deviceData,
      buildEntityConfig('UnderBedLightsToggle'),
      () => writeData(Commands.UnderBedLightsToggle)
    );
  }
  underBedLightsToggle.setOnline();
};
