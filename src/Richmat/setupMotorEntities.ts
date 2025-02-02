import { Cover } from '@ha/Cover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey } from '@utils/getString';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { IController } from 'Common/IController';
import { Commands } from './Commands';
import { notEmpty } from '@utils/notEmpty';
import { Features, HasFeature } from './Features';
import { Cancelable } from 'Common/Cancelable';
import { ICache } from 'Common/ICache';

interface MotorState {
  command?: number;
}

interface Cache {
  motorState?: MotorState & Cancelable;
}

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number> & ICache<Cache>,
  hasFeature: HasFeature
) => {
  if (!cache.motorState) cache.motorState = {};

  const buildCommand = (name: StringsKey, feature: Features, up: number, down: number) =>
    hasFeature(feature) ? { name, up, down } : null;

  const commands = [
    buildCommand('MotorPillow', Features.MotorPillow, Commands.MotorPillowUp, Commands.MotorPillowDown),
    buildCommand('MotorHead', Features.MotorHead, Commands.MotorHeadUp, Commands.MotorHeadDown),
    buildCommand('MotorLumbar', Features.MotorLumbar, Commands.MotorLumbarUp, Commands.MotorLumbarDown),
    buildCommand('MotorFeet', Features.MotorFeet, Commands.MotorFeetUp, Commands.MotorFeetDown),
  ].filter(notEmpty);

  for (const { name, up, down } of commands) {
    const coverCommand = async (command: string) => {
      const motorState = cache.motorState!;
      const originalCommand = motorState.command;
      motorState.command = command === 'OPEN' ? up : command === 'CLOSE' ? down : undefined;
      const newCommand = motorState.command;
      const sendCommand = async () => {
        newCommand && (await writeCommand(newCommand, 50, 100));
      };

      if (newCommand === originalCommand) return await sendCommand();

      motorState.canceled = true;
      await cancelCommands();
      motorState.canceled = false;

      if (newCommand) {
        await sendCommand();
        if (motorState.canceled) return;
        cache.motorState = {};
      }
      await writeCommand(Commands.End);
    };
    new Cover(mqtt, deviceData, buildEntityConfig(name), coverCommand).setOnline();
  }
};
