import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton(mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton(mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);
  buildCachedButton(mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton(mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);
  buildCachedButton(mqtt, controller, 'MassageStep', Commands.MassageStep);
  buildCachedButton(mqtt, controller, 'MassageTimerStep', Commands.MassageTimerStep);
};
