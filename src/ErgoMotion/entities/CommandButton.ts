import { Button } from '@ha/Button';
import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Credentials } from '../options';
import { sendBedCommand } from '../requests/sendBedCommand';
import { Commands } from '../types/Commands';

export class CommandButton extends Button {
  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityDesc: string,
    command: Commands,
    user: Credentials,
    id: number
  ) {
    super(mqtt, deviceData, entityDesc, () => sendBedCommand(command, user, id));
  }
}
