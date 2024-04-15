import { BinarySensor } from '@ha/BinarySensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const buildSubject = () => new BinarySensor(mqtt, testDevice, { description: 'Binary Sensor' });

describe(BinarySensor.name, () => {
  beforeAll(() => jest.useFakeTimers());

  beforeEach(jest.resetAllMocks);

  describe('publishes discovery', () => {
    let onFunc: ((state: string) => Promise<void>) | null = null;

    beforeEach(() => {
      onFunc = null;
      mocked(mqtt.on).mockImplementation((topic, func) => {
        if (topic === 'homeassistant/status') onFunc = func;
      });

      buildSubject();
      jest.runAllTimers();
    });

    it('on construction', () => {
      expect(mqtt.publish).toBeCalledWith('homeassistant/binary_sensor/device_topic_binary_sensor/config', {
        availability_topic: 'device_topic/binary_sensor/status',
        device: { ...testDevice.device },
        name: 'Binary Sensor',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/binary_sensor/state',
        unique_id: 'test_name_binary_sensor',
      });
    });

    it('when status online is receieved', async () => {
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      await onFunc('online');
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/binary_sensor/device_topic_binary_sensor/config', {
        availability_topic: 'device_topic/binary_sensor/status',
        device: { ...testDevice.device },
        name: 'Binary Sensor',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/binary_sensor/state',
        unique_id: 'test_name_binary_sensor',
      });
    });
  });

  describe('call setState', () => {
    const entity = buildSubject();

    it.each([
      ['ON', true],
      ['OFF', false],
    ])('publishes state %s when setState called with %s', (expected, state) => {
      entity.setState(state);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/binary_sensor/state', expected);
    });

    it('publishes available offline when setState called with null', () => {
      entity.setState(null);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/binary_sensor/status', 'offline');
      expect(mqtt.publish).not.toBeCalledWith('device_topic/binary_sensor/state', null);
    });
  });
});
