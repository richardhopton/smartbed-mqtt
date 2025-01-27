import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { buildCommandButton } from 'Common/buildCommandButton';
import { RemoteStyle } from './options';
import { IController } from 'Common/IController';

export const setupPresetButtons = (
  mqtt: IMQTTConnection,
  controller: IController<number>,
  remoteStyle: RemoteStyle
) => {
  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);

  if (remoteStyle === 'L') return;

  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetUserFavorite', Commands.PresetMemory1);
  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetTV', Commands.PresetMemory2);
  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetAntiSnore', Commands.PresetMemory3);
};
