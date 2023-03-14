export const shortToBytes = (value: number) => [(value >> 8) & 255, value & 255];
