import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { CommandButton } from '../entities/CommandButton';
import { Bed } from '../types/Bed';
import { Commands } from '../types/Commands';

interface PresetButtonEntities {
  flatPreset?: CommandButton;
  zeroGPreset?: CommandButton;
  tvPreset?: CommandButton;
  userFavoritePreset?: CommandButton;
  antiSnorePreset?: CommandButton;
}

export const setupPresetButtons = (mqtt: IMQTTConnection, { deviceData, id, user, entities }: Bed) => {
  const cache = entities as PresetButtonEntities;

  let { flatPreset } = cache;
  if (!flatPreset) {
    flatPreset = cache.flatPreset = new CommandButton(
      mqtt,
      deviceData,
      { description: 'Preset: Flat' },
      Commands.PresetFlat,
      user,
      id
    );
  }
  flatPreset.setOnline();

  let { zeroGPreset } = cache;
  if (!zeroGPreset) {
    zeroGPreset = cache.zeroGPreset = new CommandButton(
      mqtt,
      deviceData,
      { description: 'Preset: Zero G' },
      Commands.PresetZeroG,
      user,
      id
    );
  }
  zeroGPreset.setOnline();

  if (user.remoteStyle === 'L') return;

  let { tvPreset } = cache;
  if (!tvPreset) {
    tvPreset = cache.tvPreset = new CommandButton(
      mqtt,
      deviceData,
      { description: 'Preset: TV' },
      Commands.PresetTV,
      user,
      id
    );
  }
  tvPreset.setOnline();

  let { userFavoritePreset } = cache;
  if (!userFavoritePreset) {
    userFavoritePreset = cache.userFavoritePreset = new CommandButton(
      mqtt,
      deviceData,
      { description: 'Preset: User Favorite' },
      Commands.PresetUserFavorite,
      user,
      id
    );
  }
  userFavoritePreset.setOnline();

  let { antiSnorePreset } = cache;
  if (!antiSnorePreset) {
    antiSnorePreset = cache.antiSnorePreset = new CommandButton(
      mqtt,
      deviceData,
      { description: 'Preset: Anti Snore' },
      Commands.PresetAntiSnore,
      user,
      id
    );
  }
  antiSnorePreset.setOnline();
};
