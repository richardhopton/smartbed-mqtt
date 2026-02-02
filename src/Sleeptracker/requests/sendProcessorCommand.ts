import { Dictionary } from '@utils/Dictionary';
import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

export const sendProcessorCommand = async (
  endpoint: string,
  processorCommand: Dictionary<any>,
  credentials: Credentials
) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return null;

  const { appHost, processorBaseUrl } = urls(credentials);
  try {
    const response = await axios.request({
      method: 'POST',
      url: `${processorBaseUrl}/processorCommand`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {
        ...buildDefaultPayload('processorCommand', credentials),
        endpoint,
        processorCommand,
      },
    });
    return response.data;
  } catch (err) {
    logError(err);
    return null;
  }
};
