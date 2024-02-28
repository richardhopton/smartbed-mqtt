import { Connection } from '@2colors/esphome-native-api';
import { logInfo } from '@utils/logger';
import { ESPConnection } from './ESPConnection';
import { IESPConnection } from './IESPConnection';
import { connect } from './connect';
import { BLEProxy, getProxies } from './options';

export const connectToESPHome = async (): Promise<IESPConnection> => {
  logInfo('[ESPHome] Connecting...');

  const proxies = getProxies();
  const connections =
    proxies.length == 0
      ? []
      : await Promise.all(
          proxies.map(async (config: BLEProxy) => {
            const connection = new Connection(config);
            return await connect(connection);
          })
        );
  return new ESPConnection(connections);
};
