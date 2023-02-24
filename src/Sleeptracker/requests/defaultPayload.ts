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
export const buildDefaultPayload = (context: Context) => ({
  clientID: 'sleeptracker-android-tsi',
  clientVersion: '1.9.47',
  id: `TEST_ANDROID_${contextMap[context]}`,
});
