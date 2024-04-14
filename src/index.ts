import { connectToMQTT } from '@mqtt/connectToMQTT';
import { loadStrings } from '@utils/getString';
import { logError, logWarn } from '@utils/logger';
import { getType } from '@utils/options';
import { connectToESPHome } from 'ESPHome/connectToESPHome';
import { ergomotion } from 'ErgoMotion/ergomotion';
import { ergowifi } from 'ErgoWifi/ergowifi';
import { leggettplatt } from 'LeggettPlatt/leggettplatt';
import { linak } from 'Linak/linak';
import { logicdata } from 'Logicdata/logicdata';
import { motosleep } from 'MotoSleep/motosleep';
import { reverie } from 'Reverie/reverie';
import { richmat } from 'Richmat/richmat';
import { sleeptracker } from 'Sleeptracker/sleeptracker';
import { solace } from 'Solace/solace';

const processExit = (exitCode?: number) => {
  if (exitCode && exitCode > 0) {
    logError(`Exit code: ${exitCode}`);
  }
  process.exit();
};

process.on('exit', () => {
  logWarn('Shutting down Smartbed-MQTT...');
  processExit(0);
});
process.on('SIGINT', () => processExit(0));
process.on('SIGTERM', () => processExit(0));
process.on('uncaughtException', (err) => {
  logError(err);
  processExit(2);
});

const start = async (): Promise<void> => {
  loadStrings();

  const mqtt = await connectToMQTT();

  // http/udp
  switch (getType()) {
    case 'sleeptracker':
      return void (await sleeptracker(mqtt));
    case 'ergowifi':
      return void (await ergowifi(mqtt));
    case 'logicdata':
      return void (await logicdata(mqtt));
    case 'ergomotion':
      return void (await ergomotion(mqtt));
  }
  // bluetooth
  const esphome = await connectToESPHome();
  switch (getType()) {
    case 'richmat':
      return void (await richmat(mqtt, esphome));
    case 'linak':
      return void (await linak(mqtt, esphome));
    case 'solace':
      return void (await solace(mqtt, esphome));
    case 'motosleep':
      return void (await motosleep(mqtt, esphome));
    case 'reverie':
      return void (await reverie(mqtt, esphome));
    case 'leggettplatt':
      return void (await leggettplatt(mqtt, esphome));
  }
};
void start();
