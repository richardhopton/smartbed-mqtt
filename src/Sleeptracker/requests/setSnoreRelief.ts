import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import { SnoreRelief } from '../types/SnoreRelief';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

export const setSnoreRelief = async (snoreRelief: SnoreRelief, credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return false;

  const { appHost, settingsBaseUrl } = urls(credentials);
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
        ...buildDefaultPayload('setSnoreRelief', credentials),
        ...snoreRelief,
      },
    });
    return true;
  } catch (err) {
    logError(err);
    return false;
  }
};
