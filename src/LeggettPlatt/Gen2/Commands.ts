const buildCommand = (text: string) => text.split('').map((c) => c.charCodeAt(0));

export const Commands = {
  PresetFlat: buildCommand('MEM 0'),

  PresetUnwind: buildCommand('MEM 1'),
  PresetSleep: buildCommand('MEM 2'),
  PresetWakeUp: buildCommand('MEM 3'),
  PresetRelax: buildCommand('MEM 4'),
  PresetAntiSnore: buildCommand('SNR'),

  ProgramUnwind: buildCommand('SMEM 1'),
  ProgramSleep: buildCommand('SMEM 2'),
  ProgramWakeUp: buildCommand('SMEM 3'),
  ProgramRelax: buildCommand('SMEM 4'),
  ProgramAntiSnore: buildCommand('SNPOS 0'),

  Stop: buildCommand('STOP'),

  GetState: buildCommand('GET STATE'),
  RGBOff: buildCommand('RGBENABLE 0:0'),
  RGBSet: (red: number, green: number, blue: number, brightness: number) => {
    const hex = [red >> 4, red & 15, green >> 4, green & 15, blue >> 4, blue & 15, brightness >> 4, brightness & 15]
      .map((i) => i.toString(16))
      .join('')
      .toUpperCase();
    return buildCommand(`RGBSET 0:${hex}`);
  },
  MassageHeadStrength: (strength: number) => buildCommand(`MVI 0:${strength}`),
  MassageFootStrength: (strength: number) => buildCommand(`MVI 1:${strength}`),
  MassageWaveOn: buildCommand('MMODE 0:0'),
  MassageWaveOff: buildCommand('MMODE 0:2'),
  MassageWaveLevel: (level: number) => buildCommand(`WSP 0:${level}`),
};
