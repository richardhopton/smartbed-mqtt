import { Credentials, SleeptrackerType } from '@utils/Options';

type Context =
  | 'session'
  | 'getByType'
  | 'hello'
  | 'getSensorMap'
  | 'latestEnvironmentSensorData'
  | 'setSnoreRelief'
  | 'adjustableBaseControls';

const contextMap = {
  session: 'getUserSession',
  getByType: 'cloudIoTDevicesGetByType',
  hello: 'cloudIoTProcessorSimpleHello',
  getSensorMap: 'cloudIoTDevicesGetSensorMap',
  latestEnvironmentSensorData: 'environmentalData',
  setSnoreRelief: 'setSnoreRelief',
  adjustableBaseControls: 'adjustableBaseControls',
};

const getClientFields = (type?: SleeptrackerType) => {
  switch (type) {
    case 'beautyrest':
    case 'serta':
      return { clientID: 'sleeptracker-android', clientVersion: '6.5.15' };
    case 'tempur':
    default:
      return { clientID: 'sleeptracker-android-tsi', clientVersion: '1.9.47' };
  }
};
export const buildDefaultPayload = (context: Context, { type }: Credentials) => ({
  ...getClientFields(type),
  id: `TEST_ANDROID_${contextMap[context]}`,
});
