export enum Commands {
  Status = 1, // no-op.. status?

  // Preset
  PresetZeroG = 0,
  PresetFlat = 2,
  PresetTV = 3,
  PresetAntiSnore = 4,
  PresetUserFavorite = 6,
  PresetSnore1 = 7,
  PresetSnore2 = 8,

  ProgramTV = 300,
  ProgramUserFavorite = 304,
  ProgramAntiSnore = 302,
  ProgramZeroG = 303,

  // Motor Controls

  // HeadUp = 100, // Needs to be Stopped
  HeadUpIncrement = 110,
  // HeadDown = 101, // Needs to be Stopped
  HeadDownIncrement = 111,
  // HeadStop = 107,
  // FootUp = 102, // Needs to be Stopped
  FootUpIncrement = 112,
  // FootDown = 103, // Needs to be Stopped
  FootDownIncrement = 113,
  // FootStop = 108,
  // LumbarUp = 104, // Needs to be Stopped
  LumbarUpIncrement = 114,
  // LumbarDown = 105, // Needs to be Stopped
  LumbarDownIncrement = 115,
  // LumbarStop = 106,
  // HeadTiltUp = 120, // Needs to be Stopped
  HeadTiltUpIncrement = 123,
  // HeadTiltDown = 121, // Needs to be Stopped
  HeadTiltDownIncrement = 124,
  // HeadTiltStop = 122, // Needs to be Stopped
  MassageHeadStep = 210,
  MassageFootStep = 211,
  MassageStep = 225,
  MassagePatternStep = 226,
  MassageTimerStep = 231,

  ToggleSafetyLights = 230,
}
