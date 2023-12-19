import { BLEAdvertisementListener } from './types/BLEAdvertisementListener';
import { IBLEDevice } from './types/IBLEDevice';

export interface IESPConnection {
  reconnect(): Promise<void>;

  subscribeToBLEAdvertisements(listener: BLEAdvertisementListener): void;
  unsubscribeFromBLEAdvertisements(): void;

  getBLEDevices(deviceNames: string[], nameMapper?: (name: string) => string): Promise<IBLEDevice[]>;
}
