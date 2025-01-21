import { Dictionary } from '@utils/Dictionary';
import { Features } from './Features';

export const remoteFeatures: Dictionary<number> = {
  W6RM:
    Features.PresetFlat |
    Features.PresetAntiSnore |
    Features.PresetLounge |
    Features.PresetMemory1 |
    Features.PresetMemory2 |
    Features.PresetTV |
    Features.PresetZeroG |
    Features.ProgramAntiSnore |
    Features.ProgramLounge |
    Features.ProgramMemory1 |
    Features.ProgramMemory2 |
    Features.ProgramTV |
    Features.ProgramZeroG |
    Features.UnderBedLightsToggle |
    Features.MassageHeadStep |
    Features.MassageFootStep |
    Features.MassageMode |
    Features.MassageToggle,
  BVRM:
    Features.PresetFlat |
    Features.PresetAntiSnore |
    Features.PresetMemory1 |
    Features.PresetMemory2 |
    Features.PresetTV |
    Features.PresetZeroG |
    Features.ProgramAntiSnore |
    Features.ProgramMemory1 |
    Features.ProgramMemory2 |
    Features.ProgramTV |
    Features.ProgramZeroG |
    Features.MassageHeadStep |
    Features.MassageFootStep |
    Features.MassageMode |
    Features.MassageToggle,
  V1RM:
    Features.PresetFlat |
    Features.PresetZeroG |
    Features.PresetAntiSnore |
    Features.PresetMemory1 |
    Features.ProgramZeroG |
    Features.ProgramAntiSnore |
    Features.ProgramMemory1 |
    Features.UnderBedLightsToggle |
    Features.MassageHeadStep |
    Features.MassageFootStep |
    Features.MassageMode |
    Features.MassageToggle,
  X1RM:
    Features.PresetFlat |
    Features.PresetAntiSnore |
    Features.PresetZeroG |
    Features.PresetMemory1 |
    Features.ProgramZeroG |
    Features.ProgramAntiSnore |
    Features.ProgramMemory1,
  ZR10:
    Features.PresetFlat |
    Features.PresetZeroG |
    Features.PresetAntiSnore |
    Features.PresetMemory1 |
    Features.ProgramZeroG |
    Features.ProgramAntiSnore |
    Features.ProgramMemory1 |
    Features.UnderBedLightsToggle,
  ZR60:
    Features.PresetFlat |
    Features.PresetZeroG |
    Features.PresetAntiSnore |
    Features.PresetMemory1 |
    Features.ProgramZeroG |
    Features.ProgramAntiSnore |
    Features.ProgramMemory1 |
    Features.UnderBedLightsToggle,
};
