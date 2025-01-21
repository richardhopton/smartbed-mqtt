export enum Features {
  PresetFlat = 1 << 0,

  PresetAntiSnore = 1 << 1,
  PresetLounge = 1 << 2,
  PresetMemory1 = 1 << 3,
  PresetMemory2 = 1 << 4,
  PresetTV = 1 << 5,
  PresetZeroG = 1 << 6,

  ProgramAntiSnore = 1 << 7,
  ProgramLounge = 1 << 8,
  ProgramMemory1 = 1 << 9,
  ProgramMemory2 = 1 << 10,
  ProgramTV = 1 << 11,
  ProgramZeroG = 1 << 12,

  UnderBedLightsToggle = 1 << 13,

  MassageHeadStep = 1 << 14,
  MassageFootStep = 1 << 15,
  MassageMode = 1 << 16,
  MassageToggle = 1 << 17,

  MotorHead = 1 << 18,
  MotorFeet = 1 << 19,
  MotorPillow = 1 << 20,
  MotorLumbar = 1 << 21,
}

export type HasFeature = (feature: Features) => boolean;
