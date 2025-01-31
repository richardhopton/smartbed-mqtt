import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

export const isSupported = (device: IBLEDevice) =>
  device.name.startsWith('base-i5') && device.serviceUuidsList.includes('01000001-0000-1000-8000-00805f9b34fb');
