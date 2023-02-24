import { Dictionary } from '@utils/Dictionary';
import { getUnixEpoch } from '@utils/getUnixEpoch';
import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../../Utils/Options';
import defaultHeaders from './defaultHeaders';
import { buildDefaultPayload } from './defaultPayload';
import { authHost, authRequestUrl } from './urls';

const base64Encode = (str: string): string => Buffer.from(str).toString('base64');

interface AuthToken {
  expirationTimeSecs: number;
  token: string;
}
const authTokens: Dictionary<AuthToken> = {};

export const getAuthHeader = async (credentials: Credentials) => {
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
          ...buildDefaultPayload('session'),
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
