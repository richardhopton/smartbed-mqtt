import { IDeviceData } from '@ha/IDeviceData';
import { Dictionary } from '@utils/Dictionary';
import { Timer } from '@utils/Timer';
import { loopWithWait } from '@utils/loopWithWait';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import EventEmitter from 'events';
import { IController } from '../Common/IController';
import { IEventSource } from '../Common/IEventSource';
import { arrayEquals } from '@utils/arrayEquals';

export class BLEController<TCommand> extends EventEmitter implements IEventSource, IController<TCommand> {
  cache: Dictionary<Object> = {};
  get notifyNames() {
    return Object.keys(this.notifyHandles);
  }
  private timer?: Timer = undefined;
  private notifyValues: Dictionary<Uint8Array> = {};

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

  writeCommand = (command: TCommand, count?: number, waitTime?: number) =>
    this.writeCommands([command], count, waitTime);

  writeCommands = async (commands: TCommand[], count?: number, waitTime?: number) => {
    const commandList = commands.map(this.commandBuilder).filter((command) => command.length > 0);
    if (commandList.length === 0) return;
    await this.timer?.cancel();
    await this.bleDevice.connect();
    const onFinish = async () => {
      if (!this.stayConnected) await this.bleDevice.disconnect();
      this.timer = undefined;
    };
    this.timer = new Timer(
      () =>
        loopWithWait(commandList, (command) =>
          this.bleDevice.writeCharacteristic(this.handle, new Uint8Array(command))
        ),
      {
        count,
        waitTime,
        onFinish,
      }
    );
    await this.timer.done;
  };

  cancelCommands = async () => {
    await this.timer?.cancel();
  };

  on = (eventName: string, handler: (data: Uint8Array) => void): this => {
    this.addListener(eventName, handler);
    return this;
  };
}
