export enum Features {
  PresetFlat = 1,
  PresetZeroG = 2,
  PresetAntiSnore = 4,
  PresetMemory = 8,
  ProgramZeroG = 16,
  ProgramAntiSnore = 32,
  ProgramMemory = 64,
  UnderBedLightsToggle = 128,
  MassageHeadStep = 256,
  MassageFootStep = 512,
  MassageMode = 1024,
  MassageToggle = 2048,
}

export type HasFeature = (feature: Features) => boolean;
