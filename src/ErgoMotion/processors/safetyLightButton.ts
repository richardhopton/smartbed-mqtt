import { Button } from '@ha/Button';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { CommandButton } from '../entities/CommandButton';
import { Bed } from '../types/Bed';
import { Commands } from '../types/Commands';

export const processSafetyLightButton = async (mqtt: IMQTTConnection, { deviceData, id, user, entities }: Bed) => {
  const cache = entities as { safetyLightSwitch?: Button };
  let { safetyLightSwitch } = cache;

  if (!safetyLightSwitch) {
    safetyLightSwitch = cache.safetyLightSwitch = new CommandButton(
      mqtt,
      deviceData,
      'Toggle Safety Lights',
      Commands.ToggleSafetyLights,
      user,
      id
    );
  }
  safetyLightSwitch.setOnline();
};
