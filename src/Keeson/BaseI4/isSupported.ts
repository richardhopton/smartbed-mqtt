import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

export const isSupported = (device: IBLEDevice) => device.name.startsWith('base-i4.');
