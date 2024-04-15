import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Remote } from './Remote';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number>, remote: Remote) => {
  const flatCommand = remote.commands.Flat;
  if (flatCommand) {
    if (typeof flatCommand === 'number') {
      buildCommandButton('FurniMove', mqtt, controller, 'PresetFlat', flatCommand);
    }
  }
};
