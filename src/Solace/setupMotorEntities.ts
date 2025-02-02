import { Cover } from '@ha/Cover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { arrayEquals } from '@utils/arrayEquals';
import { StringsKey } from '@utils/getString';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { IController } from 'Common/IController';
import { Commands } from './Commands';
import { Cancelable } from 'Common/Cancelable';
import { ICache } from 'Common/ICache';

interface MotorState {
  command?: number[];
}

interface Cache {
  motorState?: MotorState & Cancelable;
}

const buildCommand = (name: StringsKey, up: number[], down: number[]) => ({ name, up, down });

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number[]> & ICache<Cache>
) => {
  if (!cache.motorState) cache.motorState = {};

  const commands = [
    buildCommand('MotorBack', Commands.MotorBackUp, Commands.MotorBackDown),
    buildCommand('MotorLegs', Commands.MotorLegsUp, Commands.MotorLegsDown),
    buildCommand('MotorLift', Commands.MotorLiftUp, Commands.MotorLiftDown),
    buildCommand('MotorTilt', Commands.MotorTiltUp, Commands.MotorTiltDown),
  ];

  for (const { name, up, down } of commands) {
    const coverCommand = async (command: string) => {
      const motorState = cache.motorState!;
      const originalCommand = motorState.command || [];
      motorState.command = command === 'OPEN' ? up : command === 'CLOSE' ? down : [];
      const newCommand = motorState.command;
      const sendCommand = async () => {
        newCommand.length && (await writeCommand(newCommand, 1, 5_000));
      };

      if (arrayEquals(originalCommand, newCommand)) return await sendCommand();

      motorState.canceled = true;
      await cancelCommands();
      motorState.canceled = false;

      if (newCommand.length) {
        await sendCommand();
        if (motorState.canceled) return;
        cache.motorState = {};
      }
      await writeCommand(Commands.MotorStop);
    };
    new Cover(mqtt, deviceData, buildEntityConfig(name), coverCommand).setOnline();
  }
};
