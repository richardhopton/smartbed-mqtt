import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number>) => {
  buildCommandButton('Keeson', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCommandButton('Keeson', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);
  buildCommandButton('Keeson', mqtt, controller, 'PresetMemory1', Commands.PresetMemory1);
  buildCommandButton('Keeson', mqtt, controller, 'PresetMemory2', Commands.PresetMemory2);
  buildCommandButton('Keeson', mqtt, controller, 'PresetAntiSnore', Commands.PresetMemory3);
};
