export enum Commands {
  PresetFlat = 0x8000000,
  PresetZeroG = 0x1000,
  PresetMemory1 = 0x2000,
  PresetMemory2 = 0x4000,
  PresetMemory3 = 0x8000,
  PresetMemory4 = 0x10000,

  MotorHeadUp = 0x1,
  MotorHeadDown = 0x2,
  MotorFeetUp = 0x4,
  MotorFeetDown = 0x8,
  MotorTiltUp = 0x10,
  MotorTiltDown = 0x20,
  MotorLumbarUp = 0x40,
  MotorLumbarDown = 0x80,

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
