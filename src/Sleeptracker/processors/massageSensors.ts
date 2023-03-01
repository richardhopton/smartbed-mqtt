import { JsonSensor } from '@ha/JsonSensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { Bed } from '@sleeptracker/types/Bed';
import { Controller } from '@sleeptracker/types/Controller';
import { MassagePattern, MassageStatus, Snapshot } from '@sleeptracker/types/Snapshot';
import { buildEntityName } from '@utils/buildEntityName';

type MassagePatternState = {
  pattern: number;
  name: string;
};

interface MassageSensorEntities {
  headMassageStrength?: JsonSensor<MassageStatus>;
  footMassageStrength?: JsonSensor<MassageStatus>;
  massagePattern?: JsonSensor<MassagePatternState>;
}

export const processMassageSensors = async (
  mqtt: IMQTTConnection,
  { deviceData }: Bed,
  { sideName, entities, capability: { massageRoster } }: Controller,
  { head: { massage: headMassage }, foot: { massage: footMassage }, massagePattern }: Snapshot
) => {
  const cache = entities as MassageSensorEntities;
  if (massageRoster.head) {
    if (!cache.headMassageStrength) {
      cache.headMassageStrength = new JsonSensor<MassageStatus>(
        mqtt,
        deviceData,
        buildEntityName('Head Massage Strength', sideName),
        'strength'
      );
    }
    cache.headMassageStrength.setState(headMassage);
  } else {
    cache.headMassageStrength?.setOffline();
  }

  if (massageRoster.foot) {
    if (!cache.footMassageStrength) {
      cache.footMassageStrength = new JsonSensor<MassageStatus>(
        mqtt,
        deviceData,
        buildEntityName('Foot Massage Strength', sideName),
        'strength'
      );
    }
    cache.footMassageStrength.setState(footMassage);
  } else {
    cache.footMassageStrength?.setOffline();
  }

  if (massageRoster.head || massageRoster.foot) {
    if (!cache.massagePattern) {
      cache.massagePattern = new JsonSensor<MassagePatternState>(
        mqtt,
        deviceData,
        buildEntityName('Massage Pattern', sideName),
        'name'
      );
    }
    cache.massagePattern.setState({ pattern: massagePattern, name: MassagePattern[massagePattern] });
  } else {
    cache.massagePattern?.setOffline();
  }
};
