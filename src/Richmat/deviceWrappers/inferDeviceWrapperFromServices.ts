import { BluetoothGATTService } from '@2colors/esphome-native-api';
import { supportedBeds } from './supportedBeds';
import { WiLinkeDeviceWrapper } from './WiLinkeDeviceWrapper';

export const inferDeviceWrapperFromServices = (services: BluetoothGATTService[]) => {
  for (const { serviceUuid, writeCharacteristicUuid, deviceBuilder } of supportedBeds) {
    const service = services.find((s) => s.uuid === serviceUuid);
    if (!service) continue;
    const writeCharacteristic = service.characteristicsList.find((c) => c.uuid === writeCharacteristicUuid);
    if (!writeCharacteristic) continue;
    return deviceBuilder(writeCharacteristic);
  }
  if (services.length < 3) return null;
  const service = services[2];
  const writeCharacteristic = service.characteristicsList.find(
    (c) => (c.properties & 4) == 4 || (c.properties & 8) == 8
  );
  if (!writeCharacteristic) return null;
  return new WiLinkeDeviceWrapper(writeCharacteristic);
};
