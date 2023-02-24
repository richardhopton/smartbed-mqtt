import { logError } from '@utils/logger';
import { Credentials } from '@utils/Options';
import axios from 'axios';
import { SleepSensor } from '../types/SleepSensor';
import defaultHeaders from './defaultHeaders';
import { buildDefaultPayload } from './defaultPayload';
import { getAuthHeader } from './getAuthHeader';
import { appHost, processorBaseUrl } from './urls';

type Response = { sensorMap: SleepSensor[] };

export const getSleepSensors = async (processorId: number, credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return [];

  try {
    const response = await axios.request<Response>({
      method: 'POST',
      url: `${processorBaseUrl}/getSensorMap`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {
        ...buildDefaultPayload('getSensorMap'),
        sleeptrackerProcessorID: processorId,
      },
    });
    return response.data.sensorMap;
  } catch (err) {
    logError(err);
    return [];
  }
};
