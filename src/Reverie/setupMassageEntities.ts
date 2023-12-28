import { NumberSlider } from '@ha/NumberSlider';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { Controller } from './Controller';

interface MassageEntities {
  massageHead?: NumberSlider;
  massageFoot?: NumberSlider;
}

export const setupMassageEntities = (mqtt: IMQTTConnection, controller: Controller) => {
  const { entities, deviceData, writeData } = controller;
  const cache = entities as MassageEntities;
  if (!cache.massageHead) {
    cache.massageHead = new NumberSlider(
      mqtt,
      deviceData,
      buildEntityConfig('MassageHead'),
      async (state) => await writeData(Commands.MassageHead(state)),
      { min: 0, max: 10 }
    );
    controller.on('notify', (bytes: number[]) => {
      cache.massageHead?.setState(bytes[4]);
    });
  }
  cache.massageHead.setOnline();
  if (!cache.massageFoot) {
    cache.massageFoot = new NumberSlider(
      mqtt,
      deviceData,
      buildEntityConfig('MassageFoot'),
      async (state) => await writeData(Commands.MassageFoot(state)),
      { min: 0, max: 10 }
    );
    controller.on('notify', (bytes: number[]) => {
      cache.massageFoot?.setState(bytes[5]);
    });
  }
  cache.massageFoot.setOnline();
};
