import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

export const isSupported = ({ advertisement: { serviceUuidsList } }: IBLEDevice) =>
  serviceUuidsList.includes('62741523-52f9-8864-b1ab-3b3a8d65950b');
