import { JsonSensor } from '@ha/JsonSensor';
import { cleanJsonState } from '@utils/cleanJsonState';
import { EnvironmentSensorData } from '../../types/EnvironmentSensor';

export class JsonEnvironmentSensor extends JsonSensor<EnvironmentSensorData> {
  mapState(state?: EnvironmentSensorData | undefined) {
    return cleanJsonState(state);
  }
}
