export type EnvironmentSensorType = 'degreesCelsius' | 'humidityPercentage' | 'co2Ppm' | 'vocPpb';
export type EnvironmentSensorData = {
  type: EnvironmentSensorType;
  lastUpdatedGMTSecs: number;
  value: number;
};
