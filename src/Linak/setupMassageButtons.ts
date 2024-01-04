import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey, getString } from '@utils/getString';
import { logError } from '@utils/logger';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { Commands } from './Commands';
import { Controller } from './Controller';

interface MassageButtonsEntities {
  massageAllOff?: Button;
  massageAllToggle?: Button;
  massageAllUp?: Button;
  massageAllDown?: Button;

  massageHeadToggle?: Button;
  massageHeadUp?: Button;
  massageHeadDown?: Button;

  massageFootToggle?: Button;
  massageFootUp?: Button;
  massageFootDown?: Button;

  massageModeStep?: Button;
}

export const setupMassageButtons = (mqtt: IMQTTConnection, { entities, deviceData, writeData }: Controller) => {
  const cache = entities as MassageButtonsEntities;

  const buildCachedButton = (
    key: keyof MassageButtonsEntities,
    name: StringsKey,
    command: number[],
    { category }: { category?: string; repeat?: true } = {}
  ) => {
    let button = cache[key];
    if (!button) {
      button = cache[key] = new Button(mqtt, deviceData, buildEntityConfig(name, category), async () => {
        writeData(command).catch((e) => logError(`[Linak] Failed to write '${getString(name)}'`, e));
      });
    }
    button.setOnline();
  };

  buildCachedButton('massageAllOff', 'MassageAllOff', Commands.MassageAllOff);
  buildCachedButton('massageAllToggle', 'MassageAllToggle', Commands.MassageAllToggle);
  buildCachedButton('massageAllUp', 'MassageAllUp', Commands.MassageAllUp);
  buildCachedButton('massageAllDown', 'MassageAllDown', Commands.MassageAllDown);

  buildCachedButton('massageHeadToggle', 'MassageHeadToggle', Commands.MassageHeadToggle);
  buildCachedButton('massageHeadUp', 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton('massageHeadDown', 'MassageHeadDown', Commands.MassageHeadDown);

  buildCachedButton('massageFootToggle', 'MassageFootToggle', Commands.MassageFootToggle);
  buildCachedButton('massageFootUp', 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton('massageFootDown', 'MassageFootDown', Commands.MassageFootDown);

  buildCachedButton('massageModeStep', 'MassageModeStep', Commands.MassageModeStep);
};
