import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCommandButton } from 'Common/buildCommandButton';
import { SimpleCommand } from './CommandBuilder';
import { IController } from 'Common/IController';

export const setupButtonEntities = (
  mqtt: IMQTTConnection,
  controller: IController<number[]>,
  simpleCommands: SimpleCommand[]
) => {
  for (const { name, command, category } of simpleCommands) {
    buildCommandButton('MotoSleep', mqtt, controller, name, command, category);
  }
};
