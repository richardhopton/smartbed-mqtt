import { logError, logInfo } from '@utils/logger';
import mqtt from 'mqtt';
import { IMQTTConnection } from './IMQTTConnection';
import MQTTConfig from './MQTTConfig';
import { MQTTConnection } from './MQTTConnection';

export const connectToMQTT = (): Promise<IMQTTConnection> => {
  logInfo('[MQTT] Connecting...');
  const client = mqtt.connect(MQTTConfig);

  return new Promise((resolve, reject) => {
    client.once('connect', () => {
      logInfo('[MQTT] Connected');
      resolve(new MQTTConnection(client));
    });
    client.once('error', (error: Error & { code?: number }) => {
      if (error?.code === 5 || /not authorized/i.test(error?.message || '')) {
        logError(
          '[MQTT] Authentication failed (Not authorized). Please configure valid mqtt_user and mqtt_password in the add-on configuration.'
        );
      }
      logError('[MQTT] Connect Error', error);
      reject(error);
    });
  });
};
