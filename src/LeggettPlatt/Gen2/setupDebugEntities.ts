import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Controller } from '../Controller';
import { Commands } from './Commands';

interface DebugEntities {
  refreshState?: Button;
}

export const setupDebugEntities = (mqtt: IMQTTConnection, { entities, deviceData, writeData }: Controller) => {
  const cache = entities as DebugEntities;

  if (!cache.refreshState) {
    cache.refreshState = new Button(mqtt, deviceData, { description: 'Refresh State' }, async () => {
      await writeData(Commands.GetState);
    });
  }
  cache.refreshState.setOnline();

  writeData(Commands.GetState);
};
