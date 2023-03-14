import { readFileSync } from 'fs';

export type Type = 'sleeptracker' | 'ergomotion';

interface OptionsJson {
  type: Type;
}

const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());

export const getType = () => options.type;
