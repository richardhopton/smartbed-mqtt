import { Select } from '@ha/Select';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { getString } from '@utils/getString';
import { IController } from 'Common/IController';
import { Commands } from './Commands';
import { massageOptions } from './massageOptions';
import { massageWaveOptions } from './massageWaveOptions';

export const setupMassageEntities = (
  mqtt: IMQTTConnection,
  { deviceData, cache, writeCommand }: IController<number[]>
) => {
  if (!cache.massageHead) {
    cache.massageHead = new Select(
      mqtt,
      deviceData,
      {
        options: massageOptions,
        description: getString('MassageHead'),
      },
      async (state) => {
        const index = massageOptions.indexOf(state);
        await writeCommand(Commands.MassageHeadStrength(index));
        return state;
      }
    ).setOnline();
  }

  if (!cache.massageFoot) {
    cache.massageFoot = new Select(
      mqtt,
      deviceData,
      {
        options: massageOptions,
        description: getString('MassageFoot'),
      },
      async (state) => {
        const index = massageOptions.indexOf(state);
        await writeCommand(Commands.MassageFootStrength(index));
        return state;
      }
    ).setOnline();
  }

  if (!cache.massageWave) {
    const select = (cache.massageWave = new Select(
      mqtt,
      deviceData,
      {
        options: massageWaveOptions,
        description: getString('MassageWave'),
      },
      async (state) => {
        const index = massageWaveOptions.indexOf(state);
        if (index == 0) {
          await writeCommand(Commands.MassageWaveOff);
        } else {
          const currentState = select.getState();
          if (massageWaveOptions.indexOf(currentState || massageWaveOptions[0]))
            await writeCommand(Commands.MassageWaveOn);
          await writeCommand(Commands.MassageWaveLevel(index));
        }
        return state;
      }
    ).setOnline());
  }
};
