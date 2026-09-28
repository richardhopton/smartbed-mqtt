import { Dictionary } from '@utils/Dictionary';
import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import { getAuthHeader } from './getAuthHeader';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

type Response = { statusCode: number; statusMessage: string };

// Sends a "motor-animation" processor command (a sequence of massage statements).
// This is the API the Tempur/Sleeptracker app uses for Wave Form massage:
//   POST /processor/processorCommand
//   { endpoint: "/command/v1/motor-animation",
//     processorCommand: { statement: { type: "sequence", statements: [...] } } }
export const sendMotorAnimationCommand = async (statements: Dictionary<any>[], credentials: Credentials) => {
  const authHeader = await getAuthHeader(credentials);
  if (!authHeader) return;

  const { appHost, processorBaseUrl } = urls(credentials);
  try {
    const response = await axios.request<Response>({
      method: 'POST',
      url: `${processorBaseUrl}/processorCommand`,
      headers: {
        ...defaultHeaders,
        Host: appHost,
        Authorization: authHeader,
      },
      data: {
        ...buildDefaultPayload('adjustableBaseControls', credentials),
        endpoint: '/command/v1/motor-animation',
        processorCommand: { statement: { type: 'sequence', statements } },
      },
    });
    const { statusCode } = response.data;
    if (statusCode !== 0) {
      logError('[Sleeptracker]', JSON.stringify(response.data));
    }
  } catch (err) {
    logError(err);
  }
};
