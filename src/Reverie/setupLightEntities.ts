import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { Controller } from './Controller';

interface UnderBedLightEntities {
  underBedLightsToggle?: Button;
  //underBedLightsLevel?: Number;
}

export const setupLightEntities = (mqtt: IMQTTConnection, controller: Controller) => {
  const { entities, deviceData, writeData } = controller;
  const cache = entities as UnderBedLightEntities;

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
