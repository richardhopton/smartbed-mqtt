import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { Entity } from './Entity';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const buildSubject = () => new Entity(mqtt, testDevice, 'Binary Sensor', 'binary_sensor');

describe(Entity.name, () => {
  beforeAll(() => jest.useFakeTimers());

  beforeEach(jest.resetAllMocks);

  it('publishes discovery on construction', () => {
    buildSubject();
    jest.runAllTimers();
    expect(mqtt.publish).toBeCalledWith('homeassistant/binary_sensor/device_topic_binary_sensor/config', {
      availability_topic: 'device_topic/binary_sensor/status',
      device: { ...testDevice.device },
      name: 'Test Name Binary Sensor',
      payload_available: 'online',
      payload_not_available: 'offline',
      unique_id: 'test_name_binary_sensor',
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
