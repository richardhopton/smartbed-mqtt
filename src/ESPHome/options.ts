import { getRootOptions } from '@utils/options';

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

const options: OptionsJson = getRootOptions();

export const getProxies = () => {
  const proxies = options.bleProxies;
  if (Array.isArray(proxies)) {
    return proxies;
  }
  return [];
};
