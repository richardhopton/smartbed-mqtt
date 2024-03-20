import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { IController } from 'Common/IController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { LeggettPlattDevice } from 'LeggettPlatt/options';
import EventEmitter from 'events';

export class Controller extends EventEmitter implements IController<number[]> {
  entities: Dictionary<Entity> = {};

  constructor(
    public deviceData: IDeviceData,
    public bleDevice: IBLEDevice,
    public device: LeggettPlattDevice,
    private controlHandle: number,
    public outputHandles: Dictionary<number> = {}
  ) {
    super();
    Object.entries(outputHandles).map(([key, handle]) => {
      this.bleDevice.subscribeToCharacteristic(handle, (data) => {
        this.emit(key, data);
      });
    });
  }

  writeData = async (bytes: number[]) => {
    await this.bleDevice.connect();
    await this.bleDevice.writeCharacteristic(this.controlHandle, new Uint8Array(bytes));
  };
}
