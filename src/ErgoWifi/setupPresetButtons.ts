import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { IController } from 'Common/IController';
import { buildCachedButton } from 'Common/buildCachedButton';
import { RemoteStyle } from './options';

export const setupPresetButtons = (
  mqtt: IMQTTConnection,
  controller: IController<number>,
  remoteStyle: RemoteStyle
) => {
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);

  if (remoteStyle === 'L') return;

  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetUserFavorite', Commands.PresetMemory1);
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetTV', Commands.PresetMemory2);
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetAntiSnore', Commands.PresetMemory3);
};
