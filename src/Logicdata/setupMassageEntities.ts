import { Button } from '@ha/Button';
import { NumberSlider } from '@ha/NumberSlider';
import { Select } from '@ha/Select';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { getString } from '@utils/getString';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands, MassageZone } from './Commands';
import { Controller } from './Controller';

interface MassageEntities {
  massageStop?: Button;
  massageHead?: NumberSlider;
  massageLumbar?: NumberSlider;
  massageLeg?: NumberSlider;
  massagePreset?: Select;
}

export const setupMassageEntities = (mqtt: IMQTTConnection, { entities, deviceData, writeCommand }: Controller) => {
  const cache = entities as MassageEntities;

  const resetState = async () => {
    cache.massageHead?.setState(0);
    cache.massageLumbar?.setState(0);
    cache.massageLeg?.setState(0);
    cache.massagePreset?.setIndex(0);
    await writeCommand(Commands.MassageStop);
  };

  if (!cache.massageStop)
    cache.massageStop = new Button(mqtt, deviceData, buildEntityConfig('MassageStop'), resetState);

  cache.massageStop.setOnline();

  if (!cache.massagePreset) {
    const massagePresets = [
      getString('Off'),
      getString('Ripple'),
      getString('Wave'),
      getString('Waves'),
      getString('Pulse'),
    ];
    cache.massagePreset = new Select(
      mqtt,
      deviceData,
      {
        options: massagePresets,
        ...buildEntityConfig('MassageMode'),
      },
      async (state) => {
        const presetId = massagePresets.indexOf(state);
        if (presetId <= 0) return resetState();
        await writeCommand(Commands.MassagePreset(presetId - 1));
        if ((cache.massagePreset?.getIndex() || 0) === 0) {
          cache.massageHead?.setState(5);
          cache.massageLumbar?.setState(5);
          cache.massageLeg?.setState(5);
        }
      }
    );
  }
  cache.massagePreset?.setOnline();

  const getLevelCommand = (zone: MassageZone, level: number) => {
    const commandBuilder = !(cache.massagePreset?.getIndex() || 0)
      ? Commands.MassageLevelManual
      : Commands.MassageLevelPreset;
    return commandBuilder(zone, level);
  };

  const resetWhenLevelsAreZero = ({ head, lumbar, leg }: { head?: number; lumbar?: number; leg?: number }) => {
    if (head === undefined) head = cache.massageHead?.getState();
    if (lumbar === undefined) lumbar = cache.massageLumbar?.getState();
    if (leg === undefined) leg = cache.massageLeg?.getState();
    if (head === 0 && lumbar === 0 && leg === 0) {
      resetState();
    }
  };

  if (!cache.massageHead) {
    cache.massageHead = new NumberSlider(
      mqtt,
      deviceData,
      { min: 0, max: 10, ...buildEntityConfig('MassageHead') },
      async (level) => {
        await writeCommand(getLevelCommand(MassageZone.Head, level));
        resetWhenLevelsAreZero({ head: level });
      }
    );
  }
  cache.massageHead.setOnline();

  if (!cache.massageLumbar) {
    cache.massageLumbar = new NumberSlider(
      mqtt,
      deviceData,
      { min: 0, max: 10, ...buildEntityConfig('MassageLumbar') },
      async (level) => {
        await writeCommand(getLevelCommand(MassageZone.Lumbar, level));
        resetWhenLevelsAreZero({ lumbar: level });
      }
    );
  }
  cache.massageLumbar.setOnline();

  if (!cache.massageLeg) {
    cache.massageLeg = new NumberSlider(
      mqtt,
      deviceData,
      { min: 0, max: 10, ...buildEntityConfig('MassageLeg') },
      async (level) => {
        await writeCommand(getLevelCommand(MassageZone.Leg, level));
        resetWhenLevelsAreZero({ leg: level });
      }
    );
  }
  cache.massageLeg.setOnline();
};
