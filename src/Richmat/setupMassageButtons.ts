import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey } from '@utils/getString';
import { IController } from 'Common/IController';
import { buildCommandsButton } from 'Common/buildCommandsButton';
import { Commands } from './Commands';
import { Features, HasFeature } from './Features';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: IController<number>, hasFeature: HasFeature) => {
  const buildButton = (name: StringsKey, command: Commands, category?: string) => {
    buildCommandsButton('Richmat', mqtt, controller, name, [command, Commands.End], category);
  };

  if (hasFeature(Features.MassageHeadStep)) buildButton('MassageHeadStep', Commands.MassageHeadStep);
  if (hasFeature(Features.MassageFootStep)) buildButton('MassageFootStep', Commands.MassageFootStep);
  if (hasFeature(Features.MassageToggle)) buildButton('MassageToggle', Commands.MassageToggle);
  if (hasFeature(Features.MassageMode)) buildButton('MassageMode', Commands.MassagePatternStep);
};
