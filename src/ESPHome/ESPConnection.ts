import { BluetoothLEAdvertisementResponse, Connection } from '@2colors/esphome-native-api';
import { Deferred } from '@utils/deferred';
import { logInfo, logWarn } from '@utils/logger';
import { IESPConnection } from './IESPConnection';
import { connect } from './connect';
import { BLEAdvertisement } from './types/BLEAdvertisement';
import { BLEAdvertisementListener } from './types/BLEAdvertisementListener';
import { BLEDevice } from './types/BLEDevice';
import { IBLEDevice } from './types/IBLEDevice';

export class ESPConnection implements IESPConnection {
  private subscribedToBLEAdvertisements = false;
  private bleAdvertisementListener: BLEAdvertisementListener | null = null;
  constructor(private connections: Connection[]) {
    this.bluetoothLEAdvertisementListener = this.bluetoothLEAdvertisementListener.bind(this);
  }

  async reconnect(): Promise<void> {
    logInfo('[ESPHome] Reconnecting...');
    this.connections = await Promise.all(
      this.connections.map((connection) => {
        connection.disconnect();
        connection.connected = false;
        return connect(new Connection({ host: connection.host, port: connection.port, password: connection.password }));
      })
    );
    this.subscribedToBLEAdvertisements = false;
  }

  private bluetoothLEAdvertisementListener({ address, ...message }: BluetoothLEAdvertisementResponse) {
    if (!this.bleAdvertisementListener) return;

    const mac = address.toString(16);
    const advertisement: BLEAdvertisement = { mac, address, ...message };
    this.bleAdvertisementListener(advertisement);
  }

  subscribeToBLEAdvertisements(listener: BLEAdvertisementListener) {
    if (this.subscribedToBLEAdvertisements) return;
    this.subscribedToBLEAdvertisements = true;
    this.bleAdvertisementListener = listener;
    for (const connection of this.connections) {
      connection
        .on('message.BluetoothLEAdvertisementResponse', this.bluetoothLEAdvertisementListener)
        .subscribeBluetoothAdvertisementService();
    }
  }

  unsubscribeFromBLEAdvertisements() {
    if (!this.subscribedToBLEAdvertisements) return;
    for (const connection of this.connections) {
      connection
        .off('message.BluetoothLEAdvertisementResponse', this.bluetoothLEAdvertisementListener)
        .unsubscribeBluetoothAdvertisementService();
    }
    this.bleAdvertisementListener = null;
    this.subscribedToBLEAdvertisements = false;
  }

  async getBLEDevices(deviceNames: string[], nameMapper?: (name: string) => string): Promise<IBLEDevice[]> {
    logInfo(`[ESPHome] Searching for device(s): ${deviceNames.join(', ')}`);
    deviceNames = deviceNames.map((name) => name.toLowerCase());
    const bleDevices: IBLEDevice[] = [];
    const complete = new Deferred<void>();
    const seenAddresses: number[] = [];
    const listenerBuilder = (connection: Connection) => ({
      connection,
      listener: ({ name, address, addressType, manufacturerDataList, serviceUuidsList }: BLEAdvertisement) => {
        if (seenAddresses.includes(address) || !name) return;
        seenAddresses.push(address);

        if (nameMapper) name = nameMapper(name);
        const mac = address.toString(16).padStart(12, '0');

        let index = deviceNames.indexOf(mac);
        if (index === -1) index = deviceNames.indexOf(name.toLowerCase());
        if (index === -1) return;

        deviceNames.splice(index, 1);
        logInfo(`[ESPHome] Found device: ${name} (${mac})`);
        bleDevices.push(
          new BLEDevice(name, mac, address, addressType, manufacturerDataList, serviceUuidsList, connection)
        );

        if (deviceNames.length) return;
        complete.resolve();
      },
    });
    const listeners = this.connections.map(listenerBuilder);
    for (const { connection, listener } of listeners) {
      connection.on('message.BluetoothLEAdvertisementResponse', listener).subscribeBluetoothAdvertisementService();
    }
    await complete;
    if (deviceNames.length) logWarn(`[ESPHome] Cound not find address for device(s): ${deviceNames.join(', ')}`);
    return bleDevices;
  }
}
