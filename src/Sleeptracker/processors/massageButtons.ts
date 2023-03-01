import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { CommandButton } from '@sleeptracker/entities/CommandButton';
import { Bed } from '@sleeptracker/types/Bed';
import { BedSide } from '@sleeptracker/types/BedSide';
import { Commands } from '@sleeptracker/types/Commands';
import { buildEntityName } from '@utils/buildEntityName';

interface MassageButtonEntities {
  massageHeadStep?: CommandButton;
  massageFootStep?: CommandButton;
  massageStep?: CommandButton;
  massagePatternStep?: CommandButton;
  massageTimerStep?: CommandButton;
}

export const setupMassageButtons = async (
  mqtt: IMQTTConnection,
  { deviceData }: Bed,
  { sideName, user, entities, capability: { massageRoster } }: BedSide
) => {
  const cache = entities as MassageButtonEntities;
  if (massageRoster.head) {
    if (!cache.massageHeadStep) {
      cache.massageHeadStep = new CommandButton(
        mqtt,
        deviceData,
        buildEntityName('Massage Head Step', sideName),
        Commands.MassageHeadStep,
        user,
        { massageAdjustment: 1, requestStatus: true }
      );
    }
    cache.massageHeadStep.setOnline();
  } else {
    cache.massageHeadStep?.setOffline();
  }

  if (massageRoster.foot) {
    if (!cache.massageFootStep) {
      cache.massageFootStep = new CommandButton(
        mqtt,
        deviceData,
        buildEntityName('Massage Foot Step', sideName),
        Commands.MassageFootStep,
        user,
        { massageAdjustment: 1, requestStatus: true }
      );
    }
    cache.massageFootStep.setOnline();
  } else {
    cache.massageFootStep?.setOffline();
  }

  if (massageRoster.head && massageRoster.foot) {
    if (!cache.massageStep) {
      cache.massageStep = new CommandButton(
        mqtt,
        deviceData,
        buildEntityName('Massage Step', sideName),
        Commands.MassageStep,
        user
      );
    }
    cache.massageStep.setOnline();
  } else {
    cache.massageStep?.setOffline();
  }

  if (massageRoster.head || massageRoster.foot) {
    if (!cache.massagePatternStep) {
      cache.massagePatternStep = new CommandButton(
        mqtt,
        deviceData,
        buildEntityName('Massage Pattern Step', sideName),
        Commands.MassagePatternStep,
        user
      );
    }
    cache.massagePatternStep.setOnline();

    if (!cache.massageTimerStep) {
      cache.massageTimerStep = new CommandButton(
        mqtt,
        deviceData,
        buildEntityName('Massage Timer Step', sideName),
        Commands.MassageTimerStep,
        user
      );
    }
    cache.massageTimerStep.setOnline();
  } else {
    cache.massagePatternStep?.setOffline();
    cache.massageTimerStep?.setOffline();
  }
};
