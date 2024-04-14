import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey, getString } from '@utils/getString';
import { logError } from '@utils/logger';
import { IController } from './IController';
import { buildEntityConfig } from './buildEntityConfig';

export const buildCommandsButton = <TCommand>(
  context: string,
  mqtt: IMQTTConnection,
  controller: IController<TCommand>,
  name: StringsKey,
  commands: TCommand[],
  category?: string,
  duration?: number,
  frequency?: number
) => {
  const { entities, deviceData, writeCommands } = controller;
  let button = entities[name];
  if (!button) {
    button = entities[name] = new Button(mqtt, deviceData, buildEntityConfig(name, category), async () => {
      try {
        await writeCommands(commands, duration, frequency);
      } catch (e) {
        logError(`[${context}] Failed to write '${getString(name)}'`, e);
      }
    });
  }
  button.setOnline();
};
