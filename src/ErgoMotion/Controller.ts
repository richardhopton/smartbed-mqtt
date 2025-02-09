import { IDeviceData } from '@ha/IDeviceData';
import { Dictionary } from '@utils/Dictionary';
import { Timer } from '@utils/Timer';
import { intToBytes } from '@utils/intToBytes';
import { loopWithWait } from '@utils/loopWithWait';
import { IController } from 'Common/IController';
import EventEmitter from 'events';
import { createConnection } from 'net';
import { ErgoMotionDevice } from './options';
import { arrayEquals } from '@utils/arrayEquals';
import { sum } from '@utils/sum';

const commandPayload = (command: number) => {
  const commandBytes = [0x4, 0x1, ...intToBytes(command).reverse()];
  const checksum = commandBytes.reduce(sum);
  return [0xaa, 0x3, 0x0, 0xa, 0x0, ...commandBytes, ~checksum, 0xf3, 0x55];
};

export class Controller extends EventEmitter implements IController<number> {
  cache: Dictionary<Object> = {};
  private timer?: Timer;
  private lastCommands?: number[];

  constructor(public deviceData: IDeviceData, public device: ErgoMotionDevice) {
    super();
  }

  private write = (command: number) =>
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

  writeCommand = async (command: number, count: number = 1, waitTime?: number) =>
    this.writeCommands([command], count, waitTime);

  writeCommands = async (commands: number[], count: number = 1, waitTime?: number) => {
    const onTick = commands.length === 1 ? () => this.write(commands[0]) : () => loopWithWait(commands, this.write);
    if (count === 1 && !waitTime) return onTick();

    if (this.timer && this.lastCommands) {
      if (arrayEquals(commands, this.lastCommands)) return void this.timer.extendCount(count);
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
