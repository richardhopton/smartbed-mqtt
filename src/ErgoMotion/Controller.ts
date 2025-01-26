import { IDeviceData } from '@ha/IDeviceData';
import { Dictionary } from '@utils/Dictionary';
import { Timer } from '@utils/Timer';
import { intToBytes } from '@utils/intToBytes';
import { loopWithWait } from '@utils/loopWithWait';
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
  cache: Dictionary<Object> = {};
  private timer?: Timer = undefined;

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

  writeCommand = async (command: number, count?: number, waitTime?: number) =>
    this.writeCommands([command], count, waitTime);

  writeCommands = async (commands: number[], count?: number, waitTime?: number) => {
    await this.timer?.cancel();

    this.timer = new Timer(() => loopWithWait(commands, (command) => this.write(command)), {
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
