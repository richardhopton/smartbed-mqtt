import { IBLEDevice } from 'ESPHome/types/IBLEDevice';
import { supportedBeds } from './supportedBeds';

export const isSupported = ({ advertisement: { serviceUuidsList } }: IBLEDevice) =>
  supportedBeds.some(({ serviceUuid }) => serviceUuidsList.includes(serviceUuid));
