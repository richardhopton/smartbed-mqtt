import { readFileSync } from 'fs';

export type Type = 'keeson';

interface OptionsJson {
  type: Type;
  keesonDevices?: any[];
}

const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());
export const getRootOptions = (): any => options;

export const getType = () => options.type;
