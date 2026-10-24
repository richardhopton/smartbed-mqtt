import { mergeAdvertisement } from './mergeAdvertisement';
import { BLEAdvertisement } from './types/BLEAdvertisement';

const baseAd = (overrides: Partial<BLEAdvertisement> = {}): BLEAdvertisement => ({
  name: '',
  address: 0x574c62c22dc4,
  rssi: -70,
  manufacturerDataList: [],
  serviceDataList: [],
  serviceUuidsList: [],
  addressType: 0,
  ...overrides,
});

describe(mergeAdvertisement.name, () => {
  it('strips null bytes from advertisement name on first sight', () => {
    const merged = mergeAdvertisement(undefined, baseAd({ name: 'KSBT03C000015046\0\0' }));
    expect(merged.name).toBe('KSBT03C000015046');
  });

  it('merges primary advertisement (UUIDs) with scan response (name)', () => {
    const advInd = baseAd({
      name: '',
      serviceUuidsList: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'],
    });
    const scanRsp = baseAd({
      name: 'QRRM164025',
      serviceUuidsList: [],
    });

    const first = mergeAdvertisement(undefined, advInd);
    const second = mergeAdvertisement(first, scanRsp);

    expect(second.name).toBe('QRRM164025');
    expect(second.serviceUuidsList).toEqual(['6e400001-b5a3-f393-e0a9-e50e24dcca9e']);
  });

  it('merges scan response (name) followed by primary advertisement (UUIDs and manufacturer data)', () => {
    const scanRsp = baseAd({ name: 'QRRM164025' });
    const advInd = baseAd({
      name: '',
      serviceUuidsList: ['0000fee9-0000-1000-8000-00805f9b34fb'],
      manufacturerDataList: [{ uuid: '00005850-0000-1000-8000-00805f9b34fb', legacyDataList: [88, 80, 5], data: '' }],
    });

    const first = mergeAdvertisement(undefined, scanRsp);
    const second = mergeAdvertisement(first, advInd);

    expect(second.name).toBe('QRRM164025');
    expect(second.serviceUuidsList).toEqual(['0000fee9-0000-1000-8000-00805f9b34fb']);
    expect(second.manufacturerDataList).toHaveLength(1);
  });

  it('prefers the longer complete local name over a shortened name and deduplicates UUIDs', () => {
    const shortNameAd = baseAd({
      name: 'KSBT',
      serviceUuidsList: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'],
    });
    const fullNameAd = baseAd({
      name: 'KSBT03C000015046',
      serviceUuidsList: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'],
    });

    const merged = mergeAdvertisement(mergeAdvertisement(undefined, fullNameAd), shortNameAd);
    expect(merged.name).toBe('KSBT03C000015046');
    expect(merged.serviceUuidsList).toEqual(['6e400001-b5a3-f393-e0a9-e50e24dcca9e']);
  });
});
