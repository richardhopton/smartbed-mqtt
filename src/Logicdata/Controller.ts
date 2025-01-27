import { IDeviceData } from '@ha/IDeviceData';
import { Dictionary } from '@utils/Dictionary';
import { Timer } from '@utils/Timer';
import { loopWithWait } from '@utils/loopWithWait';
import { IController } from 'Common/IController';
import { Socket, createSocket } from 'dgram';
import EventEmitter from 'events';

export class Controller extends EventEmitter implements IController<number[]> {
  cache: Dictionary<Object> = {};
  socket: Socket;
  private timer?: Timer = undefined;

  constructor(public deviceData: IDeviceData, public name: string, public ipAddress: string) {
    super();
    this.socket = createSocket('udp4');
  }

  private writeBytes = (command: number[]) =>
    new Promise<void>((res, rej) => {
      const onMessage = (message: Buffer) => {
        this.socket.off('message', onMessage);
        if (message.toString().startsWith('ACK')) res();
      };
      this.socket.on('message', onMessage);
      this.socket.send(new Uint8Array(command), 50007, this.ipAddress, (err) => {
        if (err) rej(err);
      });
    });

  writeCommand = async (command: number[], count?: number, waitTime?: number) =>
    this.writeCommands([command], count, waitTime);

  writeCommands = async (commands: number[][], count?: number, waitTime?: number) => {
    await this.timer?.cancel();

    this.timer = new Timer(() => loopWithWait(commands, (command) => this.writeBytes(command)), {
      count,
      waitTime,
      onFinish: () => (this.timer = undefined),
    });
    await this.timer.done;
  };

  cancelCommands = async () => {
    await this.timer?.cancel();
  };
}
