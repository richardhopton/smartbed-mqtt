import { Connection } from '@2colors/esphome-native-api';
import { logInfo } from '@utils/logger';
import { connect } from './connect';
import { discoverProxies } from './discoverProxies';
import { ESPConnection } from './ESPConnection';
import { IESPConnection } from './IESPConnection';
import { BLEProxy, getProxies } from './options';

export const connectToESPHome = async (): Promise<IESPConnection> => {
  logInfo('[ESPHome] Connecting...');

  const proxies = getProxies();
  const useDiscovery = proxies.length === 1 && proxies[0].host === '<discover>';
  const connections = useDiscovery
    ? await discoverProxies(proxies[0].password || '')
    : await Promise.all(
        proxies.map(async (config: BLEProxy) => {
          const connection = new Connection(config);
          return await connect(connection);
        })
      );
  return new ESPConnection(connections);
};
