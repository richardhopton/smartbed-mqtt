import { Cover } from '@ha/Cover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { arrayEquals } from '@utils/arrayEquals';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { ICache } from 'Common/ICache';
import { IController } from 'Common/IController';
import { ComplexCommand } from './CommandBuilder';
import { Cancelable } from 'Common/Cancelable';

interface MotorState {
  command?: number[];
}

export interface Cache {
  motorState?: MotorState & Cancelable;
}

export const setupCoverEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand, cancelCommands }: IController<number[]> & ICache<Cache>,
  complexCommands: ComplexCommand[]
) => {
  if (!cache.motorState) cache.motorState = {};

  for (const {
    name,
    commands: { up, down },
  } of complexCommands) {
    const coverCommand = async (command: string) => {
      const motorState = cache.motorState!;
      const originalCommand = motorState.command || [];
      motorState.command = command === 'OPEN' ? up : command === 'CLOSE' ? down : [];
      const newCommand = motorState.command;
      const sendCommand = async () => {
        newCommand.length && (await writeCommand(newCommand, 50, 100));
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
      await writeCommand([0x24, 0x62], 5, 100);
    };
    new Cover(mqtt, deviceData, buildEntityConfig(name), coverCommand).setOnline();
  }
};
