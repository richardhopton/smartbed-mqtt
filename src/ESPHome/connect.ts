import { Connection } from '@2colors/esphome-native-api';
import { logError, logInfo } from '@utils/logger';

export const connect = (connection: Connection) => {
  return new Promise<Connection>((resolve, reject) => {
    const errorHandler = (error: any) => {
      logError('[ESPHome] Failed Connecting:', error);
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
        connection.off('error', handler);
        connection.once('error', errorHandler);
      } catch (err) {
        errorHandler(err);
      }
    };
    const retryHandler = (error: any) => {
      logError('[ESPHome] Failed Connecting (will retry):', error);
      doConnect(errorHandler);
    };
    doConnect(retryHandler);
  });
};
