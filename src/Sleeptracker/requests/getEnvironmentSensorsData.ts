import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import { EnvironmentSensorData, EnvironmentSensorType } from '../types/EnvironmentSensor';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

type ResponseSensor = {
  status: 'valid' | 'invalid';
  lastUpdatedGMTSecs: number;
  value: number;
};

type Response = {
  degreesCelsius?: ResponseSensor;
  humidityPercentage?: ResponseSensor;
  co2Ppm?: ResponseSensor;
  vocPpb?: ResponseSensor;
};

const process = (type: EnvironmentSensorType, sensor: ResponseSensor | undefined, results: EnvironmentSensorData[]) => {
  if (sensor?.status === 'valid') {
    const { lastUpdatedGMTSecs, value } = sensor;
    results.push({ type, lastUpdatedGMTSecs, value: Math.round(value * 10) / 10 });
  }
};

export const getEnvironmentSensorsData = async (processorId: number, credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return [];

  const { appHost, processorBaseUrl } = urls(credentials);
  try {
    const response = await axios.request<Response>({
      method: 'POST',
      url: `${processorBaseUrl}/latestEnvironmentSensorData`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {
        ...buildDefaultPayload('latestEnvironmentSensorData', credentials),
        sleeptrackerProcessorID: processorId,
      },
    });

    const { degreesCelsius, humidityPercentage, co2Ppm, vocPpb } = response.data;
    const results: EnvironmentSensorData[] = [];
    process('degreesCelsius', degreesCelsius, results);
    process('humidityPercentage', humidityPercentage, results);
    process('co2Ppm', co2Ppm, results);
    process('vocPpb', vocPpb, results);
    return results;
  } catch (err) {
    logError(err);
    return [];
  }
};
