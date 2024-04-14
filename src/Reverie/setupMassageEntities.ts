import { NumberSlider } from '@ha/NumberSlider';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { IEventSource } from 'Common/IEventSource';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';

interface MassageEntities {
  massageHead?: NumberSlider;
  massageFoot?: NumberSlider;
  massageWave?: NumberSlider;
}

export const setupMassageEntities = (mqtt: IMQTTConnection, controller: IController<number[]> & IEventSource) => {
  const { entities, deviceData, writeCommand } = controller;
  const cache = entities as MassageEntities;
  if (!cache.massageHead) {
    cache.massageHead = new NumberSlider(
      mqtt,
      deviceData,
      { min: 0, max: 10, ...buildEntityConfig('MassageHead') },
      async (state) => await writeCommand(Commands.MassageHead(state))
    );
    controller.on('notify', (bytes) => {
      if (bytes.length === 9) cache.massageHead?.setState(bytes[4]);
    });
  }
  cache.massageHead.setOnline();
  if (!cache.massageFoot) {
    cache.massageFoot = new NumberSlider(
      mqtt,
      deviceData,
      { min: 0, max: 10, ...buildEntityConfig('MassageFoot') },
      async (state) => await writeCommand(Commands.MassageFoot(state))
    );
    controller.on('notify', (bytes) => {
      if (bytes.length === 9) cache.massageFoot?.setState(bytes[5]);
    });
  }
  cache.massageFoot.setOnline();
  if (!cache.massageWave) {
    cache.massageWave = new NumberSlider(
      mqtt,
      deviceData,
      { min: 1, max: 4, ...buildEntityConfig('MassageWave') },
      async (state) => await writeCommand(Commands.MassageWave(state))
    );
  }
  cache.massageWave.setOnline();
};
