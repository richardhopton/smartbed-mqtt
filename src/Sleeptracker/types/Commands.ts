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
  MotorHeadUp = 100,
  MotorHeadDown = 101,
  MotorHeadStop = 107,

  MotorFeetUp = 102,
  MotorFeetDown = 103,
  MotorFeetStop = 108,

  MotorLumbarUp = 104,
  MotorLumbarDown = 105,
  MotorLumbarStop = 106,

  MotorTiltUp = 120,
  MotorTiltDown = 121,
  MotorTiltStop = 122,

  // MotorHeadUpIncrement = 110,
  // MotorHeadDownIncrement = 111,
  // MotorFeetUpIncrement = 112,
  // MotorFeetDownIncrement = 113,
  // MotorLumbarUpIncrement = 114,
  // MotorLumbarDownIncrement = 115,
  // MotorTiltUpIncrement = 123,
  // MotorTiltDownIncrement = 124,

  MassageHeadStep = 210,
  MassageFootStep = 211,
  MassageStep = 225,
  MassagePatternStep = 226,
  MassageTimerStep = 231,

  ToggleSafetyLights = 230,
}
