import { Button } from '@ha/Button';
import { IDeviceData } from '@ha/IDeviceData';
import { EntityConfig } from '@ha/base/Entity';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Dictionary } from '@utils/Dictionary';
import { Credentials } from '../options';
import { sendAdjustableBaseCommand } from '../requests/sendAdjustableBaseCommand';
import { Commands } from '../types/Commands';

export class CommandButton extends Button {
  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    config: EntityConfig,
    command: Commands,
    credentials: Credentials,
    additionalPayload: Dictionary<any> = {}
  ) {
    super(
      mqtt,
      deviceData,
      config,
      async () => void (await sendAdjustableBaseCommand(command, credentials, additionalPayload))
    );
  }
}
