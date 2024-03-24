import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { IController } from 'Common/IController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import EventEmitter from 'events';

export class Controller extends EventEmitter implements IController<number[]> {
  entities: Dictionary<Entity> = {};

  constructor(
    public deviceData: IDeviceData,
    private bleDevice: IBLEDevice,
    public name: string,
    private handle: number
  ) {
    super();
    this.bleDevice.subscribeToCharacteristic(handle, (bytes) => {
      if (bytes.length === 9) this.emit('notify', Array.from(bytes));
    });
  }

  writeCommand = async (bytes: number[]) => {
    if (bytes.length === 0) return;
    const checksum = bytes.reduce((acc, cur) => acc ^ cur, 0);
    await this.bleDevice.connect();
    await this.bleDevice.writeCharacteristic(this.handle, new Uint8Array([...bytes, checksum]));
  };
}
