import { logError } from '@utils/logger';
import { Credentials } from '@utils/Options';
import axios from 'axios';
import { HelloData } from '../types/HelloData';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

type Response = { helloData: HelloData & { buildMeta: any; server_config_url: any }; statusMessage: string };

export const getHelloData = async (processorId: number, credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return null;

  const { appHost, processorBaseUrl } = urls(credentials);

  try {
    const response = await axios.request<Response>({
      method: 'POST',
      url: `${processorBaseUrl}/command/hello`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {
        ...buildDefaultPayload('hello', credentials),
        sleeptrackerProcessorID: processorId,
      },
    });
    if (!response.data.helloData) throw new Error(response.data.statusMessage);
    const {
      helloData: { buildMeta, server_config_url, ...helloData },
    } = response.data;
    return helloData as HelloData;
  } catch (err) {
    logError(err);
    return null;
  }
};
