import { connectToMQTT } from '@mqtt/connectToMQTT';
import { loadStrings } from '@utils/getString';
import { logError, logWarn } from '@utils/logger';
import { getType } from '@utils/options';
import { connectToESPHome } from 'ESPHome/connectToESPHome';
import { keeson } from 'Keeson/keeson';

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

const start = async () => {
  await loadStrings();

  const mqtt = await connectToMQTT();

  // bluetooth (only Keeson supported)
  const esphome = await connectToESPHome();

  if (getType() !== 'keeson') {
    logError('[Main] Only "keeson" type is supported in this build');
    return processExit(1);
  }

  return void (await keeson(mqtt, esphome));
};
void start();
