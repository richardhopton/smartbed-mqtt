import { Connection } from '@2colors/esphome-native-api';
import { Deferred } from '@utils/deferred';
import { logInfo, logWarn } from '@utils/logger';
import { IESPConnection } from './IESPConnection';
import { connect } from './connect';
import { mergeAdvertisement } from './mergeAdvertisement';
import { BLEAdvertisement } from './types/BLEAdvertisement';
import { BLEDevice } from './types/BLEDevice';
import { IBLEDevice } from './types/IBLEDevice';

const normalizeMac = (value: string): string => value.toLowerCase().replace(/[:-]/g, '');
const isMacAddress = (value: string): boolean => /^[0-9a-f]{12}$/.test(normalizeMac(value));

export class ESPConnection implements IESPConnection {
  constructor(private connections: Connection[]) {}

  async reconnect(): Promise<void> {
    this.disconnect();
    logInfo('[ESPHome] Reconnecting...');
    this.connections = await Promise.all(
      this.connections.map((connection) => {
        const { host, port, password, encryptionKey, expectedServerName } = connection as Connection & {
          encryptionKey?: string;
          expectedServerName?: string;
        };
        return connect(new Connection({ host, port, password, encryptionKey, expectedServerName }));
      })
    );
  }

  disconnect(): void {
    logInfo('[ESPHome] Disconnecting...');

    for (const connection of this.connections) {
      connection.disconnect();
      connection.connected = false;
    }
  }

  async getBLEDevices(deviceNames: string[], nameMapper?: (name: string) => string): Promise<IBLEDevice[]> {
    logInfo(`[ESPHome] Searching for device(s): ${deviceNames.join(', ')}`);
    deviceNames = deviceNames.map((name) => name.toLowerCase());
    const bleDevices: IBLEDevice[] = [];
    const seenAddresses = new Set<number>();
    const complete = new Deferred<void>();
    await this.discoverBLEDevices(
      (bleDevice) => {
        if (seenAddresses.has(bleDevice.address)) return;
        const { name, mac } = bleDevice;
        const normalizedDeviceMac = normalizeMac(mac);
        let index = deviceNames.findIndex(
          (target) => target === mac || (isMacAddress(target) && normalizeMac(target) === normalizedDeviceMac)
        );
        if (index !== -1) {
          // Preserve the exact key used in devicesMap (e.g. with colons) so caller lookup succeeds
          bleDevice.mac = deviceNames[index];
          if (!bleDevice.name) bleDevice.name = bleDevice.mac;
        } else if (name) {
          index = deviceNames.indexOf(name.toLowerCase());
        }
        if (index === -1) return;

        seenAddresses.add(bleDevice.address);
        deviceNames.splice(index, 1);
        logInfo(`[ESPHome] Found device: ${bleDevice.name} (${bleDevice.mac})`);
        bleDevices.push(bleDevice);
        if (deviceNames.length) return;
        complete.resolve();
      },
      complete,
      nameMapper
    );
    if (deviceNames.length) logWarn(`[ESPHome] Could not find address for device(s): ${deviceNames.join(', ')}`);
    return bleDevices;
  }

  async discoverBLEDevices(
    onNewDeviceFound: (bleDevice: IBLEDevice) => void,
    complete: Promise<void>,
    nameMapper?: (name: string) => string
  ) {
    const advertisementsByAddress = new Map<number, BLEAdvertisement>();
    const devicesByAddress = new Map<number, BLEDevice>();
    const notifiedWithName = new Set<number>();
    const notifiedWithoutName = new Set<number>();
    const pendingTimers = new Map<number, NodeJS.Timeout>();

    const clearPendingTimer = (address: number) => {
      const timer = pendingTimers.get(address);
      if (timer) {
        clearTimeout(timer);
        pendingTimers.delete(address);
      }
    };

    const listenerBuilder = (connection: Connection) => ({
      connection,
      listener: (advertisement: BLEAdvertisement) => {
        const { address } = advertisement;
        const merged = mergeAdvertisement(advertisementsByAddress.get(address), advertisement);
        advertisementsByAddress.set(address, merged);

        const mappedName = merged.name ? (nameMapper ? nameMapper(merged.name) : merged.name) : '';
        let device = devicesByAddress.get(address);
        if (!device) {
          device = new BLEDevice(mappedName, merged, connection);
          devicesByAddress.set(address, device);
        } else {
          Object.assign(device.advertisement, merged);
          if (mappedName && (!device.name || mappedName.length >= device.name.length)) {
            device.name = mappedName;
          }
        }

        if (notifiedWithName.has(address)) return;

        const hasAdvPayload =
          merged.serviceUuidsList.length > 0 ||
          merged.manufacturerDataList.length > 0 ||
          merged.serviceDataList.length > 0;

        if (mappedName && hasAdvPayload) {
          clearPendingTimer(address);
          notifiedWithName.add(address);
          onNewDeviceFound(device);
          return;
        }

        clearPendingTimer(address);
        const capturedDevice = device;
        const timer = setTimeout(() => {
          pendingTimers.delete(address);
          if (notifiedWithName.has(address)) return;
          if (capturedDevice.name) {
            notifiedWithName.add(address);
            onNewDeviceFound(capturedDevice);
          } else if (!notifiedWithoutName.has(address)) {
            notifiedWithoutName.add(address);
            onNewDeviceFound(capturedDevice);
          }
        }, 150);
        pendingTimers.set(address, timer);
      },
    });
    const listeners = this.connections.map(listenerBuilder);
    for (const { connection, listener } of listeners) {
      connection.on('message.BluetoothLEAdvertisementResponse', listener).subscribeBluetoothAdvertisementService();
    }
    await complete;
    for (const timer of pendingTimers.values()) {
      clearTimeout(timer);
    }
    pendingTimers.clear();
    for (const { connection, listener } of listeners) {
      connection.off('message.BluetoothLEAdvertisementResponse', listener);
    }
  }
}
