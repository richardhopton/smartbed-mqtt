import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

export const isSupported = ({ name, advertisement: { serviceUuidsList } }: IBLEDevice) =>
  name.startsWith('base-i5.') || serviceUuidsList.includes('01000001-0000-1000-8000-00805f9b34fb');
