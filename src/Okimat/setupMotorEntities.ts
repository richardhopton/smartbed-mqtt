import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { Remote } from './Remote';
import { StringsKey } from '@utils/getString';
import { Cover } from '@ha/Cover';
import { buildEntityConfig } from 'Common/buildEntityConfig';

interface MotorState {
  command?: number;
  canceled?: boolean;
}

type Command = { name: StringsKey; up: number; down: number };

const buildCommand = (name: StringsKey, up: number, down: number): Command => {
  return { name, up, down };
};

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number>,
  remote: Remote
) => {
  if (!cache.motorState) cache.motorState = {};

  const commands: Command[] = [];

  const { BackUp, BackDown } = remote.commands;
  if (BackUp && BackDown && typeof BackUp === 'number' && typeof BackDown === 'number')
    commands.push(buildCommand('MotorBack', BackUp, BackDown));

  const { LegsUp, LegsDown } = remote.commands;
  if (LegsUp && LegsDown && typeof LegsUp === 'number' && typeof LegsDown === 'number')
    commands.push(buildCommand('MotorLegs', LegsUp, LegsDown));

  for (const { name, up, down } of commands) {
    const coverCommand = async (command: string) => {
      const motorState = cache.motorState as MotorState;
      const originalCommand = motorState.command;
      motorState.command = command === 'OPEN' ? up : command === 'CLOSE' ? down : undefined;
      const newCommand = motorState.command;
      if (newCommand === originalCommand) return;

      motorState.canceled = true;
      await cancelCommands();
      motorState.canceled = false;

      if (!newCommand) return;

      await writeCommand(newCommand, 50, 100);
      if (motorState.canceled) return;
      cache.motorState = {};
    };
    new Cover(mqtt, deviceData, buildEntityConfig(name), coverCommand).setOnline();
  }
};
