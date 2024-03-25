export enum Commands {
  PresetFlat = 0x8000000,
  PresetZeroG = 0x1000,
  PresetMemory1 = 0x2000,
  PresetMemory2 = 0x4000,
  PresetAntiSnore = 0x8000,

  HeadUpIncrement = 0x1,
  HeadDownIncrement = 0x2,
  FootUpIncrement = 0x4,
  FootDownIncrement = 0x8,
  HeadTiltUpIncrement = 0x10,
  HeadTiltDownIncrement = 0x20,
  LumbarUpIncrement = 0x40,
  LumbarDownIncrement = 0x80,

  MassageHeadUp = 0x800,
  MassageHeadDown = 0x800000,
  MassageFootUp = 0x400,
  MassageFootDown = 0x1000000,
  MassageStep = 0x100,
  MassageTimerStep = 0x200,
  MassageWaveStep = 0x10000000,

  ToggleSafetyLights = 0x20000,

  // Reset = 0x8001000,
  // MassageWaveStep = 0x100000,
  // MassageMode2 = 0x200000,
  // MassageLumbarUp = 0x400000,
}
