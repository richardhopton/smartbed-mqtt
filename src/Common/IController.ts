import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';

export interface IController<TCommand> {
  entities: Dictionary<Entity>;
  deviceData: IDeviceData;
  writeCommand: (command: TCommand, duration?: number, frequency?: number) => Promise<void>;
}
