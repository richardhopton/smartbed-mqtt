import { connectToMQTT } from '@mqtt/connectToMQTT';
import { loadStrings } from '@utils/getString';
import { logError, logWarn } from '@utils/logger';
import { connectToESPHome } from 'ESPHome/connectToESPHome';
import { ergomotion } from 'ErgoMotion/ergomotion';
import { linak } from 'Linak/linak';
import { richmat } from 'Richmat/richmat';
import { sleeptracker } from 'Sleeptracker/sleeptracker';
import { getType } from './Utils/options';

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

  switch (getType()) {
    case 'sleeptracker':
    default:
      return void (await sleeptracker(mqtt));
    case 'ergomotion':
      return void (await ergomotion(mqtt));
    case 'richmat': {
      const esphome = await connectToESPHome();
      return void (await richmat(mqtt, esphome));
    }
    case 'linak': {
      const esphome = await connectToESPHome();
      return void (await linak(mqtt, esphome));
    }
  }
};
void start();
