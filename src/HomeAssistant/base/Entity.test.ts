import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { Entity } from './Entity';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const buildSubject = (category?: string) =>
  new Entity(mqtt, testDevice, { description: 'Binary Sensor', category }, 'binary_sensor');

describe(Entity.name, () => {
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
        unique_id: 'test_name_binary_sensor',
      });
    });

    it('on construction with entity category', () => {
      buildSubject('config');
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/binary_sensor/device_topic_binary_sensor/config', {
        availability_topic: 'device_topic/binary_sensor/status',
        device: { ...testDevice.device },
        name: 'Binary Sensor',
        payload_available: 'online',
        payload_not_available: 'offline',
        unique_id: 'test_name_binary_sensor',
        entity_category: 'config',
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
        unique_id: 'test_name_binary_sensor',
      });
    });
  });

  describe('publishes availability', () => {
    const entity = buildSubject();

    it('online when setOnline called', () => {
      entity.setOnline();
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/binary_sensor/status', 'online');
    });

    it('offline when setOffline called', () => {
      entity.setOffline();
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/binary_sensor/status', 'offline');
    });
  });
});
