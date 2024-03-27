import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { intToBytes } from '@utils/intToBytes';
import { IController } from 'Common/IController';
import EventEmitter from 'events';
import { createConnection } from 'net';
import { ErgoMotionDevice } from './options';

const commandPayload = (command: number) => {
  const commandBytes = [0x4, 0x1, ...intToBytes(command).reverse()];
  const checksum = commandBytes.reduce((acc, curr) => (acc += curr), 0);
  return [0xaa, 0x3, 0x0, 0xa, 0x0, ...commandBytes, ~checksum, 0xf3, 0x55];
};

export class Controller extends EventEmitter implements IController<number> {
  entities: Dictionary<Entity> = {};
  constructor(public deviceData: IDeviceData, public device: ErgoMotionDevice) {
    super();
  }

  writeCommand = (command: number) =>
    new Promise<void>((res, rej) => {
      const socket = createConnection(5000, this.device.ipAddress);
      const onMessage = (data: Buffer) => {
        socket.off('data', onMessage);
        this.emit('data', data);
        socket.destroy();
        res();
      };
      socket.on('data', onMessage);
      socket.write(new Uint8Array(commandPayload(command)), (err) => {
        if (err) rej(err);
      });
    });
}
