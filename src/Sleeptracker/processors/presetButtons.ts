import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { CommandButton } from '@sleeptracker/entities/CommandButton';
import { Bed } from '@sleeptracker/types/Bed';
import { Commands } from '@sleeptracker/types/Commands';
import { Controller } from '@sleeptracker/types/Controller';
import { buildEntityName } from '@utils/buildEntityName';

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
  { user, sideName, entities }: Controller
) => {
  const cache = entities as PresetButtonEntities;

  let { flatPreset } = cache;
  if (!flatPreset) {
    flatPreset = cache.flatPreset = new CommandButton(
      mqtt,
      deviceData,
      buildEntityName('Preset: Flat', sideName),
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
      buildEntityName('Preset: Zero G', sideName),
      Commands.PresetZeroG,
      user
    );
  }
  zeroGPreset.setOnline();
  if (!zeroGProgram) {
    zeroGProgram = cache.zeroGProgram = new CommandButton(
      mqtt,
      deviceData,
      buildEntityName('Program: Zero G', sideName),
      Commands.ProgramZeroG,
      user,
      { isConfig: true }
    );
  }
  zeroGProgram.setOnline();

  let { tvPreset, tvProgram } = cache;
  if (!tvPreset) {
    tvPreset = cache.tvPreset = new CommandButton(
      mqtt,
      deviceData,
      buildEntityName('Preset: TV', sideName),
      Commands.PresetTV,
      user
    );
  }
  tvPreset.setOnline();
  if (!tvProgram) {
    tvProgram = cache.tvProgram = new CommandButton(
      mqtt,
      deviceData,
      buildEntityName('Program: TV', sideName),
      Commands.ProgramTV,
      user,
      { isConfig: true }
    );
  }
  tvProgram.setOnline();

  let { userFavoritePreset, userFavoriteProgram } = cache;
  if (!userFavoritePreset) {
    userFavoritePreset = cache.userFavoritePreset = new CommandButton(
      mqtt,
      deviceData,
      buildEntityName('Preset: User Favorite', sideName),
      Commands.PresetUserFavorite,
      user
    );
  }
  userFavoritePreset.setOnline();
  if (!userFavoriteProgram) {
    userFavoriteProgram = cache.userFavoriteProgram = new CommandButton(
      mqtt,
      deviceData,
      buildEntityName('Program: User Favorite', sideName),
      Commands.ProgramUserFavorite,
      user,
      { isConfig: true }
    );
  }
  userFavoriteProgram.setOnline();

  if (!supportedFeatures.antiSnorePreset) return;

  let { antiSnorePreset, antiSnoreProgram } = cache;
  if (!antiSnorePreset) {
    antiSnorePreset = cache.antiSnorePreset = new CommandButton(
      mqtt,
      deviceData,
      buildEntityName('Preset: Anti Snore', sideName),
      Commands.PresetAntiSnore,
      user
    );
  }
  antiSnorePreset.setOnline();
  if (!antiSnoreProgram) {
    antiSnoreProgram = cache.antiSnoreProgram = new CommandButton(
      mqtt,
      deviceData,
      buildEntityName('Program: Anti Snore', sideName),
      Commands.ProgramAntiSnore,
      user,
      { isConfig: true }
    );
  }
  antiSnoreProgram.setOnline();
};
