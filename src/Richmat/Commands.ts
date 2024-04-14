export enum Commands {
  PresetZeroG = 0x45,
  PresetFlat = 0x31,
  PresetAntiSnore = 0x46,
  PresetMemory = 0x2e,

  ProgramMemory = 0x2b,
  ProgramAntiSnore = 0x69,
  ProgramZeroG = 0x66,

  MassageHeadStep = 0x4c,
  MassageFootStep = 0x4e,
  MassagePatternStep = 0x48,
  MassageToggle = 0x5d,

  UnderBedLightsToggle = 0x3c,

  End = 0x6e,
}
