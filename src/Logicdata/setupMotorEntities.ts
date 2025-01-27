import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { StringsKey } from '@utils/getString';
import { Cover } from '@ha/Cover';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { arrayEquals } from '@utils/arrayEquals';

interface MotorState {
  command?: number[];
  canceled?: boolean;
}

type Command = { name: StringsKey; up: number[]; down: number[] };

const buildCommand = (name: StringsKey, up: number[], down: number[]): Command => {
  return { name, up, down };
};

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number[]>
) => {
  if (!cache.motorState) cache.motorState = {};

  const commands = [
    buildCommand('MotorBack', Commands.MotorHeadUp, Commands.MotorHeadDown),
    buildCommand('MotorLegs', Commands.MotorLegsUp, Commands.MotorLegsDown),
  ];

  for (const { name, up, down } of commands) {
    const coverCommand = async (command: string) => {
      const motorState = cache.motorState as MotorState;
      const originalCommand = motorState.command || [];
      motorState.command = command === 'OPEN' ? up : command === 'CLOSE' ? down : [];
      const newCommand = motorState.command;
      if (arrayEquals(newCommand, originalCommand)) return;

      motorState.canceled = true;
      await cancelCommands();
      motorState.canceled = false;

      if (!newCommand.length) return;

      await writeCommand(newCommand, 50, 100);
      if (motorState.canceled) return;
      cache.motorState = {};
    };
    new Cover(mqtt, deviceData, buildEntityConfig(name), coverCommand).setOnline();
  }
};
