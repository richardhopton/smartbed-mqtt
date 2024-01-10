import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { Controller } from './Controller';

interface UnderBedLightEntities {
  underBedLights?: Switch;
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

  buildCachedButton(mqtt, controller, 'UnderBedLightsToggle', Commands.UnderBedLightsToggle);
};
