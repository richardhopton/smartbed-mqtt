export const intToBytes = (value: number) => [
  (value >> 24) & 255,
  (value >> 16) & 255,
  (value >> 8) & 255,
  value & 255,
];
