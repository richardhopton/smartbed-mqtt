import { connectToMQTT } from '@mqtt/connectToMQTT';
import { sleeptracker } from '@sleeptracker/sleeptracker';
import { logError, logWarn } from '@utils/logger';
import { getType } from '@utils/Options';

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

  const type = getType();
  if (type === 'sleeptracker') {
    await sleeptracker(mqtt);
  }
};
void start();
