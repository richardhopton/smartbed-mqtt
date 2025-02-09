export const byte = (value: number) => {
  while (value < 0) {
    value += 0xff;
  }
  return value & 0xff;
};
