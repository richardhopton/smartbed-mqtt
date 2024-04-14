import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { Timer } from '@utils/Timer';
import { loopWithWait } from '@utils/loopWithWait';
import { IController } from 'Common/IController';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { IDeviceWrapper } from '../deviceWrappers/IDeviceWrapper';
import { RichmatDevice } from '../options';
import { Commands } from './Commands';
import { Features } from './Features';
import { remoteFeatures } from './remoteFeatures';

export class Controller implements IController<number> {
  entities: Dictionary<Entity> = {};
  features: number;
  name: string;
  private timer?: Timer = undefined;

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

  writeCommand = (command: number, duration?: number, frequency?: number) =>
    this.writeCommands([command, Commands.End], duration, frequency);

  writeCommands = async (commands: number[], duration?: number, frequency?: number) => {
    await this.timer?.cancel();

    const { writeHandle, getBytes } = this.wrapper;
    await this.bleDevice.connect();
    this.timer = new Timer(
      async () =>
        await loopWithWait(commands, (command) => this.bleDevice.writeCharacteristic(writeHandle, getBytes(command))),
      duration,
      frequency,
      async () => {
        if (this.device.stayConnected) await this.bleDevice.disconnect();
        this.timer = undefined;
      }
    );
  };
}
