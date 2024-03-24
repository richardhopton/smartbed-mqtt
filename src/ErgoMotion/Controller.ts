import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { intToBytes } from '@utils/intToBytes';
import { IController } from 'Common/IController';
import EventEmitter from 'events';
import { Socket, createConnection } from 'net';
import { ErgoMotionDevice } from './options';

const commandPayload = (command: number) => {
  const commandBytes = [0x4, 0x1, ...intToBytes(command).reverse()];
  const checksum = commandBytes.reduce((acc, curr) => (acc += curr), 0);
  return [0xaa, 0x3, 0x0, 0xa, 0x0, ...commandBytes, ~checksum, 0xf3, 0x55];
};

export class Controller extends EventEmitter implements IController<number> {
  entities: Dictionary<Entity> = {};
  socket: Socket;
  constructor(public deviceData: IDeviceData, public device: ErgoMotionDevice) {
    super();
    this.socket = createConnection(5000, device.ipAddress);
    this.socket.on('data', (data) => this.emit('data', data));
  }

  writeCommand = (command: number) =>
    new Promise<void>((res, rej) => {
      this.socket.write(new Uint8Array(commandPayload(command)), (err) => {
        if (err) rej(err);
        else res();
      });
    });
}
