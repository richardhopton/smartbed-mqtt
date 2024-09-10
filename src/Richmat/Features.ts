export enum Features {
  PresetFlat = 1 << 0,

  PresetAntiSnore = 1 << 1,
  PresetMemory1 = 1 << 2,
  PresetZeroG = 1 << 3,

  ProgramAntiSnore = 1 << 4,
  ProgramMemory1 = 1 << 5,
  ProgramZeroG = 1 << 6,

  UnderBedLightsToggle = 1 << 7,

  MassageHeadStep = 1 << 8,
  MassageFootStep = 1 << 9,
  MassageMode = 1 << 10,
  MassageToggle = 1 << 11,
}

export type HasFeature = (feature: Features) => boolean;
