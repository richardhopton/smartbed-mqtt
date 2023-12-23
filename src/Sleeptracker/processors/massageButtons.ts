import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Sleeptracker/buildEntityConfig';
import { CommandButton } from '../entities/CommandButton';
import { Bed } from '../types/Bed';
import { Commands } from '../types/Commands';
import { Controller } from '../types/Controller';

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
  { sideName, user, entities, capability: { massageRoster } }: Controller
) => {
  const cache = entities as MassageButtonEntities;
  if (massageRoster.head) {
    if (!cache.massageHeadStep) {
      cache.massageHeadStep = new CommandButton(
        mqtt,
        deviceData,
        buildEntityConfig('Massage Head Step', sideName),
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
        buildEntityConfig('Massage Foot Step', sideName),
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
        buildEntityConfig('Massage Step', sideName),
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
        buildEntityConfig('Massage Pattern Step', sideName),
        Commands.MassagePatternStep,
        user
      );
    }
    cache.massagePatternStep.setOnline();

    if (!cache.massageTimerStep) {
      cache.massageTimerStep = new CommandButton(
        mqtt,
        deviceData,
        buildEntityConfig('Massage Timer Step', sideName),
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
