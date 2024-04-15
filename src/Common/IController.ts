import { IDeviceData } from '@ha/IDeviceData';
import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';

export interface IDeviceEntityCache {
  entities: Dictionary<Entity>;
  deviceData: IDeviceData;
}

export interface IController<TCommand> extends IDeviceEntityCache {
  writeCommand: (command: TCommand, duration?: number, frequency?: number) => Promise<void>;
  writeCommands: (commands: TCommand[], duration?: number, frequency?: number) => Promise<void>;
}
