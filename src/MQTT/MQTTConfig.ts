import { IClientOptions } from 'mqtt/types/lib/client';

export default {
  host: process.env.MQTTHOST,
  port: process.env.MQTTPORT,
  username: process.env.MQTTUSER,
  password: process.env.MQTTPASSWORD,
  will: {
    topic: 'smartbed-mqtt/status',
    payload: Buffer.from('offline'),
    qos: 1,
    retain: true,
  },
} as IClientOptions;
