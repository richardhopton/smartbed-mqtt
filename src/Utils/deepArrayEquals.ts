import { arrayEquals } from './arrayEquals';

export const deepArrayEquals = (arr1: (number[] | Uint8Array)[], arr2: (number[] | Uint8Array)[]) =>
  arr1.length === arr2.length && arr1.every((v, i) => arrayEquals(v, arr2[i]));
