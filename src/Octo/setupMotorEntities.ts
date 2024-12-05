import { Cover } from '@ha/Cover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Command } from './octo';
import { IController } from 'Common/IController';
import { Cancelable } from 'Common/Cancelable';
import { ICache } from 'Common/ICache';

interface MotorState {
  head: boolean;
  legs: boolean;
}
interface Directional {
  direction: string;
}

interface Cache {
  motorState?: MotorState & Directional & Cancelable;
}

const motorPairs: Record<keyof MotorState, keyof MotorState> = {
  head: 'legs',
  legs: 'head',
};

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number[] | Command> & ICache<Cache>
) => {
  if (!cache.motorState) {
    cache.motorState = {
      direction: 'STOP',
      head: false,
      legs: false,
      canceled: false,
    };
  }

  const buildCoverCommand = (main: keyof MotorState) => async (command: string) => {
    const other = motorPairs[main];
    const motorState = cache.motorState!;
    const { direction, canceled, ...motors } = motorState;
    const moveMotors = command !== 'STOP';
    if (direction === command && motors[main] === moveMotors) return;

    motorState[main] = !moveMotors;
    if (motors[other]) {
      if (!moveMotors) command = direction;
      else if (direction != command) motorState[other] = false;
    }
    motorState.direction = command;

    await cancelCommands();

    const { head, legs } = motorState;
    const motor = (head ? 0x2 : 0x0) + (legs ? 0x4 : 0x0);
    if (direction !== 'STOP' && motor !== 0x0) {
      const complexCommand = {
        command: [0x2, direction == 'OPEN' ? 0x70 : 0x71],
        data: [motor],
      };
      await writeCommand(complexCommand, 25, 200);
      if (motorState.canceled) return;
      motorState.direction = 'STOP';
    }
    motorState.head = false;
    motorState.legs = false;
    await writeCommand([0x2, 0x73]);
  };

  if (!cache.headMotor) {
    cache.headMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorHead', { icon: 'mdi:head' }),
      buildCoverCommand('head')
    ).setOnline();
  }

  if (!cache.legsMotor) {
    cache.legsMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorLegs', { icon: 'mdi:foot-print' }),
      buildCoverCommand('legs')
    ).setOnline();
  }
};
