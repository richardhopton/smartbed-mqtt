import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import { SleepSensor } from '../types/SleepSensor';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

type Response = { sensorMap: SleepSensor[] };

export const getSleepSensors = async (processorId: number, credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return [];

  const { appHost, processorBaseUrl } = urls(credentials);
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
        ...buildDefaultPayload('getSensorMap', credentials),
        sleeptrackerProcessorID: processorId,
      },
    });
    return response.data.sensorMap;
  } catch (err) {
    logError(err);
    return [];
  }
};
