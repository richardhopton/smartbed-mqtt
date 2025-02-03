import { IDeviceData } from '@ha/IDeviceData';
import { Dictionary } from '@utils/Dictionary';
import { Timer } from '@utils/Timer';
import { deepArrayEquals } from '@utils/deepArrayEquals';
import { loopWithWait } from '@utils/loopWithWait';
import { IController } from 'Common/IController';
import { Socket, createSocket } from 'dgram';
import EventEmitter from 'events';

export class Controller extends EventEmitter implements IController<number[]> {
  cache: Dictionary<Object> = {};
  socket: Socket;
  private timer?: Timer;
  private lastCommands?: number[][];
  constructor(public deviceData: IDeviceData, public name: string, public ipAddress: string) {
    super();
    this.socket = createSocket('udp4');
  }

  private write = (command: number[]) =>
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

  writeCommand = async (command: number[], count: number = 1, waitTime?: number) =>
    this.writeCommands([command], count, waitTime);

  writeCommands = async (commands: number[][], count: number = 1, waitTime?: number) => {
    const onTick = commands.length === 1 ? () => this.write(commands[0]) : () => loopWithWait(commands, this.write);
    if (count === 1 && !waitTime) return onTick();

    if (this.timer && this.lastCommands) {
      if (deepArrayEquals(commands, this.lastCommands)) return void this.timer.extendCount(count);
      await this.cancelCommands();
    }

    this.lastCommands = commands;
    const onFinish = () => {
      this.timer = undefined;
      this.lastCommands = undefined;
    };
    this.timer = new Timer(onTick, count, waitTime, onFinish);
    await this.timer.start();
  };

  cancelCommands = async () => {
    await this.timer?.cancel();
  };
}
