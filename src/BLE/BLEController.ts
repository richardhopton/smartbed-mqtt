import { IDeviceData } from '@ha/IDeviceData';
import { Dictionary } from '@utils/Dictionary';
import { Timer } from '@utils/Timer';
import { loopWithWait } from '@utils/loopWithWait';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import EventEmitter from 'events';
import { IController } from '../Common/IController';
import { IEventSource } from '../Common/IEventSource';
import { arrayEquals } from '@utils/arrayEquals';
import { deepArrayEquals } from '@utils/deepArrayEquals';
import { logError } from '@utils/logger';

export class BLEController<TCommand> extends EventEmitter implements IEventSource, IController<TCommand> {
  cache: Dictionary<Object> = {};
  get notifyNames() {
    return Object.keys(this.notifyHandles);
  }
  private timer?: Timer;
  private notifyValues: Dictionary<Uint8Array> = {};
  private disconnectTimeout?: NodeJS.Timeout;
  private lastCommands?: number[][];

  constructor(
    public deviceData: IDeviceData,
    private bleDevice: IBLEDevice,
    private handle: number,
    private commandBuilder: (command: TCommand) => number[],
    private notifyHandles: Dictionary<number> = {},
    private stayConnected: boolean = false
  ) {
    super();
    Object.entries(notifyHandles).forEach(([key, handle]) => {
      this.stayConnected ||= true;
      void this.bleDevice.subscribeToCharacteristic(handle, (data) => {
        const previous = this.notifyValues[key];
        if (previous && arrayEquals(data, previous)) return;
        this.emit(key, data);
      });
    });
  }

  private disconnect = () => this.bleDevice.disconnect();

  private write = async (command: number[]) => {
    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = undefined;
    }
    try {
      await this.bleDevice.writeCharacteristic(this.handle, new Uint8Array(command));
    } catch (e) {
      logError(`[BLE] Failed to write characteristic`, e);
    }
    if (this.stayConnected) return;

    this.disconnectTimeout = setTimeout(this.disconnect, 60_000);
  };

  writeCommand = (command: TCommand, count: number = 1, waitTime?: number) =>
    this.writeCommands([command], count, waitTime);

  writeCommands = async (commands: TCommand[], count: number = 1, waitTime?: number) => {
    const commandList = commands.map(this.commandBuilder).filter((command) => command.length > 0);
    if (commandList.length === 0) return;

    await this.bleDevice.connect();

    const onTick =
      commandList.length === 1 ? () => this.write(commandList[0]) : () => loopWithWait(commandList, this.write);
    if (count === 1 && !waitTime) return await onTick();

    if (this.timer && this.lastCommands) {
      if (deepArrayEquals(commandList, this.lastCommands)) return void this.timer.extendCount(count);
      await this.cancelCommands();
    }

    this.lastCommands = commandList;
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

  on = (eventName: string, handler: (data: Uint8Array) => void): this => {
    this.addListener(eventName, handler);
    return this;
  };
}
