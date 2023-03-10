import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { StatefulEntity } from './StatefulEntity';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const buildSubject = () => new StatefulEntity<string>(mqtt, testDevice, 'Sensor', 'sensor');

describe(StatefulEntity.name, () => {
  beforeAll(() => jest.useFakeTimers());

  beforeEach(jest.resetAllMocks);

  it("publishes discovery on construction'", () => {
    buildSubject();
    jest.runAllTimers();
    expect(mqtt.publish).toBeCalledWith('homeassistant/sensor/device_topic_sensor/config', {
      availability_topic: 'device_topic/sensor/status',
      device: { ...testDevice.device },
      name: 'Test Name Sensor',
      payload_available: 'online',
      payload_not_available: 'offline',
      state_topic: 'device_topic/sensor/state',
      unique_id: 'test_name_sensor',
    });
  });

  describe('call setState', () => {
    const entity = buildSubject();

    it.each(['Test State Value', ''])("publishes state when setState called with '%s'", (state) => {
      entity.setState(state);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/sensor/state', state);
    });

    it('publishes available offline when setState called with null', () => {
      entity.setState(null);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/sensor/status', 'offline');
      expect(mqtt.publish).not.toBeCalledWith('device_topic/sensor/state', null);
    });
  });
});
