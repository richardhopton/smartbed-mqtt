import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { sendAdjustableBaseCommand } from '@sleeptracker/requests/sendAdjustableBaseCommand';
import { Bed } from '@sleeptracker/types/Bed';
import { BedSide } from '@sleeptracker/types/BedSide';
import { Commands } from '@sleeptracker/types/Commands';
import { Snapshot } from '@sleeptracker/types/Snapshot';
import { buildEntityName } from '@utils/buildEntityName';

export const processSafetyLightSwitches = async (
  mqtt: IMQTTConnection,
  { deviceData }: Bed,
  { sideName, entities, user }: BedSide,
  { side, safetyLightOn }: Snapshot
) => {
  const cache = entities as { safetyLightSwitch?: Switch };
  if (!cache.safetyLightSwitch) {
    cache.safetyLightSwitch = new Switch(
      mqtt,
      deviceData,
      buildEntityName('Safety Lights', sideName),
      async (state: boolean) => {
        if (safetyLightOn != state) {
          const results = await sendAdjustableBaseCommand(Commands.ToggleSafetyLights, user);
          const snapshot = results.find((r) => r.side === side);
          if (snapshot) {
            safetyLightOn = snapshot.safetyLightOn;
          }
        }
        return state;
      }
    );
  }
  cache.safetyLightSwitch.setState(safetyLightOn);
};
