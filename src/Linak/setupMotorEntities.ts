import { Cover } from '@ha/Cover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { BLEController } from 'BLE/BLEController';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';

interface MotorState {
  head?: boolean;
  back?: boolean;
  legs?: boolean;
  feet?: boolean;
  canceled?: boolean;
}

const arrayEquals = (arr1: number[], arr2: number[]) =>
  arr1.length === arr2.length && arr1.every((v, i) => v === arr2[i]);

export const setupMotorEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: BLEController<number[]>,
  motorCount: number
) => {
  if (!cache.motorState) cache.motorState = {};

  const sendMotorControlCommand = async (command: number[]) => {
    const motorState = cache.motorState as MotorState;
    motorState.canceled = true;
    await cancelCommands();
    motorState.canceled = false;

    await writeCommand(command, 5_000, 200);
    if (motorState.canceled) return;
    cache.motorState = {};
    await writeCommand(Commands.Move({}));
  };

  const commandToBool = (command: string) => {
    switch (command) {
      case 'OPEN':
        return true;
      case 'CLOSE':
        return false;
      default:
        return undefined;
    }
  };

  if (!cache.backMotor) {
    cache.backMotor = new Cover(mqtt, deviceData, buildEntityConfig('Head', { icon: 'mdi:back' }), async (command) => {
      const motorState = cache.motorState as MotorState;
      const originalCommand = Commands.Move(motorState);
      motorState.back = commandToBool(command);
      const newCommand = Commands.Move(motorState);
      if (!arrayEquals(originalCommand, newCommand)) await sendMotorControlCommand(newCommand);
    }).setOnline();
  }

  if (!cache.legsMotor) {
    cache.legsMotor = new Cover(mqtt, deviceData, buildEntityConfig('Head', { icon: 'mdi:legs' }), async (command) => {
      const motorState = cache.motorState as MotorState;
      const originalCommand = Commands.Move(motorState);
      motorState.legs = commandToBool(command);
      const newCommand = Commands.Move(motorState);
      if (!arrayEquals(originalCommand, newCommand)) await sendMotorControlCommand(newCommand);
    }).setOnline();
  }

  if (!cache.headMotor && motorCount > 2) {
    cache.headMotor = new Cover(mqtt, deviceData, buildEntityConfig('Head', { icon: 'mdi:head' }), async (command) => {
      const motorState = cache.motorState as MotorState;
      const originalCommand = Commands.Move(motorState);
      motorState.head = commandToBool(command);
      const newCommand = Commands.Move(motorState);
      if (!arrayEquals(originalCommand, newCommand)) await sendMotorControlCommand(newCommand);
    }).setOnline();
  }

  if (!cache.feetMotor && motorCount > 3) {
    cache.feetMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('Head', { icon: 'mdi:foot-print' }),
      async (command) => {
        const motorState = cache.motorState as MotorState;
        const originalCommand = Commands.Move(motorState);
        motorState.feet = commandToBool(command);
        const newCommand = Commands.Move(motorState);
        if (!arrayEquals(originalCommand, newCommand)) await sendMotorControlCommand(newCommand);
      }
    ).setOnline();
  }
};
