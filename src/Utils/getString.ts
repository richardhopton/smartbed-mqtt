import Strings from 'Strings/en';
import { Dictionary } from './Dictionary';
let strings: Dictionary<string> = {};

export const loadStrings = async (language = 'en') => {
  strings = await import(`../Strings/${language}`);
};

export type StringsKey = keyof typeof Strings;

export const getString = (key: StringsKey) => strings[key] || key;
