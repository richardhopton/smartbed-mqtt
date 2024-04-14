import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCommandsButton } from 'Common/buildCommandsButton';
import { Features } from 'Richmat/types/Features';
import { Commands } from './types/Commands';
import { Controller } from './types/Controller';

export const setupMassageButtons = (mqtt: IMQTTConnection, { hasFeature, ...controller }: Controller) => {
  if (hasFeature(Features.MassageHeadStep))
    buildCommandsButton('Richmat', mqtt, controller, 'MassageHeadStep', [Commands.MassageHeadStep, Commands.End]);
  if (hasFeature(Features.MassageFootStep))
    buildCommandsButton('Richmat', mqtt, controller, 'MassageFootStep', [Commands.MassageFootStep, Commands.End]);
  if (hasFeature(Features.MassageToggle))
    buildCommandsButton('Richmat', mqtt, controller, 'MassageToggle', [Commands.MassageToggle, Commands.End]);
  if (hasFeature(Features.MassageMode))
    buildCommandsButton('Richmat', mqtt, controller, 'MassageMode', [Commands.MassagePatternStep, Commands.End]);
};
