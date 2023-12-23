import { Button } from '@ha/Button';
import { IDeviceData } from '@ha/IDeviceData';
import { EntityConfig } from '@ha/base/Entity';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Credentials } from '../options';
import { sendBedCommand } from '../requests/sendBedCommand';
import { Commands } from '../types/Commands';

export class CommandButton extends Button {
  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    config: EntityConfig,
    command: Commands,
    user: Credentials,
    id: number
  ) {
    super(mqtt, deviceData, config, () => sendBedCommand(command, user, id));
  }
}
