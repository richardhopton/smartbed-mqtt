import { Connection } from '@2colors/esphome-native-api';
import { IBLEDevice } from './IBLEDevice';

export class BLEDevice implements IBLEDevice {
  private connected = false;

  constructor(
    public name: string,
    public address: number,
    private addressType: number,
    private connection: Connection
  ) {
    this.connection.on('message.BluetoothDeviceConnectionResponse', ({ address, connected }) => {
      if (this.address !== address || this.connected === connected) return;
      this.connect();
    });
  }

  connect = async () => {
    await this.connection.connectBluetoothDeviceService(this.address, this.addressType);
    this.connected = true;
  };

  disconnect = async () => {
    this.connected = false;
    await this.connection.disconnectBluetoothDeviceService(this.address);
  };

  writeCharacteristic = async (handle: number, bytes: Uint8Array) => {
    await this.connection.writeBluetoothGATTCharacteristicService(this.address, handle, bytes, true);
  };

  getServices = async () => {
    const response = await this.connection.listBluetoothGATTServicesService(this.address);
    return response.servicesList;
  };

  subscribeToCharacteristic = async (handle: number, notify: (data: Uint8Array) => void) => {
    this.connection.on('message.BluetoothGATTNotifyDataResponse', (message) => {
      if (message.address != this.address || message.handle != handle) return;
      notify(new Uint8Array([...Buffer.from(message.data)]));
    });
    await this.connection.notifyBluetoothGATTCharacteristicService(this.address, handle);
  };

  readCharacteristic = async (handle: number) => {
    const response = await this.connection.readBluetoothGATTCharacteristicService(this.address, handle);
    return new Uint8Array([...Buffer.from(response.data)]);
  };
}
