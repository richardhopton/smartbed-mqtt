import { Deferred } from '@utils/deferred';
import { logInfo } from '@utils/logger';
import { minutes } from '@utils/minutes';
import { createConnection, Socket } from 'net';
import { PayloadBuilder } from './PayloadBuilder';

let socket: Socket | null = null;
let interval: NodeJS.Timer | null = null;

interface IConnection {
  write: (buffer: Uint8Array) => Promise<void>;
}

const wrapper: IConnection = {
  write: async (buffer: Uint8Array) =>
    new Promise<void>((res, rej) =>
      socket?.write(buffer, (err) => {
        if (err) res();
        else rej();
      })
    ),
};

export const getConnection = async (onNewConnection: (connection: IConnection) => Promise<void>) => {
  if (!socket) {
    socket = createConnection({ host: 'cm.xlink.cn', port: 23778 });
    socket.on('close', () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      socket = null;
    });
    const deferred = new Deferred<Buffer>();
    socket.once('data', (data) => {
      deferred.resolve(data);
    });
    await onNewConnection(wrapper);
    await deferred;

    interval = setInterval(async () => {
      logInfo('[ErgoWifi TCP] Keep alive');
      await wrapper.write(new PayloadBuilder(0, 13).build());
    }, minutes(1));
  }
  return wrapper;
};
