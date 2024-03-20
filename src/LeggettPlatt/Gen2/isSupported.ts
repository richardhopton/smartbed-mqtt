import { logWarn } from '@utils/logger';
import { IBLEDevice } from 'ESPHome/types/IBLEDevice';

const getProductId = (bleDevice: IBLEDevice) => {
  if ((bleDevice?.manufacturerDataList || []).length === 0) return undefined;
  for (const { legacyDataList } of bleDevice.manufacturerDataList) {
    if (legacyDataList.length >= 3 && legacyDataList[1] == 80 && [88, 67].includes(legacyDataList[0])) {
      return legacyDataList
        .slice(2)
        .reverse()
        .reduce((acc, cur) => (acc << 8) + cur, 0);
    }
  }
  return undefined;
};

export const isSupported = (device: IBLEDevice) => {
  const productId = getProductId(device);
  if (productId === undefined) return false;
  if ([5, 7].includes(productId)) return true;

  const { name } = device;
  logWarn(
    '[LeggettPlatt] Device not supported, please contact me on Discord:',
    name,
    JSON.stringify(device.manufacturerDataList)
  );
  return false;
};
