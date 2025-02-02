import { Cover } from '@ha/Cover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { IController } from 'Common/IController';
import { stringToBytes } from './stringToBytes';
import { arrayEquals } from '@utils/arrayEquals';
import { Cancelable } from 'Common/Cancelable';
import { ICache } from 'Common/ICache';

interface MotorState {
  head?: boolean;
  feet?: boolean;
  pillow?: boolean;
  lumbar?: boolean;
}

interface Cache {
  motorState?: MotorState & Cancelable;
}

const move = (motorState: MotorState) => {
  const { head, feet, pillow, lumbar } = motorState;
  let up = '';
  let down = '';
  let stop = '';
  const buildCommand = (direction: boolean | undefined, motor: string) => {
    if (direction === undefined) stop += motor;
    else if (direction) up += motor;
    else down += motor;
  };
  buildCommand(head, '0');
  buildCommand(feet, '1');
  buildCommand(pillow, '2');
  buildCommand(lumbar, '3');
  return stringToBytes(`M ${up}:${down}:${stop}`);
};

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number[]> & ICache<Cache>
) => {
  if (!cache.motorState) cache.motorState = {};

  const buildCoverCommand = (motor: keyof MotorState) => async (command: string) => {
    const motorState = cache.motorState!;
    const originalCommand = move(motorState);
    motorState[motor] = command === 'OPEN' ? true : command === 'CLOSE' ? false : undefined;
    const newCommand = move(motorState);
    const sendCommand = () => writeCommand(newCommand, 25, 200);

    if (arrayEquals(newCommand, originalCommand)) return await sendCommand();

    motorState.canceled = true;
    await cancelCommands();
    motorState.canceled = false;

    const stopCommand = move({});
    if (!arrayEquals(newCommand, stopCommand)) {
      await sendCommand();
      if (motorState.canceled) return;
      cache.motorState = {};
    }
    await writeCommand(stopCommand);
  };

  if (!cache.headMotor) {
    cache.headMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorHead', { icon: 'mdi:head' }),
      buildCoverCommand('head')
    ).setOnline();
  }

  if (!cache.feetMotor) {
    cache.feetMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorFeet', { icon: 'mdi:foot-print' }),
      buildCoverCommand('feet')
    ).setOnline();
  }

  if (!cache.pillowMotor) {
    cache.pillowMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorPillow', { icon: 'mdi:pillow' }),
      buildCoverCommand('pillow')
    ).setOnline();
  }

  if (!cache.lumbarMotor) {
    cache.lumbarMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorLumbar', { icon: 'mdi:lumbar' }),
      buildCoverCommand('lumbar')
    ).setOnline();
  }
};
