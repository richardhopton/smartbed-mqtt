import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { CommandButton } from '../entities/CommandButton';
import { Bed } from '../types/Bed';
import { Commands } from '../types/Commands';

interface MassageButtonEntities {
  massageHeadUp?: CommandButton;
  massageHeadDown?: CommandButton;
  massageFootUp?: CommandButton;
  massageFootDown?: CommandButton;
  massageStep?: CommandButton;
  massageAllOff?: CommandButton;
}

export const setupMassageButtons = async (mqtt: IMQTTConnection, { deviceData, id, user, entities }: Bed) => {
  const cache = entities as MassageButtonEntities;
  if (!cache.massageHeadUp) {
    cache.massageHeadUp = new CommandButton(mqtt, deviceData, 'Massage Head Up', Commands.MassageHeadUp, user, id);
  }
  cache.massageHeadUp.setOnline();
  if (!cache.massageHeadDown) {
    cache.massageHeadDown = new CommandButton(
      mqtt,
      deviceData,
      'Massage Head Down',
      Commands.MassageHeadDown,
      user,
      id
    );
  }
  cache.massageHeadDown.setOnline();

  if (!cache.massageFootUp) {
    cache.massageFootUp = new CommandButton(mqtt, deviceData, 'Massage Foot Up', Commands.MassageFootUp, user, id);
  }
  cache.massageFootUp.setOnline();
  if (!cache.massageFootDown) {
    cache.massageFootDown = new CommandButton(
      mqtt,
      deviceData,
      'Massage Foot Down',
      Commands.MassageFootDown,
      user,
      id
    );
  }
  cache.massageFootDown.setOnline();

  if (!cache.massageStep) {
    cache.massageStep = new CommandButton(mqtt, deviceData, 'Massage Step', Commands.MassageStep, user, id);
  }
  cache.massageStep.setOnline();

  if (!cache.massageAllOff) {
    cache.massageAllOff = new CommandButton(
      mqtt,
      deviceData,
      'Massage Timer Step',
      Commands.MassageTimerStep,
      user,
      id
    );
  }
  cache.massageAllOff.setOnline();
};
