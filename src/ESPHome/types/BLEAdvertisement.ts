export type BLEData = {
  uuid: string;
  legacyDataList: Uint8Array;
  data: string;
};

export type BLEAdvertisement = {
  name: string;
  address: number;
  rssi: number;
  manufacturerDataList: BLEData[];
  serviceDataList: BLEData[];
  serviceUuidsList: string[];
  addressType: number;
};
