export interface IDeviceWrapper {
  controllerType: string;
  getBytes(command: number): Uint8Array;
  writeHandle: number;
}
