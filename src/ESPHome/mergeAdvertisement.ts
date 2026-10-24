import { BLEAdvertisement, BLEData } from './types/BLEAdvertisement';

const cleanName = (name?: string): string => (name ? name.replace(/\0/g, '').trim() : '');

const mergeDataList = (existing: BLEData[] = [], incoming: BLEData[] = []): BLEData[] => {
  const result = [...existing];
  for (const item of incoming) {
    const key = `${item.uuid}:${item.data}:${Array.from(item.legacyDataList || []).join(',')}`;
    const exists = result.some((e) => `${e.uuid}:${e.data}:${Array.from(e.legacyDataList || []).join(',')}` === key);
    if (!exists) result.push(item);
  }
  return result;
};

export const mergeAdvertisement = (
  existing: BLEAdvertisement | undefined,
  incoming: BLEAdvertisement
): BLEAdvertisement => {
  const incomingName = cleanName(incoming.name);
  if (!existing) {
    return {
      ...incoming,
      name: incomingName,
      manufacturerDataList: [...(incoming.manufacturerDataList || [])],
      serviceDataList: [...(incoming.serviceDataList || [])],
      serviceUuidsList: [...(incoming.serviceUuidsList || [])],
    };
  }

  const existingName = cleanName(existing.name);
  const name = incomingName.length >= existingName.length && incomingName ? incomingName : existingName;
  const serviceUuidsList = Array.from(
    new Set([...(existing.serviceUuidsList || []), ...(incoming.serviceUuidsList || [])])
  );

  return {
    ...existing,
    ...incoming,
    name,
    serviceUuidsList,
    manufacturerDataList: mergeDataList(existing.manufacturerDataList, incoming.manufacturerDataList),
    serviceDataList: mergeDataList(existing.serviceDataList, incoming.serviceDataList),
  };
};
