import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey, getString } from '@utils/getString';
import { logError } from '@utils/logger';
import { IController } from './IController';
import { buildEntityConfig } from './buildEntityConfig';

export const buildCommandSwitch = <TCommand>(
  context: string,
  mqtt: IMQTTConnection,
  controller: IController<TCommand>,
  name: StringsKey,
  command: TCommand,
  category?: string,
  duration?: number,
  frequency?: number
) => {
  const { entities, deviceData, writeCommand, cancelCommands } = controller;
  let entity = entities[name];
  if (!entity) {
    entity = entities[name] = new Switch(mqtt, deviceData, buildEntityConfig(name, category), async (state) => {
      if (!state) return cancelCommands();
      try {
        await writeCommand(command, duration, frequency);
        (entity as Switch).setState(false);
      } catch (e) {
        logError(`[${context}] Failed to write '${getString(name)}'`, e);
      }
    });
  }
  entity.setOnline();
};
