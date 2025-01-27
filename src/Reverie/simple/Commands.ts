export const Commands = {
  PresetZeroG: [0x15],
  PresetAntiSnore: [0x16],
  PresetFlat: [0x5],

  PresetMemory1: [0x11],
  PresetMemory2: [0x12],
  PresetMemory3: [0x13],
  PresetMemory4: [0x14],

  ProgramMemory1: [0x21],
  ProgramMemory2: [0x22],
  ProgramMemory3: [0x23],
  ProgramMemory4: [0x24],

  UnderBedLightsToggle: [0x5b, 0x00],

  MassageHead: (level: number) => [0x53, level],
  MassageFoot: (level: number) => [0x54, level],
  MassageWave: (level: number) => [0x40 + level],

  MotorMove: (motor: 'head' | 'feet', position: number) => {
    switch (motor) {
      case 'head':
        return [0x51, position];
      case 'feet':
        return [0x52, position];
    }
  },

  MotorStop: [0xff],
};
