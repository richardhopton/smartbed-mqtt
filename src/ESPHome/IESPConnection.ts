import { IBLEDevice } from './types/IBLEDevice';

export interface IESPConnection {
  disconnect(): void;
  reconnect(): Promise<void>;
  getBLEDevices(deviceNames: string[], nameMapper?: (name: string) => string): Promise<IBLEDevice[]>;
  discoverBLEDevices(
    onNewDeviceFound: (bleDevice: IBLEDevice) => void,
    complete: Promise<void>,
    nameMapper?: (name: string) => string
  ): Promise<void>;
}
