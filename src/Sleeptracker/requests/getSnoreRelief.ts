import { SnoreRelief } from '@sleeptracker/types/SnoreRelief';
import { logError } from '@utils/logger';
import { Credentials } from '@utils/Options';
import axios from 'axios';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { urls } from './shared/urls';

export const getSnoreRelief = async (credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return null;

  const { appHost, settingsBaseUrl } = urls(credentials);

  try {
    const response = await axios.request<SnoreRelief>({
      method: 'POST',
      url: `${settingsBaseUrl}/getSnoreRelief`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {},
    });
    const { snoreReliefTilt, snoreReliefVibration } = response.data;
    return { snoreReliefTilt, snoreReliefVibration } as SnoreRelief;
  } catch (err) {
    logError(err);
    return null;
  }
};
