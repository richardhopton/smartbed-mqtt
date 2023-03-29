import { Connection } from '@2colors/esphome-native-api';
import { logError, logInfo } from '@utils/logger';

export const connect = (connection: Connection) => {
  return new Promise<Connection>((resolve, reject) => {
    const errorHandler = (error: any) => {
      logError('[ESPHome] Connecting:', error);
      reject(error);
    };
    connection.once('authorized', () => {
      logInfo('[ESPHome] Connected:', connection.host);
      connection.off('error', errorHandler);
      resolve(connection);
    });
    const doConnect = (handler: (error: any) => void) => {
      try {
        connection.once('error', handler);
        connection.connect();
      } catch (err) {
        errorHandler(err);
      }
    };
    const retryHandler = () => {
      logInfo('[ESPHome] Connecting (retry):', connection.host);
      doConnect(errorHandler);
    };
    doConnect(retryHandler);
  });
};
