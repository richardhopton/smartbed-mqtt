import { Deferred } from '@utils/deferred';
import { logInfo, logWarn } from '@utils/logger';
import { RemoteInfo, createSocket } from 'dgram';

export type UDPDevice = {
  name: string;
  ipAddress: string;
};

export const discoverUDPDevices = async (deviceNames: string[]): Promise<UDPDevice[]> => {
  const udpDevices: UDPDevice[] = [];
  if (!deviceNames.length) return udpDevices;
  const complete = new Deferred<void>();
  const socket = createSocket('udp4');
  const onMessage = (message: Buffer, info: RemoteInfo) => {
    if (info.size < 92) return;
    const value = message.subarray(60, 92).toString();
    const hostNameIndex = value.startsWith('TEMPUR_') ? 13 : 10;
    const name = value.substring(0, hostNameIndex).replace(/\0/g, '').trim();
    if (!deviceNames.includes(name)) return;
    deviceNames.splice(deviceNames.indexOf(name), 1);
    const ipAddress = info.address;

    logInfo('[Logicdata] Found device:', name);
    udpDevices.push({ name, ipAddress });

    if (deviceNames.length) return;
    complete.resolve();
  };
  socket.on('message', onMessage);
  socket.bind(55555);

  await complete;
  socket.off('message', onMessage);
  socket.close();
  if (deviceNames.length) logWarn('[Logicdata] Cound not find address for device(s):', deviceNames);
  return udpDevices;
};
