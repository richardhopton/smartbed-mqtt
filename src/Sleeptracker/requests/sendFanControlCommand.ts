import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import { Snapshot } from '../types/Snapshot';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

type Response = { statusCode: number; statusMessage: string; body: { snapshots: Snapshot[] } };

export type FanSide = 'left' | 'right';

export type FanSideCommand = {
  level: number; // 0 = off, 1 = low, 2 = medium, 3 = high
  isHeating: boolean;
  isConstant: boolean; // false = temp-curve, true = constant cool
};

// Timer values as sent by the official app (seconds)
export const COOLING_TIMER_SECS = 36000; // 10 hours
export const HEATING_TIMER_SECS = 3600; // 1 hour

const buildSidePayload = (side: FanSide, { level, isHeating, isConstant }: FanSideCommand) => ({
  [`${side}Level`]: level,
  [`${side}Timer`]: isHeating ? HEATING_TIMER_SECS : COOLING_TIMER_SECS,
  [`${side}IsHeating`]: isHeating,
  [`${side}IsConstant`]: isConstant,
});

// ActiveBreeze fan/heat control. Sends via the processorCommand endpoint (not adjustableBaseControls).
// Pass one or both sides; omitted sides are left unchanged by the base.
export const sendFanControlCommand = async (
  sides: Partial<Record<FanSide, FanSideCommand>>,
  credentials: Credentials
) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return [];

  const { appHost, processorBaseUrl } = urls(credentials);
  const fanControl = {
    position: { side: 0 },
    ...(sides.left ? buildSidePayload('left', sides.left) : {}),
    ...(sides.right ? buildSidePayload('right', sides.right) : {}),
  };
  try {
    const response = await axios.request<Response>({
      method: 'POST',
      url: `${processorBaseUrl}/processorCommand`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {
        ...buildDefaultPayload('processorCommand', credentials),
        endpoint: '/command/v1/motor-command',
        processorCommand: { fanControl },
      },
    });
    const { statusCode, body } = response.data;
    if (statusCode !== 0) {
      logError('[Sleeptracker]', JSON.stringify(response.data));
    }
    return body?.snapshots || [];
  } catch (err) {
    logError(err);
    return [];
  }
};
