import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { Remote } from './Remote';
import { StringsKey } from '@utils/getString';
import { Cover } from '@ha/Cover';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Cancelable } from 'Common/Cancelable';
import { ICache } from 'Common/ICache';

interface MotorState {
  head?: number;
  back?: number;
  legs?: number;
  feet?: number;
}

type Motor = keyof MotorState;

interface Cache {
  motorState?: MotorState & Cancelable;
}

type Command = { name: StringsKey; motor: Motor; up: number; down: number };

const buildCommand = (name: StringsKey, motor: Motor, up: number, down: number): Command => {
  return { name, motor, up, down };
};

const move = (motorState: MotorState) => {
  let command = 0;
  const { head, back, legs, feet } = motorState;
  if (head !== undefined) command += head;
  if (back !== undefined) command += back;
  if (legs !== undefined) command += legs;
  if (feet !== undefined) command += feet;
  return command;
};

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number> & ICache<Cache>,
  remote: Remote
) => {
  if (!cache.motorState) cache.motorState = {};

  const commands: Command[] = [];

  const { HeadUp, HeadDown } = remote.commands;
  if (typeof HeadUp === 'number' && typeof HeadDown === 'number')
    commands.push(buildCommand('MotorHead', 'head', HeadUp, HeadDown));

  const { BackUp, BackDown } = remote.commands;
  if (typeof BackUp === 'number' && typeof BackDown === 'number')
    commands.push(buildCommand('MotorBack', 'back', BackUp, BackDown));

  const { LegsUp, LegsDown } = remote.commands;
  if (typeof LegsUp === 'number' && typeof LegsDown === 'number')
    commands.push(buildCommand('MotorLegs', 'legs', LegsUp, LegsDown));

  const { FeetUp, FeetDown } = remote.commands;
  if (typeof FeetUp === 'number' && typeof FeetDown === 'number')
    commands.push(buildCommand('MotorFeet', 'feet', FeetUp, FeetDown));

  for (const { name, motor, up, down } of commands) {
    const coverCommand = async (command: string) => {
      const motorState = cache.motorState!;
      const originalCommand = move(motorState);
      motorState[motor] = command === 'OPEN' ? up : command === 'CLOSE' ? down : undefined;
      const newCommand = move(motorState);
      const sendCommand = async () => {
        newCommand && (await writeCommand(newCommand, 50, 100));
      };

      if (newCommand === originalCommand) return await sendCommand();

      motorState.canceled = true;
      await cancelCommands();
      motorState.canceled = false;

      if (!newCommand) return;

      await sendCommand();
      if (motorState.canceled) return;
      cache.motorState = {};
    };
    new Cover(mqtt, deviceData, buildEntityConfig(name), coverCommand).setOnline();
  }
};
