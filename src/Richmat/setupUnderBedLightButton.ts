import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Features } from 'Richmat/types/Features';
import { buildFeatureCachedButton } from './buildFeatureCachedButton';
import { Commands } from './types/Commands';
import { Controller } from './types/Controller';

export const setupUnderBedLightButton = (mqtt: IMQTTConnection, controller: Controller) => {
  buildFeatureCachedButton(
    Features.UnderBedLightsToggle,
    mqtt,
    controller,
    'UnderBedLightsToggle',
    Commands.UnderBedLightsToggle
  );
};
