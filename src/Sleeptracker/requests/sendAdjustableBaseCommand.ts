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

type Response = { body: { statusCode: number; snapshots: Snapshot[] } };

export const sendAdjustableBaseCommand = async (
  bedControlCommand: Commands,
  credentials: Credentials,
  additionalPayload: Dictionary<any> = {}
) => {
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
    const { statusCode, snapshots } = response.data.body;
    if (statusCode !== 0) {
      logError(JSON.stringify(response.data));
    }
    return snapshots;
  } catch (err) {
    logError(err);
    return [];
  }
};
