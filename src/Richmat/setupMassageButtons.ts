import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Controller } from 'Richmat/types/Controller';
import { Features } from 'Richmat/types/Features';
import { buildFeatureCachedButton } from './buildFeatureCachedButton';
import { Commands } from './types/Commands';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildFeatureCachedButton(Features.MassageHeadStep, mqtt, controller, 'MassageHeadStep', Commands.MassageHeadStep);
  buildFeatureCachedButton(Features.MassageFootStep, mqtt, controller, 'MassageFootStep', Commands.MassageFootStep);
  buildFeatureCachedButton(Features.MassageToggle, mqtt, controller, 'MassageToggle', Commands.MassageToggle);
  buildFeatureCachedButton(Features.MassageMode, mqtt, controller, 'MassageMode', Commands.MassagePatternStep);
};
