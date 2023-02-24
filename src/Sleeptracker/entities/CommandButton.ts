import { Button } from '@ha/Button';
import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { sendAdjustableBaseCommand } from '@sleeptracker/requests/sendAdjustableBaseCommand';
import { Commands } from '@sleeptracker/types/Commands';
import { Credentials } from '@utils/Options';

export class CommandButton extends Button {
  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityDesc: string,
    command: Commands,
    credentials: Credentials,
    isConfig = false
  ) {
    super(mqtt, deviceData, entityDesc, () => sendAdjustableBaseCommand(command, credentials), isConfig);
  }
}
