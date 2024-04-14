import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCommandsButton } from 'Common/buildCommandsButton';
import { Features } from 'Richmat/types/Features';
import { Commands } from './types/Commands';
import { Controller } from './types/Controller';

export const setupUnderBedLightButton = (mqtt: IMQTTConnection, { hasFeature, ...controller }: Controller) => {
  if (hasFeature(Features.UnderBedLightsToggle))
    buildCommandsButton('Richmat', mqtt, controller, 'UnderBedLightsToggle', [
      Commands.UnderBedLightsToggle,
      Commands.End,
    ]);
};
