import { logError, logInfo } from '@utils/logger';
import EventEmitter from 'events';
import { MqttClient } from 'mqtt';
import { IMQTTConnection } from './IMQTTConnection';

export class MQTTConnection extends EventEmitter implements IMQTTConnection {
  constructor(private client: MqttClient) {
    super();

    client.on('connect', () => {
      logInfo('[MQTT] Connected');
      this.emit('connect');
    });

    client.on('reconnect', () => {
      logInfo('[MQTT] Reconnecting...');
    });

    client.on('disconnect', client.removeAllListeners);

    client.on('error', (error) => {
      logError('[MQTT] Error', error);
    });

    client.on('message', (topic, message) => {
      this.emit(topic, message.toString());
    });
  }

  publish(topic: string, message: any) {
    if (message instanceof Object) {
      message = JSON.stringify(message);
    }
    this.client.publish(topic, message, { qos: 1 });
  }

  subscribe(topic: string) {
    this.client.subscribe(topic);
  }

  unsubscribe(topic: string) {
    this.client.unsubscribe(topic);
  }
}
