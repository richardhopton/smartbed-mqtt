import { Commands } from '@sleeptracker/types/Commands';
import { Snapshot } from '@sleeptracker/types/Snapshot';
import { Dictionary } from '@utils/Dictionary';
import { logError } from '@utils/logger';
import { Credentials } from '@utils/Options';
import axios from 'axios';
import defaultHeaders from './defaultHeaders';
import { buildDefaultPayload } from './defaultPayload';
import { getAuthHeader } from './getAuthHeader';
import { appHost, processorBaseUrl } from './urls';

type Response = { statusCode: number; statusMessage: string; body: { snapshots: Snapshot[] } };

export const sendAdjustableBaseCommand = async (
  bedControlCommand: Commands,
  credentials: Credentials,
  additionalPayload: Dictionary<any> = {}
) => {
  const shouldLogError = (statusCode: number, statusMessage: string) => {
    if (bedControlCommand === Commands.Status && statusCode === 28 && statusMessage.includes('INVALID_PRESET'))
      return false;

    return statusCode !== 0;
  };

  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return [];

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
        ...buildDefaultPayload('adjustableBaseControls'),
        bedControlCommand,
        ...additionalPayload,
      },
    });
    const { statusCode, statusMessage, body } = response.data;
    if (shouldLogError(statusCode, statusMessage)) {
      logError(JSON.stringify(response.data));
    }
    return body.snapshots || [];
  } catch (err) {
    logError(err);
    return [];
  }
};
