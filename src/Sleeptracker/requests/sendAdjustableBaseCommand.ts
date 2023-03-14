import { Dictionary } from '@utils/Dictionary';
import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import { Commands } from '../types/Commands';
import { Snapshot } from '../types/Snapshot';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

type Response = { statusCode: number; statusMessage: string; body: { snapshots: Snapshot[] } };

export const sendAdjustableBaseCommand = async (
  bedControlCommand: Commands,
  credentials: Credentials,
  additionalPayload: Dictionary<any> = {}
) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return [];

  const shouldLogError = (statusCode: number, statusMessage: string) => {
    if (bedControlCommand === Commands.Status && statusCode === 28 && statusMessage.includes('INVALID_PRESET'))
      return false;

    return statusCode !== 0;
  };

  const { appHost, processorBaseUrl } = urls(credentials);
  try {
    const response = await axios.request<Response>({
      method: 'POST',
      url: `${processorBaseUrl}/adjustableBaseControls`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {
        ...buildDefaultPayload('adjustableBaseControls', credentials),
        bedControlCommand,
        ...additionalPayload,
      },
    });
    const { statusCode, statusMessage, body } = response.data;
    if (shouldLogError(statusCode, statusMessage)) {
      logError('[Sleeptracker]', JSON.stringify(response.data));
    }
    return body.snapshots || [];
  } catch (err) {
    logError(err);
    return [];
  }
};
