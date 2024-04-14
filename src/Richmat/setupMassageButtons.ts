import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandsButton } from 'Common/buildCommandsButton';
import { Commands } from './Commands';
import { Features, HasFeature } from './Features';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: IController<number>, hasFeature: HasFeature) => {
  if (hasFeature(Features.MassageHeadStep))
    buildCommandsButton('Richmat', mqtt, controller, 'MassageHeadStep', [Commands.MassageHeadStep, Commands.End]);
  if (hasFeature(Features.MassageFootStep))
    buildCommandsButton('Richmat', mqtt, controller, 'MassageFootStep', [Commands.MassageFootStep, Commands.End]);
  if (hasFeature(Features.MassageToggle))
    buildCommandsButton('Richmat', mqtt, controller, 'MassageToggle', [Commands.MassageToggle, Commands.End]);
  if (hasFeature(Features.MassageMode))
    buildCommandsButton('Richmat', mqtt, controller, 'MassageMode', [Commands.MassagePatternStep, Commands.End]);
};
