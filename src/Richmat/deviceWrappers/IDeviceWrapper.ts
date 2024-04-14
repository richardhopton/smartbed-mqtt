export interface IDeviceWrapper {
  controllerType: string;
  getBytes(command: number): number[];
  writeHandle: number;
}
