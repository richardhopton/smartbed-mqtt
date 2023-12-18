import { Connection, Discovery } from '@2colors/esphome-native-api';
import { logInfo } from '@utils/logger';
import { connect } from './connect';

export const discoverProxies = async (password: string) => {
  logInfo('[ESPHome] Discovering...');

  return new Promise<Connection[]>((resolve) => {
    const checkedHosts: string[] = [];
    const proxies: Connection[] = [];
    const checkForBluetoothProxy = async ({ host, port }: { host: string; port: number }) => {
      const connection = new Connection({ host, port, password });
      connection.once('authorized', async () => {
        const { bluetoothProxyVersion } = await connection.deviceInfoService();
        if (bluetoothProxyVersion > 0) {
          logInfo('[ESPHome] Discovered:', host);
          proxies.push(connection);
        } else {
          connection.disconnect();
        }
      });
      await connect(connection);
    };

    const discovery = new Discovery({});
    let discoveryTimes = 0;
    const discoveryInterval: NodeJS.Timer = setInterval(() => {
      discovery.destroy();
      if (discoveryTimes > 4) {
        clearInterval(discoveryInterval);
        logInfo(`[ESPHome] Discovered ${proxies.length} proxies after 60 seconds`);
        resolve(proxies);
        return;
      }
      discoveryTimes++;
      logInfo('[ESPHome] Still discovering...', `${discoveryTimes * 10} seconds...`);
      discovery.run();
    }, 10_000);
    discovery.on('info', (info: any) => {
      const { host, port } = info;
      if (checkedHosts.includes(host)) return;
      checkedHosts.push(host);
      //discoveryTimes = 0;
      checkForBluetoothProxy({ host, port });
    });
    discovery.run();
  });
};
