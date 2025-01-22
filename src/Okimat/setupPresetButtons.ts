import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { buildRepeatingCommandSwitch } from 'Common/buildRepeatingCommandSwitch';
import { Remote } from './Remote';
import { getString, StringsKey } from '@utils/getString';
import { Button } from '@ha/Button';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { logError } from '@utils/logger';
import { wait } from '@utils/wait';

export const buildSaveCommandButton = <TCommand>(
  mqtt: IMQTTConnection,
  { cache, deviceData, writeCommand }: IController<TCommand>,
  name: StringsKey,
  command: TCommand,
  category: string,
  count: number,
  waitTime: number,
  finishCommand: TCommand
) => {
  if (cache[name]) return;

  cache[name] = new Button(mqtt, deviceData, buildEntityConfig(name, category), async () => {
    try {
      await writeCommand(command, count, waitTime);
      await wait(500);
      await writeCommand(finishCommand);
    } catch (e) {
      logError(`[Okimat] Failed to write '${getString(name)}'`, e);
    }
  }).setOnline();
};
export const setupPresetButtons = (mqtt: IMQTTConnection, controller: IController<number>, remote: Remote) => {
  const flatCommand = remote.commands.Flat;
  if (flatCommand && typeof flatCommand === 'number')
    buildRepeatingCommandSwitch('Okimat', mqtt, controller, 'PresetFlat', flatCommand, undefined, 50, 200);

  const memorySaveCommand = remote.commands.MemorySave;

  const memory1Command = remote.commands.Memory1;
  if (memory1Command && typeof memory1Command === 'number') {
    buildCommandButton('Okimat', mqtt, controller, 'PresetMemory1', memory1Command);
    if (memorySaveCommand && typeof memorySaveCommand === 'object') {
      buildSaveCommandButton(
        mqtt,
        controller,
        'ProgramMemory1',
        memorySaveCommand.data,
        'config',
        memorySaveCommand.count,
        memorySaveCommand.waitTime,
        memory1Command
      );
    }
  }
  const memory2Command = remote.commands.Memory2;
  if (memory2Command && typeof memory2Command === 'number') {
    buildCommandButton('Okimat', mqtt, controller, 'PresetMemory1', memory2Command);
    if (memorySaveCommand && typeof memorySaveCommand === 'object') {
      buildSaveCommandButton(
        mqtt,
        controller,
        'ProgramMemory1',
        memorySaveCommand.data,
        'config',
        memorySaveCommand.count,
        memorySaveCommand.waitTime,
        memory2Command
      );
    }
  }
};
