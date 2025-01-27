import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Remote } from './Remote';

export const setupLightEntities = (mqtt: IMQTTConnection, controller: IController<number>, remote: Remote) => {
  const ublCommand = remote.commands.UBL;
  if (ublCommand && typeof ublCommand === 'number')
    buildCommandButton('Okimat', mqtt, controller, 'UnderBedLightsToggle', ublCommand);
  //controller.on('feedback', () => {});
  return;
};
