import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

export const isSupported = ({ advertisement: { serviceUuidsList } }: IBLEDevice) =>
  serviceUuidsList.includes('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
