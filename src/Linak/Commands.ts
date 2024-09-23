export enum Direction {
  UP,
  DOWN,
}

export const Commands = {
  PresetMemory1: [0xe, 0x0],
  PresetMemory2: [0xf, 0x0],
  PresetMemory3: [0xc, 0x0],
  PresetMemory4: [0x44, 0x0],

  ProgramMemory1: [0x38, 0x0],
  ProgramMemory2: [0x39, 0x0],
  ProgramMemory3: [0x3a, 0x0],
  ProgramMemory4: [0x45, 0x0],

  UnderBedLightsOn: [0x92, 0x0],
  UnderBedLightsOff: [0x93, 0x0],
  UnderBedLightsToggle: [0x94, 0x0],

  MassageAllOff: [0x80, 0x0],
  MassageAllToggle: [0x91, 0x0],
  MassageAllUp: [0xa8, 0x0],
  MassageAllDown: [0xa9, 0x0],

  MassageHeadToggle: [0xa6, 0x0],
  MassageHeadUp: [0x8d, 0x0],
  MassageHeadDown: [0x8e, 0x0],

  MassageFootToggle: [0xa7, 0x0],
  MassageFootUp: [0x8f, 0x0],
  MassageFootDown: [0x90, 0x0],

  MassageModeStep: [0x81, 0x0],

  Move: (head?: Direction, back?: Direction, legs?: Direction, feet?: Direction) => {
    if (head == Direction.UP && back == Direction.UP && legs == Direction.UP && feet == Direction.UP)
      return [0x00, 0x00];
    if (head == Direction.DOWN && back == Direction.DOWN && legs == Direction.DOWN && feet == Direction.DOWN)
      return [0x01, 0x00];

    if (legs == Direction.UP) {
      if (back == Direction.UP) return [0x37, 0x00];
      if (back == Direction.DOWN) return [0x36, 0x00];
    }
    if (legs == Direction.DOWN) {
      if (back == Direction.UP) return [0x35, 0x00];
      if (back == Direction.DOWN) return [0x34, 0x00];
    }

    if (head == Direction.UP) {
      if (back == Direction.UP) return [0x33, 0x00];
      if (legs == Direction.UP) return [0x32, 0x00];
      if (back == Direction.DOWN) return [0x31, 0x00];
      if (legs == Direction.DOWN) return [0x30, 0x00];
    }
    if (head == Direction.DOWN) {
      if (back == Direction.UP) return [0x2f, 0x00];
      if (legs == Direction.UP) return [0x2e, 0x00];
      if (back == Direction.DOWN) return [0x2d, 0x00];
      if (legs == Direction.DOWN) return [0x2c, 0x00];
    }

    if (feet == Direction.UP) {
      if (back == Direction.UP) return [0x2b, 0x00];
      if (legs == Direction.UP) return [0x2a, 0x00];
      if (head == Direction.UP) return [0x29, 0x00];
      if (back == Direction.DOWN) return [0x28, 0x00];
      if (legs == Direction.DOWN) return [0x27, 0x00];
      if (head == Direction.DOWN) return [0x26, 0x00];
    }

    if (feet == Direction.DOWN) {
      if (back == Direction.UP) return [0x25, 0x00];
      if (legs == Direction.UP) return [0x24, 0x00];
      if (head == Direction.UP) return [0x23, 0x00];
      if (back == Direction.DOWN) return [0x22, 0x00];
      if (legs == Direction.DOWN) return [0x21, 0x00];
      if (head == Direction.DOWN) return [0x20, 0x00];
    }

    if (back == Direction.UP) return [0x0b, 0x00];
    if (back == Direction.DOWN) return [0x0a, 0x00];
    if (legs == Direction.UP) return [0x09, 0x00];
    if (legs == Direction.DOWN) return [0x08, 0x00];

    if (feet == Direction.UP) return [0x05, 0x00];
    if (feet == Direction.DOWN) return [0x04, 0x00];
    if (head == Direction.UP) return [0x03, 0x00];
    if (head == Direction.DOWN) return [0x02, 0x00];

    return [0xff, 0x00];
  },
};
