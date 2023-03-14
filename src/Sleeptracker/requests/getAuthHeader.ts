import { Dictionary } from '@utils/Dictionary';
import { getUnixEpoch } from '@utils/getUnixEpoch';
import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import defaultHeaders from './shared/defaultHeaders';
import { buildDefaultPayload } from './shared/defaultPayload';
import { urls } from './shared/urls';

const base64Encode = (str: string): string => Buffer.from(str).toString('base64');

interface AuthToken {
  expirationTimeSecs: number;
  token: string;
}
const authTokens: Dictionary<AuthToken> = {};

export const getAuthHeader = async (credentials: Credentials) => {
  const { authHost, authRequestUrl } = urls(credentials);
  let authToken = authTokens[credentials.email];
  if (!authToken) {
    authToken = authTokens[credentials.email] = {
      expirationTimeSecs: 0,
      token: '',
    };
  }

  const currentTime = getUnixEpoch() + 60;
  try {
    if (currentTime >= authToken.expirationTimeSecs) {
      const { email, password } = credentials;
      const authHeader = `${email}:${password}`;
      const response = await axios.request({
        method: 'POST',
        url: authRequestUrl,
        headers: {
          ...defaultHeaders,
          Host: authHost,
          Authorization: `Basic ${base64Encode(authHeader)}`,
        },
        data: {
          ...buildDefaultPayload('session', credentials),
          scope: 'scope',
        },
      });
      const { token, expirationTimeSecs } = response.data;
      authToken.token = `Bearer ${token}`;
      authToken.expirationTimeSecs = expirationTimeSecs;
    }
    return authToken.token;
  } catch (err) {
    logError(err);
    return null;
  }
};
