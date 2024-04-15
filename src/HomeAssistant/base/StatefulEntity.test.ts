import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { StatefulEntity } from './StatefulEntity';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const buildSubject = (category?: string) =>
  new StatefulEntity<string>(mqtt, testDevice, { description: 'Sensor', category }, 'sensor');

describe(StatefulEntity.name, () => {
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
      expect(mqtt.publish).toBeCalledWith('homeassistant/sensor/device_topic_sensor/config', {
        availability_topic: 'device_topic/sensor/status',
        device: { ...testDevice.device },
        name: 'Sensor',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/sensor/state',
        unique_id: 'test_name_sensor',
      });
    });

    it('on construction with entity category', () => {
      buildSubject('config');
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/sensor/device_topic_sensor/config', {
        availability_topic: 'device_topic/sensor/status',
        device: { ...testDevice.device },
        name: 'Sensor',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/sensor/state',
        unique_id: 'test_name_sensor',
        entity_category: 'config',
      });
    });

    it('when status online is receieved', async () => {
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      await onFunc('online');
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/sensor/device_topic_sensor/config', {
        availability_topic: 'device_topic/sensor/status',
        device: { ...testDevice.device },
        name: 'Sensor',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/sensor/state',
        unique_id: 'test_name_sensor',
      });
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
