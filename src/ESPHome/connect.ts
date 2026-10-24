import { Connection } from '@2colors/esphome-native-api';
import { logError, logInfo, logWarn } from '@utils/logger';

const FEATURE_ACTIVE_CONNECTIONS = 1 << 1;

export const isIgnoredESPHomeError = (error: unknown): boolean => {
  const message = (error as { message?: string })?.message || String(error ?? '');
  return /Failed find (or parsed )?message type for Id:/i.test(message);
};

export const connect = (connection: Connection) => {
  return new Promise<Connection>((resolve, reject) => {
    let settled = false;

    const runtimeErrorHandler = (error: unknown) => {
      if (isIgnoredESPHomeError(error)) return;
      logWarn('[ESPHome] Connection error:', connection.host, (error as Error)?.message || error);
    };

    const errorHandler = (error: unknown) => {
      if (isIgnoredESPHomeError(error)) return;
      logError('[ESPHome] Failed Connecting:', error);
      if (!settled) {
        settled = true;
        reject(error);
      }
    };

    connection.once('authorized', async () => {
      logInfo('[ESPHome] Connected:', connection.host);
      connection.off('error', errorHandler);
      connection.on('error', runtimeErrorHandler);
      try {
        const deviceInfo = await connection.deviceInfoService();
        const { bluetoothProxyFeatureFlags } = deviceInfo as { bluetoothProxyFeatureFlags?: number };
        if (!bluetoothProxyFeatureFlags) {
          logError('[ESPHome] No Bluetooth proxy features detected:', connection.host);
          settled = true;
          return reject(new Error(`No Bluetooth proxy features detected: ${connection.host}`));
        }
        if ((bluetoothProxyFeatureFlags & FEATURE_ACTIVE_CONNECTIONS) === 0) {
          logWarn(
            '[ESPHome] Proxy does not report active connection support (ensure bluetooth_proxy has active: true):',
            connection.host
          );
        }
        settled = true;
        resolve(connection);
      } catch (err) {
        errorHandler(err);
      }
    });

    const doConnect = (handler: (error: unknown) => void) => {
      try {
        connection.once('error', handler);
        connection.connect();
        connection.off('error', handler);
        connection.on('error', errorHandler);
      } catch (err) {
        errorHandler(err);
      }
    };

    const retryHandler = (error: unknown) => {
      if (isIgnoredESPHomeError(error)) return;
      logError('[ESPHome] Failed Connecting (will retry):', error);
      doConnect(errorHandler);
    };

    doConnect(retryHandler);
  });
};
