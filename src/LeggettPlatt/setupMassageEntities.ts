import { Select } from '@ha/Select';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { getString } from '@utils/getString';
import { Commands } from './Commands';
import { Controller } from './Controller';

interface MassageEntities {
  massageHead?: Select;
  massageFoot?: Select;
  massageWave?: Select;
}

export const setupMassageEntities = (mqtt: IMQTTConnection, controller: Controller) => {
  const { deviceData, entities, writeData } = controller;
  const cache = entities as MassageEntities;

  if (!cache.massageHead) {
    const options = [getString('Off'), getString('Low'), getString('Medium'), getString('High')];
    const select = (cache.massageHead = new Select(
      mqtt,
      deviceData,
      {
        options,
        description: getString('MassageHead'),
      },
      async (state) => {
        const index = options.indexOf(state);
        await writeData(Commands.MassageHeadStrength(index));
        return state;
      }
    ));
    controller.on('read', (data: Uint8Array) => {
      const head = data[2] - 0x40;
      if ((head & 0x80) === 0x0) {
        select.setState(options[0]);
      } else {
        const strength = head - 0x80;
        select.setState(options[strength + 1]);
      }
    });
  }
  cache.massageHead.setOnline();

  if (!cache.massageFoot) {
    const options = [getString('Off'), getString('Low'), getString('Medium'), getString('High')];
    const select = (cache.massageFoot = new Select(
      mqtt,
      deviceData,
      {
        options,
        description: getString('MassageFoot'),
      },
      async (state) => {
        const index = options.indexOf(state);
        await writeData(Commands.MassageFootStrength(index));
        return state;
      }
    ));
    controller.on('read', (data: Uint8Array) => {
      const foot = data[3] - 0x40;
      if ((foot & 0x80) === 0x0) {
        select.setState(options[0]);
      } else {
        const strength = foot - 0x80;
        select.setState(options[strength + 1]);
      }
    });
  }
  cache.massageFoot.setOnline();

  if (!cache.massageWave) {
    const options = [getString('Off'), '1', '2', '3'];
    const select = (cache.massageWave = new Select(
      mqtt,
      deviceData,
      {
        options,
        description: getString('MassageWave'),
      },
      async (state) => {
        const index = options.indexOf(state);
        if (index == 0) {
          await writeData(Commands.MassageWaveOff);
        } else {
          const currentState = select.getState();
          if (options.indexOf(currentState || options[0])) await writeData(Commands.MassageWaveOn);
          await writeData(Commands.MassageWaveLevel(index));
        }
        return state;
      }
    ));
    controller.on('read', (data: Uint8Array) => {
      const wave = data[0];
      if ((wave & 0x2) === 0x2) {
        select.setState(options[0]);
      } else {
        const level = wave / 0x10;
        select.setState(options[level + 1]);
      }
    });
  }
};
