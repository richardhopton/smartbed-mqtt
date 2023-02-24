import { logError } from '@utils/logger';
import { Credentials } from '@utils/Options';
import axios from 'axios';
import { HelloData } from '../types/HelloData';
import defaultHeaders from './defaultHeaders';
import { buildDefaultPayload } from './defaultPayload';
import { getAuthHeader } from './getAuthHeader';
import { appHost, processorBaseUrl } from './urls';

type Response = { helloData: HelloData & { buildMeta: any; server_config_url: any }; statusMessage: string };

export const getHelloData = async (processorId: number, user: Credentials) => {
  const authHeader = await getAuthHeader(user);
  if (!authHeader) return null;

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
        ...buildDefaultPayload('hello'),
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
