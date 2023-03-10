import { connectToMQTT } from '@mqtt/connectToMQTT';
import { logError, logWarn } from '@utils/logger';
import { ergomotion } from 'ErgoMotion/ergomotion';
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
  const mqtt = await connectToMQTT();

  switch (getType()) {
    case 'sleeptracker':
    default:
      return void (await sleeptracker(mqtt));
    case 'ergomotion':
      return void (await ergomotion(mqtt));
  }
};
void start();
