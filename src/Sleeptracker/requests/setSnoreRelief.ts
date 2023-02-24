import { SnoreRelief } from '@sleeptracker/types/SnoreRelief';
import { logError } from '@utils/logger';
import { Credentials } from '@utils/Options';
import axios from 'axios';
import defaultHeaders from './defaultHeaders';
import { buildDefaultPayload } from './defaultPayload';
import { getAuthHeader } from './getAuthHeader';
import { appHost, settingsBaseUrl } from './urls';

export const setSnoreRelief = async (snoreRelief: SnoreRelief, credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return false;

  try {
    await axios.request<SnoreRelief>({
      method: 'POST',
      url: `${settingsBaseUrl}/setSnoreRelief`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {
        ...buildDefaultPayload('setSnoreRelief'),
        ...snoreRelief,
      },
    });
    return true;
  } catch (err) {
    logError(err);
    return false;
  }
};
