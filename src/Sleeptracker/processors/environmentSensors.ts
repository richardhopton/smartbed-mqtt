import { IDeviceData } from '@ha/IDeviceData';
import { Sensor } from '@ha/Sensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { CO2Sensor } from '../entities/EnvironmentSensors/CO2Sensor';
import { HumiditySensor } from '../entities/EnvironmentSensors/HumiditySensor';
import { TemperatureSensor } from '../entities/EnvironmentSensors/TemperatureSensor';
import { VOCSensor } from '../entities/EnvironmentSensors/VOCSensor';
import { getEnvironmentSensorsData } from '../requests/getEnvironmentSensorsData';
import { Bed } from '../types/Bed';
import { EnvironmentSensorData, EnvironmentSensorType } from '../types/EnvironmentSensor';

const buildSensorFromEnvironmentSensorType = (
  type: EnvironmentSensorType,
  mqtt: IMQTTConnection,
  deviceData: IDeviceData
): Sensor<EnvironmentSensorData> => {
  switch (type) {
    case 'degreesCelsius':
      return new TemperatureSensor(mqtt, deviceData);
    case 'humidityPercentage':
      return new HumiditySensor(mqtt, deviceData);
    case 'co2Ppm':
      return new CO2Sensor(mqtt, deviceData);
    case 'vocPpb':
      return new VOCSensor(mqtt, deviceData);
  }
};

interface EnvironmentSensorEntities {
  degreesCelsius?: Sensor<EnvironmentSensorData>;
  humidityPercentage?: Sensor<EnvironmentSensorData>;
  co2Ppm?: Sensor<EnvironmentSensorData>;
  vocPpb?: Sensor<EnvironmentSensorData>;
}

export const processEnvironmentSensors = async (
  mqtt: IMQTTConnection,
  { processorId, primaryUser, deviceData, entities }: Bed
) => {
  const cache = entities as EnvironmentSensorEntities;
  const environmentSensors = await getEnvironmentSensorsData(processorId, primaryUser);
  environmentSensors.forEach((environmentSensor) => {
    const { type } = environmentSensor;
    let sensor = cache[type];
    if (!sensor) {
      sensor = buildSensorFromEnvironmentSensorType(type, mqtt, deviceData);
      if (!sensor) return;
      cache[type] = sensor;
    }
    sensor.setState(environmentSensor);
  });
};
