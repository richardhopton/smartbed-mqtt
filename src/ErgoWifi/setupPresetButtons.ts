import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, { user: { remoteStyle }, ...controller }: Controller) => {
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);

  if (remoteStyle === 'L') return;

  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetTV', Commands.PresetTV);
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetUserFavorite', Commands.PresetUserFavorite);
  buildCachedButton('ErgoWifi', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
};
