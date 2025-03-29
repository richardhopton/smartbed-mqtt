import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey, getString } from '@utils/getString';
import { logError } from '@utils/logger';
import { IController } from './IController';
import { buildEntityConfig } from './buildEntityConfig';

export const buildCommandButton = <TCommand>(
  context: string,
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand }: IController<TCommand>,
  name: StringsKey,
  command: TCommand,
  options: { category?: string; count?: number; waitTime?: number } | string = {}
) => {
  if (cache[name]) return;

  const { category, count, waitTime } = typeof options === 'string' ? { category: options } : options;

  cache[name] = new Button(mqtt, deviceData, buildEntityConfig(name, category), async () => {
    try {
      await writeCommand(command, count, waitTime);
    } catch (e) {
      logError(`[${context}] Failed to write '${getString(name)}'`, e);
    }
  }).setOnline();
};
