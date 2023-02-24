import { IClientOptions } from 'mqtt/types/lib/client';

export default {
  host: process.env.MQTTHOST,
  port: process.env.MQTTPORT,
  username: process.env.MQTTUSER,
  password: process.env.MQTTPASSWORD,
} as IClientOptions;
