import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Sleeptracker/buildEntityConfig';
import { sendAdjustableBaseCommand } from '../requests/sendAdjustableBaseCommand';
import { Bed } from '../types/Bed';
import { Commands } from '../types/Commands';
import { Controller } from '../types/Controller';
import { Snapshot } from '../types/Snapshot';

export const processSafetyLightSwitches = async (
  mqtt: IMQTTConnection,
  { deviceData }: Bed,
  { sideName, entities, user }: Controller,
  { side, safetyLightOn }: Snapshot
) => {
  const cache = entities as { safetyLightSwitch?: Switch; safetyLightOn?: boolean };
  // Track the bed's reported state on the persistent cache (updated every poll)
  // rather than in the onChange closure. The command is a TOGGLE, so the guard
  // below must compare against the latest polled value; otherwise, if the bed
  // flips the safety lights on its own (they auto-light when you get out of
  // bed), a stale closure value makes "turn off" a no-op and the lights stay on.
  cache.safetyLightOn = safetyLightOn;
  if (!cache.safetyLightSwitch) {
    cache.safetyLightSwitch = new Switch(
      mqtt,
      deviceData,
      buildEntityConfig('Safety Lights', sideName),
      async (state: boolean) => {
        if (cache.safetyLightOn !== state) {
          const results = await sendAdjustableBaseCommand(Commands.ToggleSafetyLights, user);
          const snapshot = results.find((r) => r.side === side);
          if (snapshot) {
            cache.safetyLightOn = snapshot.safetyLightOn;
          }
        }
        return state;
      }
    );
  }
  cache.safetyLightSwitch.setState(cache.safetyLightOn);
};
