import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { BedPositionSensor } from '@sleeptracker/entities/BedPositionSensor';
import { Bed } from '@sleeptracker/types/Bed';
import { BedSide } from '@sleeptracker/types/BedSide';
import { Snapshot } from '@sleeptracker/types/Snapshot';
import { buildEntityName } from '@utils/buildEntityName';

interface BedPositionEntities {
  headPosition?: BedPositionSensor;
  footPosition?: BedPositionSensor;
}

export const processBedPositionSensors = async (
  mqtt: IMQTTConnection,
  { deviceData, data: { headAngleTicksPerDegree, footAngleTicksPerDegree } }: Bed,
  { sideName, entities }: BedSide,
  snapshot: Snapshot
) => {
  const cache = entities as BedPositionEntities;

  if (!cache.headPosition) {
    cache.headPosition = new BedPositionSensor(mqtt, deviceData, buildEntityName('Head Angle', sideName));
  }
  cache.headPosition.setBedPosition(snapshot.head.motor, headAngleTicksPerDegree);

  if (!cache.footPosition) {
    cache.footPosition = new BedPositionSensor(mqtt, deviceData, buildEntityName('Foot Angle', sideName));
  }
  cache.footPosition.setBedPosition(snapshot.foot.motor, footAngleTicksPerDegree);
};
