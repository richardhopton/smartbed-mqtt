import { Dictionary } from '@utils/Dictionary';
import { getUnixEpoch } from '@utils/getUnixEpoch';
import { logError } from '@utils/logger';
import axios from 'axios';
import { Credentials } from '../options';
import defaultHeaders from './shared/defaultHeaders';
import { urls } from './shared/urls';

interface AuthDetails {
  expirationTimeSecs: number;
  token: string;
  authorize: string;
  userId: number;
}
const authDetailsCache: Dictionary<AuthDetails> = {};

export const getAuthDetails = async ({ email, password }: Credentials) => {
  const { host, authRequestUrl } = urls();
  let authDetails = authDetailsCache[email];
  if (!authDetails) {
    authDetails = authDetailsCache[email] = {
      expirationTimeSecs: 0,
      token: '',
      authorize: '',
      userId: 0,
    };
  }
  const currentTime = getUnixEpoch() + 60;
  try {
    if (currentTime >= authDetails.expirationTimeSecs) {
      const response = await axios.request({
        method: 'POST',
        url: authRequestUrl,
        headers: {
          ...defaultHeaders,
          Host: host,
        },
        data: { corp_id: '100fa2b0157e4a00', email, password },
      });
      const { access_token, expire_in, authorize, user_id } = response.data;
      authDetails.token = access_token;
      authDetails.expirationTimeSecs = getUnixEpoch() + expire_in;
      authDetails.authorize = authorize;
      authDetails.userId = user_id;
    }
    return { token: authDetails.token, userId: authDetails.userId, authorize: authDetails.authorize };
  } catch (err) {
    logError(err);
    return null;
  }
};
