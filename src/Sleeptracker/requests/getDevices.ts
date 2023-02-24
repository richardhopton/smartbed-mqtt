import { logError } from '@utils/logger';
import { Credentials } from '@utils/Options';
import axios from 'axios';
import { Device } from '../types/Device';
import defaultHeaders from './defaultHeaders';
import { buildDefaultPayload } from './defaultPayload';
import { getAuthHeader } from './getAuthHeader';
import { appHost, processorBaseUrl } from './urls';

type Response = { deviceList: Device[] };

export const getDevices = async (credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return [];

  try {
    const response = await axios.request<Response>({
      method: 'POST',
      url: `${processorBaseUrl}/getByType`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {
        ...buildDefaultPayload('getByType'),
        types: [1, 2, 4],
      },
    });
    return response.data.deviceList;
  } catch (err) {
    logError(err);
    return [];
  }
};
