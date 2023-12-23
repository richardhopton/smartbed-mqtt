import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Sleeptracker/buildEntityConfig';
import { CommandButton } from '../entities/CommandButton';
import { Bed } from '../types/Bed';
import { Commands } from '../types/Commands';
import { Controller } from '../types/Controller';

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
      buildEntityConfig('Preset: Flat', sideName),
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
      buildEntityConfig('Preset: Zero G', sideName),
      Commands.PresetZeroG,
      user
    );
  }
  zeroGPreset.setOnline();
  if (!zeroGProgram) {
    zeroGProgram = cache.zeroGProgram = new CommandButton(
      mqtt,
      deviceData,
      buildEntityConfig('Program: Zero G', sideName),
      Commands.ProgramZeroG,
      user,
      { entityCategory: 'config' }
    );
  }
  zeroGProgram.setOnline();

  let { tvPreset, tvProgram } = cache;
  if (!tvPreset) {
    tvPreset = cache.tvPreset = new CommandButton(
      mqtt,
      deviceData,
      buildEntityConfig('Preset: TV', sideName),
      Commands.PresetTV,
      user
    );
  }
  tvPreset.setOnline();
  if (!tvProgram) {
    tvProgram = cache.tvProgram = new CommandButton(
      mqtt,
      deviceData,
      buildEntityConfig('Program: TV', sideName),
      Commands.ProgramTV,
      user,
      { entityCategory: 'config' }
    );
  }
  tvProgram.setOnline();

  let { userFavoritePreset, userFavoriteProgram } = cache;
  if (!userFavoritePreset) {
    userFavoritePreset = cache.userFavoritePreset = new CommandButton(
      mqtt,
      deviceData,
      buildEntityConfig('Preset: User Favorite', sideName),
      Commands.PresetUserFavorite,
      user
    );
  }
  userFavoritePreset.setOnline();
  if (!userFavoriteProgram) {
    userFavoriteProgram = cache.userFavoriteProgram = new CommandButton(
      mqtt,
      deviceData,
      buildEntityConfig('Program: User Favorite', sideName),
      Commands.ProgramUserFavorite,
      user,
      { entityCategory: 'config' }
    );
  }
  userFavoriteProgram.setOnline();

  if (!supportedFeatures.antiSnorePreset) return;

  let { antiSnorePreset, antiSnoreProgram } = cache;
  if (!antiSnorePreset) {
    antiSnorePreset = cache.antiSnorePreset = new CommandButton(
      mqtt,
      deviceData,
      buildEntityConfig('Preset: Anti Snore', sideName),
      Commands.PresetAntiSnore,
      user
    );
  }
  antiSnorePreset.setOnline();
  if (!antiSnoreProgram) {
    antiSnoreProgram = cache.antiSnoreProgram = new CommandButton(
      mqtt,
      deviceData,
      buildEntityConfig('Program: Anti Snore', sideName),
      Commands.ProgramAntiSnore,
      user,
      { entityCategory: 'config' }
    );
  }
  antiSnoreProgram.setOnline();
};
