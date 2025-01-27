import { stringToBytes } from './stringToBytes';

export const Commands = {
  PresetFlat: stringToBytes('MEM 0'),

  PresetUnwind: stringToBytes('MEM 1'),
  PresetSleep: stringToBytes('MEM 2'),
  PresetWakeUp: stringToBytes('MEM 3'),
  PresetRelax: stringToBytes('MEM 4'),
  PresetAntiSnore: stringToBytes('SNR'),

  ProgramUnwind: stringToBytes('SMEM 1'),
  ProgramSleep: stringToBytes('SMEM 2'),
  ProgramWakeUp: stringToBytes('SMEM 3'),
  ProgramRelax: stringToBytes('SMEM 4'),
  ProgramAntiSnore: stringToBytes('SNPOS 0'),

  Stop: stringToBytes('STOP'),

  GetState: stringToBytes('GET STATE'),
  RGBOff: stringToBytes('RGBENABLE 0:0'),
  RGBSet: (red: number, green: number, blue: number, brightness: number) => {
    const hex = [red >> 4, red & 15, green >> 4, green & 15, blue >> 4, blue & 15, brightness >> 4, brightness & 15]
      .map((i) => i.toString(16))
      .join('')
      .toUpperCase();
    return stringToBytes(`RGBSET 0:${hex}`);
  },

  MassageHeadStrength: (strength: number) => stringToBytes(`MVI 0:${strength}`),
  MassageFootStrength: (strength: number) => stringToBytes(`MVI 1:${strength}`),
  MassageWaveOn: stringToBytes('MMODE 0:0'),
  MassageWaveOff: stringToBytes('MMODE 0:2'),
  MassageWaveLevel: (level: number) => stringToBytes(`WSP 0:${level}`),
};
