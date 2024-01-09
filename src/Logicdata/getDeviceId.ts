import { logError } from '@utils/logger';
import axios from 'axios';

type Response = {
  connection: {
    station: {
      mac_addr: string;
    };
  };
};

export const getDeviceId = async (ipAddress: string) => {
  try {
    const response = await axios.get<Response>(`http://${ipAddress}/sys`);
    return response.data?.connection?.station?.mac_addr?.replace(/:/g, '');
  } catch (err) {
    logError(err);
    return null;
  }
};
