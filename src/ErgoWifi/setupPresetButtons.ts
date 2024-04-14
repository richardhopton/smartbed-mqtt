import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { RemoteStyle } from './options';

export const setupPresetButtons = (
  mqtt: IMQTTConnection,
  controller: IController<number>,
  remoteStyle: RemoteStyle
) => {
  buildCommandButton('ErgoWifi', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCommandButton('ErgoWifi', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);

  if (remoteStyle === 'L') return;

  buildCommandButton('ErgoWifi', mqtt, controller, 'PresetUserFavorite', Commands.PresetMemory1);
  buildCommandButton('ErgoWifi', mqtt, controller, 'PresetTV', Commands.PresetMemory2);
  buildCommandButton('ErgoWifi', mqtt, controller, 'PresetAntiSnore', Commands.PresetMemory3);
};
