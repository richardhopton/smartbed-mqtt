import { Dictionary } from './Dictionary';

let strings: Dictionary<string> = {};

export const loadStrings = (language = 'en') => {
  strings = require(`../Strings/${language}`).default;
};

type Key =
  | 'PresetFlat'
  | 'PresetZeroG'
  | 'PresetTV'
  | 'PresetUserFavorite'
  | 'PresetMemory'
  | 'PresetAntiSnore'
  | 'ProgramZeroG'
  | 'ProgramTV'
  | 'ProgramUserFavorite'
  | 'ProgramMemory'
  | 'ProgramAntiSnore'
  | 'MassageHeadStep'
  | 'MassageFootStep'
  | 'MassageStep'
  | 'MassageTimerStep'
  | 'MassageHeadStrength'
  | 'MassageFootStrength'
  | 'AngleHead'
  | 'AngleFoot'
  | 'SafetyLights'
  | 'SafetyLightsToggle'
  | 'UnderBedLightsToggle'
  | 'MassageToggle'
  | 'MassageMode';

export const getString = (key: Key) => strings[key] || key;
