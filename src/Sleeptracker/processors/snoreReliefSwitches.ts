import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { SnoreReliefSwitchSet } from '../entities/SnoreReliefSwitchSet';
import { Credentials } from '../options';
import { getSnoreRelief } from '../requests/getSnoreRelief';
import { setSnoreRelief } from '../requests/setSnoreRelief';
import { Bed } from '../types/Bed';
import { Controller } from '../types/Controller';
import { SnoreRelief } from '../types/SnoreRelief';

type SnoreReliefCache = { snoreReliefSwitchSet?: SnoreReliefSwitchSet };

const handleSnoreReliefChange =
  (credentials: Credentials, cache: SnoreReliefCache) => async (newSnoreRelief: SnoreRelief) => {
    if (!cache.snoreReliefSwitchSet) return;
    const success = await setSnoreRelief(newSnoreRelief, credentials);
    if (!success) return;

    const snoreRelief = await getSnoreRelief(credentials);
    cache.snoreReliefSwitchSet.setState(snoreRelief);
  };

export const processSnoreReliefSwitches = async (
  mqtt: IMQTTConnection,
  { deviceData }: Bed,
  { user, sideName, entities }: Controller
) => {
  const cache = entities as SnoreReliefCache;
  const snoreRelief = await getSnoreRelief(user);
  if (!snoreRelief) return;

  if (!cache.snoreReliefSwitchSet) {
    cache.snoreReliefSwitchSet = new SnoreReliefSwitchSet(
      mqtt,
      deviceData,
      sideName,
      handleSnoreReliefChange(user, cache)
    );
  }
  cache.snoreReliefSwitchSet.setState(snoreRelief);
};
