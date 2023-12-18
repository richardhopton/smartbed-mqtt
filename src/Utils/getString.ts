import Strings from 'Strings/en';
import { Dictionary } from './Dictionary';
let strings: Dictionary<string> = {};

export const loadStrings = (language = 'en') => {
  strings = require(`../Strings/${language}`).default;
};

export type StringsKey = keyof typeof Strings;

export const getString = (key: StringsKey) => strings[key] || key;
