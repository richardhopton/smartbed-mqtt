import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';

interface UnderBedLightEntities {
  underBedLights?: Switch;
}

export const setupLightEntities = (mqtt: IMQTTConnection, controller: IController<number[]>) => {
  const { entities, deviceData, writeCommand } = controller;
  const cache = entities as UnderBedLightEntities;

  let { underBedLights } = cache;
  if (!underBedLights) {
    underBedLights = cache.underBedLights = new Switch(mqtt, deviceData, buildEntityConfig('UnderBedLights'), (state) =>
      writeCommand(state ? Commands.UnderBedLightsOn : Commands.UnderBedLightsOff)
    );
  }
  underBedLights.setOnline();

  buildCommandButton('Linak', mqtt, controller, 'UnderBedLightsToggle', Commands.UnderBedLightsToggle);
};
