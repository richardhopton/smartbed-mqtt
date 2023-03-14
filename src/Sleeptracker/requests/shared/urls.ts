import { Dictionary } from '@utils/Dictionary';
import { Credentials, Type } from '../../options';

const getBaseUrl = (type: Type) => {
  switch (type) {
    case 'beautyrest':
    case 'serta':
      return 'motionxlive.com';
    case 'tempur':
    default:
      return 'tsi.sleeptracker.com';
  }
};

type UrlCache = {
  authHost: string;
  authRequestUrl: string;
  appHost: string;
  fpcsiotBaseUrl: string;
  processorBaseUrl: string;
  settingsBaseUrl: string;
};

const urlCacheByType: Dictionary<UrlCache> = {};
export const urls = ({ type }: Credentials) => {
  if (!type) type = 'tempur';
  let urlCache = urlCacheByType[type];
  if (!urlCache) {
    const baseUrl = getBaseUrl(type);

    const authHost = `auth.${baseUrl}`;
    const appHost = `app.${baseUrl}`;

    const authRequestUrl = `https://${authHost}/v1/app/user/session`;

    const fpcsiotBaseUrl = `https://${appHost}/actrack-client/v2/fpcsiot`;
    const processorBaseUrl = `${fpcsiotBaseUrl}/processor`;
    const settingsBaseUrl = `${fpcsiotBaseUrl}/settings`;
    urlCache = urlCacheByType[type] = {
      authHost,
      authRequestUrl,
      appHost,
      fpcsiotBaseUrl,
      processorBaseUrl,
      settingsBaseUrl,
    };
  }
  return urlCache;
};
