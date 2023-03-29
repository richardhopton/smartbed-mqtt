import { Dictionary } from '@utils/Dictionary';
import { Features } from './Features';

export const remoteFeatures: Dictionary<number> = {
  VIRM:
    Features.PresetFlat |
    Features.PresetZeroG |
    Features.PresetAntiSnore |
    Features.PresetMemory |
    Features.ProgramZeroG |
    Features.ProgramAntiSnore |
    Features.ProgramMemory |
    Features.UnderBedLightsToggle |
    Features.MassageHeadStep |
    Features.MassageFootStep |
    Features.MassageMode |
    Features.MassageToggle,
};
