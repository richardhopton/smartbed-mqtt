import { Button } from '@ha/Button';
import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Dictionary } from '@utils/Dictionary';
import { Credentials } from '../options';
import { sendAdjustableBaseCommand } from '../requests/sendAdjustableBaseCommand';
import { Commands } from '../types/Commands';

type options = {
  isConfig?: boolean;
} & Dictionary<any>;

export class CommandButton extends Button {
  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityDesc: string,
    command: Commands,
    credentials: Credentials,
    { isConfig, ...additionalPayload }: options = { isConfig: false }
  ) {
    super(
      mqtt,
      deviceData,
      entityDesc,
      () => sendAdjustableBaseCommand(command, credentials, additionalPayload),
      isConfig
    );
  }
}
