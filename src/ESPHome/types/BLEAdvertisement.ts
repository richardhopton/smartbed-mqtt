export type BLEAdvertisement = {
  mac: string;
  name: string;
  address: number;
  rssi: number;
  serviceDataList: {
    uuid: string;
    legacyDataList: Uint8Array;
    data: string;
  }[];
  addressType: number;
};
