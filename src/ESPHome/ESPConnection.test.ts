import { Connection } from '@2colors/esphome-native-api';
import EventEmitter from 'events';
import { ESPConnection } from './ESPConnection';
import { connect, isIgnoredESPHomeError } from './connect';
import { BLEAdvertisement } from './types/BLEAdvertisement';

class FakeConnection extends EventEmitter {
  host = 'proxy.local';
  port = 6053;
  password = '';
  encryptionKey = 'testkey';
  connected = true;

  connect = jest.fn();
  disconnect = jest.fn();
  deviceInfoService = jest.fn().mockResolvedValue({ bluetoothProxyFeatureFlags: 3 });
  subscribeBluetoothAdvertisementService = jest.fn();
}

const makeAd = (overrides: Partial<BLEAdvertisement> = {}): BLEAdvertisement => ({
  name: '',
  address: 0x112233445566,
  rssi: -60,
  manufacturerDataList: [],
  serviceDataList: [],
  serviceUuidsList: [],
  addressType: 0,
  ...overrides,
});

describe('ESPHome BLE proxy compatibility', () => {
  it('identifies unknown ESPHome message ID errors to ignore safely (#68, #73)', () => {
    expect(isIgnoredESPHomeError(new Error('Failed find message type for Id: 126'))).toBe(true);
    expect(isIgnoredESPHomeError(new Error('Failed find message type for Id: 93'))).toBe(true);
    expect(isIgnoredESPHomeError(new Error('Failed find or parsed message type for Id: 200'))).toBe(true);
    expect(isIgnoredESPHomeError(new Error('read ECONNRESET'))).toBe(false);
  });

  it('does not crash or reject when unknown message IDs are emitted before or after authorization', async () => {
    const fake = new FakeConnection();
    const promise = connect(fake as unknown as Connection);

    fake.emit('error', new Error('Failed find message type for Id: 126'));
    fake.emit('authorized');

    const conn = await promise;
    expect(conn).toBe(fake);

    // Emit runtime unknown message error after authorization: must not throw unhandled error
    expect(() => fake.emit('error', new Error('Failed find or parsed message type for Id: 250'))).not.toThrow();
    expect(() => fake.emit('error', new Error('read ECONNRESET'))).not.toThrow();
  });

  it('merges split ADV_IND (UUIDs) and SCAN_RSP (name) packets before resolving getBLEDevices', async () => {
    const fake = new FakeConnection();
    const esp = new ESPConnection([fake as unknown as Connection]);

    const searchPromise = esp.getBLEDevices(['qrrm164025']);

    // Packet 1: SCAN_RSP with name only (no serviceUuidsList yet)
    fake.emit('message.BluetoothLEAdvertisementResponse', makeAd({ name: 'QRRM164025', serviceUuidsList: [] }));
    // Packet 2: ADV_IND with serviceUuidsList only (no name)
    fake.emit(
      'message.BluetoothLEAdvertisementResponse',
      makeAd({ name: '', serviceUuidsList: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] })
    );

    const devices = await searchPromise;
    expect(devices).toHaveLength(1);
    expect(devices[0].name).toBe('QRRM164025');
    expect(devices[0].advertisement.serviceUuidsList).toEqual(['6e400001-b5a3-f393-e0a9-e50e24dcca9e']);
  });

  it('supports configuring two identical RC2 controllers by colon-separated MAC address (#65)', async () => {
    const fake = new FakeConnection();
    const esp = new ESPConnection([fake as unknown as Connection]);

    const searchPromise = esp.getBLEDevices(['11:22:33:44:55:66', 'aa:bb:cc:dd:ee:ff']);

    fake.emit(
      'message.BluetoothLEAdvertisementResponse',
      makeAd({
        address: 0x112233445566,
        name: 'RC2',
        serviceUuidsList: ['0000ffe0-0000-1000-8000-00805f9b34fb'],
      })
    );
    fake.emit(
      'message.BluetoothLEAdvertisementResponse',
      makeAd({
        address: 0xaabbccddeeff,
        name: 'RC2',
        serviceUuidsList: ['0000ffe0-0000-1000-8000-00805f9b34fb'],
      })
    );

    const devices = await searchPromise;
    expect(devices).toHaveLength(2);
    expect(devices[0].mac).toBe('11:22:33:44:55:66');
    expect(devices[1].mac).toBe('aa:bb:cc:dd:ee:ff');
  });
});
