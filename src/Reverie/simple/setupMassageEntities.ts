import { NumberSlider } from '@ha/NumberSlider';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';

export const setupMassageEntities = (
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand }: IController<number[]>
) => {
  if (!cache.massageHead) {
    cache.massageHead = new NumberSlider(
      mqtt,
      deviceData,
      { min: 0, max: 10, ...buildEntityConfig('MassageHead') },
      async (state) => await writeCommand(Commands.MassageHead(state))
    ).setOnline();
  }

  if (!cache.massageFoot) {
    cache.massageFoot = new NumberSlider(
      mqtt,
      deviceData,
      { min: 0, max: 10, ...buildEntityConfig('MassageFoot') },
      async (state) => await writeCommand(Commands.MassageFoot(state))
    ).setOnline();
  }

  if (!cache.massageWave) {
    cache.massageWave = new NumberSlider(
      mqtt,
      deviceData,
      { min: 1, max: 4, ...buildEntityConfig('MassageWave') },
      async (state) => await writeCommand(Commands.MassageWave(state))
    ).setOnline();
  }
};
