import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

export class Controller {
  entities: Dictionary<Entity> = {};

  constructor(
    public deviceData: IDeviceData,
    public bleDevice: IBLEDevice,
    public name: string,
    private controlHandle: number,
    public outputHandles: Dictionary<number>,
    private stayConnected?: boolean
  ) {}

  writeData = async (bytes: number[]) => {
    await this.bleDevice.connect();
    await this.bleDevice.writeCharacteristic(this.controlHandle, new Uint8Array(bytes));
    if (!this.stayConnected) await this.bleDevice.disconnect();
  };
}
