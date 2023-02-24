import { JsonSensor } from '@ha/JsonSensor';
import { EnvironmentSensorData } from '@sleeptracker/types/EnvironmentSensor';
import { cleanJsonState } from '@utils/cleanJsonState';

export class JsonEnvironmentSensor extends JsonSensor<EnvironmentSensorData> {
  mapState(state?: EnvironmentSensorData | undefined) {
    return cleanJsonState(state);
  }
}
