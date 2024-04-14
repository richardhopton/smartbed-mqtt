import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Commands } from 'Common/Commands';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Controller } from './Controller';

export const setupPresetButtons = (mqtt: IMQTTConnection, { device: { remoteStyle }, ...controller }: Controller) => {
  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetFlat', Commands.PresetFlat);
  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetZeroG', Commands.PresetZeroG);

  if (remoteStyle === 'L') return;

  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetUserFavorite', Commands.PresetMemory1);
  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetTV', Commands.PresetMemory2);
  buildCommandButton('ErgoMotion', mqtt, controller, 'PresetAntiSnore', Commands.PresetMemory3);
};
