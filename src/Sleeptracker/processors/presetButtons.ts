import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { CommandButton } from '@sleeptracker/entities/CommandButton';
import { Bed } from '@sleeptracker/types/Bed';
import { BedSide } from '@sleeptracker/types/BedSide';
import { Commands } from '@sleeptracker/types/Commands';

interface PresetButtonEntities {
  flatPreset?: CommandButton;
  zeroGPreset?: CommandButton;
  zeroGProgram?: CommandButton;
  tvPreset?: CommandButton;
  tvProgram?: CommandButton;
  userFavoritePreset?: CommandButton;
  userFavoriteProgram?: CommandButton;
  antiSnorePreset?: CommandButton;
  antiSnoreProgram?: CommandButton;
}

export const setupPresetButtons = async (
  mqtt: IMQTTConnection,
  { deviceData, supportedFeatures }: Bed,
  { user, sideName, entities }: BedSide
) => {
  const cache = entities as PresetButtonEntities;

  let { flatPreset } = cache;
  if (!flatPreset) {
    flatPreset = cache.flatPreset = new CommandButton(
      mqtt,
      deviceData,
      `Preset: Flat${sideName}`,
      Commands.PresetFlat,
      user
    );
  }
  flatPreset.setOnline();

  let { zeroGPreset, zeroGProgram } = cache;
  if (!zeroGPreset) {
    zeroGPreset = cache.zeroGPreset = new CommandButton(
      mqtt,
      deviceData,
      `Preset: Zero G${sideName}`,
      Commands.PresetZeroG,
      user
    );
  }
  zeroGPreset.setOnline();
  if (!zeroGProgram) {
    zeroGProgram = cache.zeroGProgram = new CommandButton(
      mqtt,
      deviceData,
      `Program: Zero G${sideName}`,
      Commands.ProgramZeroG,
      user,
      true
    );
  }
  zeroGProgram.setOnline();

  let { tvPreset, tvProgram } = cache;
  if (!tvPreset) {
    tvPreset = cache.tvPreset = new CommandButton(mqtt, deviceData, `Preset: TV${sideName}`, Commands.PresetTV, user);
  }
  tvPreset.setOnline();
  if (!tvProgram) {
    tvProgram = cache.tvProgram = new CommandButton(
      mqtt,
      deviceData,
      `Program: TV${sideName}`,
      Commands.ProgramTV,
      user,
      true
    );
  }
  tvProgram.setOnline();

  let { userFavoritePreset, userFavoriteProgram } = cache;
  if (!userFavoritePreset) {
    userFavoritePreset = cache.userFavoritePreset = new CommandButton(
      mqtt,
      deviceData,
      `Preset: User Favorite${sideName}`,
      Commands.PresetUserFavorite,
      user
    );
  }
  userFavoritePreset.setOnline();
  if (!userFavoriteProgram) {
    userFavoriteProgram = cache.userFavoriteProgram = new CommandButton(
      mqtt,
      deviceData,
      `Program: User Favorite${sideName}`,
      Commands.ProgramUserFavorite,
      user,
      true
    );
  }
  userFavoriteProgram.setOnline();

  if (!supportedFeatures.antiSnorePreset) return;

  let { antiSnorePreset, antiSnoreProgram } = cache;
  if (!antiSnorePreset) {
    antiSnorePreset = cache.antiSnorePreset = new CommandButton(
      mqtt,
      deviceData,
      `Preset: Anti Snore${sideName}`,
      Commands.PresetAntiSnore,
      user
    );
  }
  antiSnorePreset.setOnline();
  if (!antiSnoreProgram) {
    antiSnoreProgram = cache.antiSnoreProgram = new CommandButton(
      mqtt,
      deviceData,
      `Program: Anti Snore${sideName}`,
      Commands.ProgramAntiSnore,
      user,
      true
    );
  }
  antiSnoreProgram.setOnline();
};
