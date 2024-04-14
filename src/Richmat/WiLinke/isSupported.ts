import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { supportedBeds } from './supportedBeds';

export const isSupported = (device: IBLEDevice) =>
  supportedBeds.some(({ serviceUuid }) => device.serviceUuidsList.includes(serviceUuid));
