import { Cover } from '@ha/Cover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { BLEController } from 'BLE/BLEController';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { arrayEquals } from '@utils/arrayEquals';
import { Cancelable } from 'Common/Cancelable';
import { ICache } from 'Common/ICache';

interface MotorState {
  head?: boolean;
  back?: boolean;
  legs?: boolean;
  feet?: boolean;
}

interface Cache {
  motorState?: MotorState & Cancelable;
}

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: BLEController<number[]> & ICache<Cache>,
  motorCount: number
) => {
  if (!cache.motorState) cache.motorState = {};

  const buildCoverCommand = (motor: keyof MotorState | 'all') => async (command: string) => {
    const motorState = cache.motorState!;
    const originalCommand = Commands.Move(motorState);
    const commandBool = command === 'OPEN' ? true : command === 'CLOSE' ? false : undefined;
    if (motor === 'all') motorState.head = motorState.back = motorState.legs = motorState.feet = commandBool;
    else motorState[motor] = commandBool;
    const newCommand = Commands.Move(motorState);
    const sendCommand = () => writeCommand(newCommand, 25, 200);

    if (arrayEquals(newCommand, originalCommand)) return await sendCommand();

    motorState.canceled = true;
    await cancelCommands();
    motorState.canceled = false;

    const stopCommand = Commands.Move({});
    if (!arrayEquals(newCommand, stopCommand)) {
      await sendCommand();
      if (motorState.canceled) return;
      cache.motorState = {};
    }
    await writeCommand(stopCommand);
  };

  if (!cache.backMotor) {
    cache.backMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorBack', { icon: 'mdi:back' }),
      buildCoverCommand('back')
    ).setOnline();
  }

  if (!cache.legsMotor) {
    cache.legsMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorLegs', { icon: 'mdi:legs' }),
      buildCoverCommand('legs')
    ).setOnline();
  }

  if (!cache.headMotor && motorCount > 2) {
    cache.headMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorHead', { icon: 'mdi:head' }),
      buildCoverCommand('head')
    ).setOnline();
  }

  if (!cache.feetMotor && motorCount > 3) {
    cache.feetMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('MotorFeet', { icon: 'mdi:foot-print' }),
      buildCoverCommand('feet')
    ).setOnline();
  }

  if (!cache.allMotors) {
    cache.allMotors = new Cover(mqtt, deviceData, buildEntityConfig('MotorAll'), buildCoverCommand('all')).setOnline();
  }
};
