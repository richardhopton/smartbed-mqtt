import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Commands } from './Commands';
import { Controller } from './Controller';

export const setupMassageButtons = (mqtt: IMQTTConnection, controller: Controller) => {
  buildCachedButton(mqtt, controller, 'MassageAllOff', Commands.MassageAllOff);
  buildCachedButton(mqtt, controller, 'MassageAllToggle', Commands.MassageAllToggle);
  buildCachedButton(mqtt, controller, 'MassageAllUp', Commands.MassageAllUp);
  buildCachedButton(mqtt, controller, 'MassageAllDown', Commands.MassageAllDown);

  buildCachedButton(mqtt, controller, 'MassageHeadToggle', Commands.MassageHeadToggle);
  buildCachedButton(mqtt, controller, 'MassageHeadUp', Commands.MassageHeadUp);
  buildCachedButton(mqtt, controller, 'MassageHeadDown', Commands.MassageHeadDown);

  buildCachedButton(mqtt, controller, 'MassageFootToggle', Commands.MassageFootToggle);
  buildCachedButton(mqtt, controller, 'MassageFootUp', Commands.MassageFootUp);
  buildCachedButton(mqtt, controller, 'MassageFootDown', Commands.MassageFootDown);

  buildCachedButton(mqtt, controller, 'MassageModeStep', Commands.MassageModeStep);
};
