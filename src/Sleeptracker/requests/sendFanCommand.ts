import { Credentials } from '../options';
import { sendProcessorCommand } from './sendProcessorCommand';

const COOLING_TIMER = 36000; // 10 hours
const HEATING_TIMER = 3600; // 1 hour

export type FanCommandOptions = {
  level: number; // 0=off, 1=low, 2=medium, 3=high
  isHeating: boolean;
  isConstant: boolean;
};

const buildSidePayload = (prefix: 'left' | 'right', options: FanCommandOptions) => ({
  [`${prefix}IsConstant`]: options.isConstant,
  [`${prefix}IsHeating`]: options.isHeating,
  [`${prefix}Level`]: options.level,
  [`${prefix}Timer`]: options.level === 0 ? 0 : options.isHeating ? HEATING_TIMER : COOLING_TIMER,
});

export const sendFanCommand = async (
  side: 'left' | 'right',
  options: FanCommandOptions,
  credentials: Credentials
) => {
  const fanControl = {
    position: { side: 0 },
    ...buildSidePayload(side, options),
  };

  return sendProcessorCommand(
    '/command/v1/motor-command',
    { fanControl },
    credentials
  );
};
