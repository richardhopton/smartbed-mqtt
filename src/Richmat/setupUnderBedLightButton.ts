import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandsButton } from 'Common/buildCommandsButton';
import { Commands } from './Commands';
import { Features, HasFeature } from './Features';

export const setupUnderBedLightButton = (
  mqtt: IMQTTConnection,
  controller: IController<number>,
  hasFeature: HasFeature
) => {
  if (hasFeature(Features.UnderBedLightsToggle))
    buildCommandsButton('Richmat', mqtt, controller, 'UnderBedLightsToggle', [
      Commands.UnderBedLightsToggle,
      Commands.End,
    ]);
};
