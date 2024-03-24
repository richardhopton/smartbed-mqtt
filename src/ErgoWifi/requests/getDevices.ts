import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import { getAuthDetails } from './getAuthDetails';
import defaultHeaders from './shared/defaultHeaders';
import { urls } from './shared/urls';
import { Device } from './types/Device';

type Response = { list: Device[] };

export const getDevices = async (credentials: Credentials) => {
  const authDetails = await getAuthDetails(credentials);
  if (!authDetails) return [];

  const { host, userBaseUrl } = urls();
  const { userId, token } = authDetails;
  try {
    const response = await axios.request<Response>({
      method: 'GET',
      url: `${userBaseUrl}/${userId}/subscribe/devices?version=3`,
      headers: {
        ...defaultHeaders,
        Host: host,
        'Access-Token': token,
      },
    });
    return response.data.list;
  } catch (err) {
    logError(err);
    return [];
  }
};
