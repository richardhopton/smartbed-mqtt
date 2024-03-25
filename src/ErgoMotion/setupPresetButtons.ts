import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, { device: { remoteStyle }, ...controller }: Controller) => {
  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);

  if (remoteStyle === 'L') return;

  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetUserFavorite', Commands.PresetMemory1);
  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetTV', Commands.PresetMemory2);
  buildCachedButton('ErgoMotion', mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
};
