export enum Commands {
  PresetFlat = 0x31,
  PresetAntiSnore = 0x46,
  PresetLounge = 0x59,
  PresetMemory1 = 0x2e,
  PresetMemory2 = 0x2f,
  PresetTV = 0x58,
  PresetZeroG = 0x45,

  ProgramAntiSnore = 0x69,
  ProgramLounge = 0x65,
  ProgramMemory1 = 0x2b,
  ProgramMemory2 = 0x2c,
  ProgramTV = 0x64,
  ProgramZeroG = 0x66,

  MassageHeadStep = 0x4c,
  MassageFootStep = 0x4e,
  MassagePatternStep = 0x48,
  MassageToggle = 0x5d,

  UnderBedLightsToggle = 0x3c,

  MotorPillowUp = 0x3f,
  MotorPillowDown = 0x40,
  MotorHeadUp = 0x24,
  MotorHeadDown = 0x25,
  MotorFeetUp = 0x26,
  MotorFeetDown = 0x27,
  MotorLumbarUp = 0x41,
  MotorLumbarDown = 0x42,

  End = 0x6e,
}
