import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { wait } from '@utils/wait';
import { IController } from 'Common/IController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { IDeviceWrapper } from '../deviceWrappers/IDeviceWrapper';
import { RichmatDevice } from '../options';
import { Features } from './Features';
import { remoteFeatures } from './remoteFeatures';

export class Controller implements IController<number> {
  entities: Dictionary<Entity> = {};
  features: number;
  name: string;

  constructor(
    public deviceData: IDeviceData,
    private bleDevice: IBLEDevice,
    private device: RichmatDevice,
    private wrapper: IDeviceWrapper
  ) {
    this.features = remoteFeatures[device.remoteCode];
    this.name = device.name;
  }

  hasFeature = (feature: Features) => {
    return (this.features & feature) === feature;
  };

  writeData = async (byte: number) => {
    await this.bleDevice.connect();
    const { writeHandle, getBytes } = this.wrapper;
    await this.bleDevice.writeCharacteristic(writeHandle, getBytes(byte));
    await wait(50);
    await this.bleDevice.writeCharacteristic(writeHandle, getBytes(0x6e));
    if (!this.device.stayConnected) await this.bleDevice.disconnect();
  };
}
