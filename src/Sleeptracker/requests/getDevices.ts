import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import { Device } from '../types/Device';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

type Response = { deviceList: Device[] };

export const getDevices = async (credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return [];

  const { appHost, processorBaseUrl } = urls(credentials);
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
        ...buildDefaultPayload('getByType', credentials),
        types: [1, 2, 4, 6],
      },
    });
    return (response.data.deviceList || []).filter((d) => d.active);
  } catch (err) {
    logError(err);
    return [];
  }
};
