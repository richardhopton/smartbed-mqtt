import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';
import { RemoteStyle } from './options';

export const setupPresetButtons = (mqtt: IMQTTConnection, controller: Controller, remoteStyle: RemoteStyle) => {
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);

  if (remoteStyle === 'L') return;

  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetTV', Commands.PresetTV);
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetUserFavorite', Commands.PresetUserFavorite);
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
};
