import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { IController } from 'Common/IController';
import { Socket, createSocket } from 'dgram';
import EventEmitter from 'events';

export class Controller extends EventEmitter implements IController<number[]> {
  entities: Dictionary<Entity> = {};
  socket: Socket;
  constructor(public deviceData: IDeviceData, public name: string, public ipAddress: string) {
    super();
    this.socket = createSocket('udp4');
  }

  writeData = (bytes: number[]) =>
    new Promise<void>((res, rej) => {
      const onMessage = (message: Buffer) => {
        this.socket.off('message', onMessage);
        if (message.toString().startsWith('ACK')) res();
      };
      this.socket.on('message', onMessage);
      this.socket.send(new Uint8Array(bytes), 50007, this.ipAddress, (err) => {
        if (err) rej(err);
      });
    });
}
