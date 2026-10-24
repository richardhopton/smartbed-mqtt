import { IClientOptions } from 'mqtt';
import { getRootOptions } from '@utils/options';

interface MQTTOptions {
  mqtt_host?: string;
  mqtt_port?: string | number;
  mqtt_user?: string;
  mqtt_username?: string;
  mqtt_password?: string;
}

const cleanOption = (envVal: string | undefined, optVal: string | number | undefined): string | undefined => {
  const val = envVal !== undefined && envVal !== '' ? envVal : optVal !== undefined ? String(optVal) : undefined;
  if (!val || val === '<auto_detect>' || val === 'null' || val === 'undefined') return undefined;
  return val;
};

const rootOptions: MQTTOptions = getRootOptions() || {};

const host = cleanOption(process.env.MQTTHOST, rootOptions.mqtt_host) || '172.30.32.1';
const rawPort = cleanOption(process.env.MQTTPORT, rootOptions.mqtt_port);
const port = rawPort ? parseInt(rawPort, 10) : 1883;
const username = cleanOption(process.env.MQTTUSER, rootOptions.mqtt_user ?? rootOptions.mqtt_username);
const password = cleanOption(process.env.MQTTPASSWORD, rootOptions.mqtt_password);

const config: IClientOptions = {
  host,
  port: Number.isNaN(port) ? 1883 : port,
  ...(username ? { username } : {}),
  ...(password ? { password } : {}),
};

export default config;
