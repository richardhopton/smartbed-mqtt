import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, { user: { remoteStyle }, ...controller }: Controller) => {
  buildCachedButton(mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCachedButton(mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);

  if (remoteStyle === 'L') return;

  buildCachedButton(mqtt, controller, 'PresetTV', Commands.PresetTV);
  buildCachedButton(mqtt, controller, 'PresetUserFavorite', Commands.PresetUserFavorite);
  buildCachedButton(mqtt, controller, 'PresetAntiSnore', Commands.PresetAntiSnore);
};
