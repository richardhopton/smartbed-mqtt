import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { arrayEquals } from '@utils/arrayEquals';
import { Cancelable } from 'Common/Cancelable';
import { PositionalCover } from '@ha/PositionalCover';
import { IController } from 'Common/IController';
import { ICache } from '../../Common/ICache';

interface MotorState {
  head?: number;
  feet?: number;
}

interface Cache {
  motorState?: MotorState & Cancelable;
}

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number[]> & ICache<Cache>
) => {
  if (!cache.motorState) cache.motorState = {};

  const buildCoverCommand = (motor: keyof MotorState) => async (position: number) => {
    const motorState = cache.motorState!;
    const originalCommand = Commands.MotorMove(motor, motorState[motor] || NaN);
    motorState[motor] = position;
    const newCommand = Commands.MotorMove(motor, position);
    if (arrayEquals(newCommand, originalCommand)) return;

    motorState.canceled = true;
    await cancelCommands();
    motorState.canceled = false;

    if (!newCommand.length) return;

    await writeCommand(newCommand, 2, 50);
    if (motorState.canceled) return;
    cache.motorState = {};
  };

  if (!cache.headMotor) {
    cache.headMotor = new PositionalCover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorHead', { icon: 'mdi:head' }),
      buildCoverCommand('head'),
      { onStop: () => writeCommand(Commands.MotorStop) }
    ).setOnline();
  }

  if (!cache.feetMotor) {
    cache.feetMotor = new PositionalCover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorFeet', { icon: 'mdi:foot-print' }),
      buildCoverCommand('feet'),
      { onStop: () => writeCommand(Commands.MotorStop) }
    ).setOnline();
  }
};
