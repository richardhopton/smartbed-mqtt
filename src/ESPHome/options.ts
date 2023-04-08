import { readFileSync } from 'fs';

export interface BLEProxy {
  host: string;
  port: number | undefined;
  password: string | undefined;
  encryptionKey: string | undefined;
  expectedServerName: string | undefined;
}

interface OptionsJson {
  bleProxies: BLEProxy[];
}

const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());

export const getProxies = () => {
  const proxies = options.bleProxies;
  if (Array.isArray(proxies)) {
    return proxies;
  }
  return [];
};
