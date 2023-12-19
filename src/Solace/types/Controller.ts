import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { SolaceDevice } from '../options';

export class Controller {
  entities: Dictionary<Entity> = {};
  name: string;

  constructor(
    public deviceData: IDeviceData,
    private bleDevice: IBLEDevice,
    device: SolaceDevice,
    private handle: number
  ) {
    this.name = device.name;
  }

  writeData = async (bytes: Uint8Array) => {
    await this.bleDevice.connect();
    await this.bleDevice.writeCharacteristic(this.handle, bytes);
  };
}
