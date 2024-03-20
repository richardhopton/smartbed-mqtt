export type BLEManufacturerData = {
  uuid: string;
  legacyDataList: Uint8Array;
  data: string;
};

export type BLEAdvertisement = {
  mac: string;
  name: string;
  address: number;
  rssi: number;
  manufacturerDataList: BLEManufacturerData[];
  serviceUuidsList: string[];
  addressType: number;
};
