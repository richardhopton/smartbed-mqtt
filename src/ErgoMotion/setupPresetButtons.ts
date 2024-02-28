import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, { user: { remoteStyle }, ...controller }: Controller) => {
  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);

  if (remoteStyle === 'L') return;

  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetTV', Commands.PresetTV);
  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetUserFavorite', Commands.PresetUserFavorite);
  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
};
