import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { SnoreReliefSwitchSet } from '../entities/SnoreReliefSwitchSet';
import { Credentials } from '../options';
import { getSnoreRelief } from '../requests/getSnoreRelief';
import { setSnoreRelief } from '../requests/setSnoreRelief';
import { Bed } from '../types/Bed';
import { Controller } from '../types/Controller';
import { SnoreRelief } from '../types/SnoreRelief';

let snoreRelief: SnoreRelief | null;
let switchSet: SnoreReliefSwitchSet | null;

const handleSnoreReliefChange = (credentials: Credentials) => async (newSnoreRelief: SnoreRelief) => {
  if (!switchSet) return;
  const success = await setSnoreRelief(newSnoreRelief, credentials);
  if (!success) return;

  snoreRelief = await getSnoreRelief(credentials);
  switchSet.setState(snoreRelief);
};

export const processSnoreReliefSwitches = async (
  mqtt: IMQTTConnection,
  { deviceData }: Bed,
  { user, sideName, entities }: Controller
) => {
  const cache = entities as { snoreReliefSwitchSet?: SnoreReliefSwitchSet };
  snoreRelief = await getSnoreRelief(user);
  if (!snoreRelief) return;

  if (!cache.snoreReliefSwitchSet) {
    cache.snoreReliefSwitchSet = new SnoreReliefSwitchSet(mqtt, deviceData, sideName, handleSnoreReliefChange(user));
  }
  cache.snoreReliefSwitchSet.setState(snoreRelief);
};
