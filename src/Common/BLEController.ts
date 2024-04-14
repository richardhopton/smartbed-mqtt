import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { Timer } from '@utils/Timer';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import EventEmitter from 'events';
import { IController } from './IController';
import { IEventSource } from './IEventSource';

export class BLEController<TCommand> extends EventEmitter implements IEventSource, IController<TCommand> {
  entities: Dictionary<Entity> = {};
  get notifyNames() {
    return Object.keys(this.notifyHandles);
  }
  private timer?: Timer = undefined;

  constructor(
    public deviceData: IDeviceData,
    private bleDevice: IBLEDevice,
    private handle: number,
    private commandBuilder: (command: TCommand) => number[],
    private notifyHandles: Dictionary<number> = {},
    private stayConnected?: boolean
  ) {
    super();
    this.stayConnected ||= notifyHandles.length > 0;
    Object.entries(notifyHandles).map(([key, handle]) => {
      this.bleDevice.subscribeToCharacteristic(handle, (data) => {
        this.emit(key, data);
      });
    });
  }

  writeCommand = async (command: TCommand, duration?: number, frequency?: number) => {
    await this.timer?.cancel();

    await this.bleDevice.connect();
    this.timer = new Timer(
      async () => await this.write(command),
      duration,
      frequency,
      async () => {
        if (this.stayConnected) await this.bleDevice.disconnect();
        this.timer = undefined;
      }
    );
    await this.timer.done;
  };

  private write = (command: TCommand) =>
    this.bleDevice.writeCharacteristic(this.handle, new Uint8Array(this.commandBuilder(command)));
}
