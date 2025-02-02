import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { StringsKey } from '@utils/getString';
import { Cover } from '@ha/Cover';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { arrayEquals } from '@utils/arrayEquals';
import { Cancelable } from 'Common/Cancelable';
import { ICache } from 'Common/ICache';

interface MotorState {
  command?: number[];
}

interface Cache {
  motorState?: MotorState & Cancelable;
}

type Command = { name: StringsKey; up: number[]; down: number[] };

const buildCommand = (name: StringsKey, up: number[], down: number[]): Command => {
  return { name, up, down };
};

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number[]> & ICache<Cache>
) => {
  if (!cache.motorState) cache.motorState = {};

  const commands = [
    buildCommand('MotorBack', Commands.MotorHeadUp, Commands.MotorHeadDown),
    buildCommand('MotorLegs', Commands.MotorLegsUp, Commands.MotorLegsDown),
  ];

  for (const { name, up, down } of commands) {
    const coverCommand = async (command: string) => {
      const motorState = cache.motorState!;
      const originalCommand = motorState.command || [];
      motorState.command = command === 'OPEN' ? up : command === 'CLOSE' ? down : [];
      const newCommand = motorState.command;
      const sendCommand = async () => {
        newCommand.length && (await writeCommand(newCommand, 50, 100));
      };

      if (arrayEquals(newCommand, originalCommand)) return await sendCommand();

      motorState.canceled = true;
      await cancelCommands();
      motorState.canceled = false;

      if (!newCommand.length) return;

      await sendCommand();
      if (motorState.canceled) return;
      cache.motorState = {};
    };
    new Cover(mqtt, deviceData, buildEntityConfig(name), coverCommand).setOnline();
  }
};
