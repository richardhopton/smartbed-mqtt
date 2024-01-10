export enum Commands {
  PresetZeroG = 4096,
  PresetFlat = 134217728,
  PresetTV = 16384,
  PresetAntiSnore = 32768,
  PresetUserFavorite = 8192,

  HeadUpIncrement = 1,
  HeadDownIncrement = 2,
  FootUpIncrement = 4,
  FootDownIncrement = 8,
  HeadTiltUpIncrement = 16,
  HeadTiltDownIncrement = 32,
  LumbarUpIncrement = 64,
  LumbarDownIncrement = 128,

  MassageHeadUp = 2048,
  MassageHeadDown = 8388608,
  MassageFootUp = 1024,
  MassageFootDown = 16777216,
  MassageStep = 256,
  MassageTimerStep = 512,

  ToggleSafetyLights = 131072,
}
