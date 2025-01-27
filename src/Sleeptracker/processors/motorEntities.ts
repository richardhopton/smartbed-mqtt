import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey } from '@utils/getString';
import { Cover } from '@ha/Cover';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Bed } from 'Sleeptracker/types/Bed';
import { Controller } from 'Sleeptracker/types/Controller';
import { sendAdjustableBaseCommand } from 'Sleeptracker/requests/sendAdjustableBaseCommand';
import { Commands } from 'Sleeptracker/types/Commands';
import { notEmpty } from '@utils/notEmpty';

interface MotorState {
  command?: Commands;
}

interface Cache {
  motorState?: MotorState;
}

type Command = { name: StringsKey; up: Commands; down: Commands; stop: Commands };

const buildCommand = (motorEnabled: boolean, name: StringsKey, up: Commands, down: Commands, stop: Commands) =>
  motorEnabled ? ({ name, up, down, stop } as Command) : undefined;

export const setupMotorEntities = async (
  mqtt: IMQTTConnection,
  { deviceData }: Bed,
  {
    user,
    entities,
    capability: {
      motorRoster: { head, foot, headTilt: tilt, lumber: lumbar },
    },
  }: Controller
) => {
  const cache = entities as Cache;

  if (cache.motorState) return;

  cache.motorState = {};
  const commands = [
    buildCommand(head, 'MotorHead', Commands.MotorHeadUp, Commands.MotorHeadDown, Commands.MotorHeadStop),
    buildCommand(foot, 'MotorFeet', Commands.MotorFeetUp, Commands.MotorFeetDown, Commands.MotorFeetStop),
    buildCommand(tilt, 'MotorTilt', Commands.MotorTiltUp, Commands.MotorTiltDown, Commands.MotorTiltStop),
    buildCommand(lumbar, 'MotorLumbar', Commands.MotorLumbarUp, Commands.MotorLumbarDown, Commands.MotorLumbarStop),
  ].filter(notEmpty);

  for (const { name, up, down, stop } of commands) {
    const coverCommand = async (command: string) => {
      const motorState = cache.motorState!;
      const originalCommand = motorState.command || [];
      motorState.command = command === 'OPEN' ? up : command === 'CLOSE' ? down : stop;
      const newCommand = motorState.command;
      if (newCommand === originalCommand) return;
      await sendAdjustableBaseCommand(newCommand, user);
      cache.motorState = {};
    };
    new Cover(mqtt, deviceData, buildEntityConfig(name), coverCommand).setOnline();
  }
};
