import { Deferred } from '@utils/deferred';
import { logInfo } from '@utils/logger';
import { minutes } from '@utils/minutes';
import { createConnection, Socket } from 'net';
import { TcpPayloadBuilder } from './TcpPayloadBuilder';

let socket: Socket | null = null;
let interval: NodeJS.Timer | null = null;

const wrapper = {
  write: (buffer: Uint8Array) => {
    return socket?.write(buffer) || false;
  },
};

export const getConnection = async (onNewConnection: (socket: Socket) => void) => {
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
    onNewConnection(socket);
    await deferred;

    interval = setInterval(() => {
      logInfo('[ErgoMotion TCP] Keep alive');
      return wrapper.write(new TcpPayloadBuilder(0, 13).build());
    }, minutes(1));
  }
  return wrapper;
};
