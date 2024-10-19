import { Cover } from '@ha/Cover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { BLEController } from 'BLE/BLEController';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Command } from './octo';

interface MotorEntities {
  headMotor?: Cover;
  legsMotor?: Cover;
}

export const setupMotorEntities = (mqtt: IMQTTConnection, controller: BLEController<number[] | Command>) => {
  const { entities, deviceData, writeCommand, cancelCommands } = controller;
  const cache = entities as MotorEntities;

  const motorState = {
    direction: 'STOP',
    head: false,
    legs: false,
  };

  let canceled = false;
  const sendMotorControlCommand = async () => {
    canceled = true;
    await cancelCommands();
    canceled = false;

    const { head, legs, direction } = motorState;
    const motor = (head ? 0x2 : 0x0) + (legs ? 0x4 : 0x0);
    if (direction === 'STOP' || motor === 0x0) {
      await writeCommand([0x2, 0x73]);
    } else {
      const complexCommand = {
        command: [0x2, direction == 'OPEN' ? 0x70 : 0x71],
        data: [motor],
      };
      await writeCommand(complexCommand, 5_000, 200);
      if (!canceled) {
        motorState.direction = 'STOP';
        motorState.head = false;
        motorState.legs = false;
        await writeCommand([0x2, 0x73]);
      }
    }
  };

  if (!cache.headMotor) {
    cache.headMotor = new Cover(mqtt, deviceData, buildEntityConfig('Head', { icon: 'mdi:head' }), async (command) => {
      const { head, legs, direction } = motorState;
      const moveMotors = command !== 'STOP';
      if (direction === command && head === moveMotors) return;

      if (!moveMotors) {
        motorState.head = false;
        if (legs) command = direction;
      } else {
        motorState.head = true;
        if (legs && direction != command) motorState.legs = false;
      }
      motorState.direction = command;

      await sendMotorControlCommand();
    });
  }
  cache.headMotor.setOnline();

  if (!cache.legsMotor) {
    cache.legsMotor = new Cover(
      mqtt,
      deviceData,
      buildEntityConfig('Legs', { icon: 'mdi:foot-print' }),
      async (command) => {
        const { head, legs, direction } = motorState;
        const moveMotors = command !== 'STOP';
        if (direction === command && legs === moveMotors) return;

        if (!moveMotors) {
          motorState.legs = false;
          if (head) command = direction;
        } else {
          motorState.legs = true;
          if (head && direction != command) motorState.head = false;
        }
        motorState.direction = command;

        await sendMotorControlCommand();
      }
    );
  }
  cache.legsMotor.setOnline();
};
