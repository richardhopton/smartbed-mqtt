import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Remote } from './Remote';

export const setupLightEntities = (mqtt: IMQTTConnection, controller: IController<number>, remote: Remote) => {
  const ublCommand = remote.commands.UBL;
  if (typeof ublCommand === 'number')
    buildCommandButton('Okimat', mqtt, controller, 'UnderBedLightsToggle', ublCommand);
  if (typeof ublCommand === 'object') {
    const { data, ...config } = ublCommand;
    buildCommandButton('Okimat', mqtt, controller, 'UnderBedLightsToggle', data, config);
  }
  return;
};
