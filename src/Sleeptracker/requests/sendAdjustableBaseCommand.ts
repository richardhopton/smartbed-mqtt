import { Commands } from '@sleeptracker/types/Commands';
import { Snapshot } from '@sleeptracker/types/Snapshot';
import { logError } from '@utils/logger';
import { Credentials } from '@utils/Options';
import axios from 'axios';
import defaultHeaders from './defaultHeaders';
import { buildDefaultPayload } from './defaultPayload';
import { getAuthHeader } from './getAuthHeader';
import { appHost, processorBaseUrl } from './urls';

type Response = { body: { snapshots: Snapshot[] } };

export const sendAdjustableBaseCommand = async (bedControlCommand: Commands, credentials: Credentials) => {
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
      },
    });
    return response.data.body.snapshots;
  } catch (err) {
    logError(err);
    return [];
  }
};
