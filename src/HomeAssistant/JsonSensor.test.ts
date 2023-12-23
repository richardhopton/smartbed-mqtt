import { BinarySensor } from '@ha/BinarySensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { JsonSensor } from './JsonSensor';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const buildSubject = (valueField = 'value') =>
  new JsonSensor(mqtt, testDevice, { description: 'Json Sensor' }, valueField);

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
      expect(mqtt.publish).toBeCalledWith('homeassistant/sensor/device_topic_json_sensor/config', {
        availability_topic: 'device_topic/json_sensor/status',
        device: { ...testDevice.device },
        name: 'Test Name Json Sensor',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/json_sensor/state',
        unique_id: 'test_name_json_sensor',
        json_attributes_topic: 'device_topic/json_sensor/state',
        value_template: "{{ value_json.value | default('') }}",
      });
    });

    it('on construction with entity category', () => {
      buildSubject('config');
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/sensor/device_topic_json_sensor/config', {
        availability_topic: 'device_topic/json_sensor/status',
        device: { ...testDevice.device },
        name: 'Test Name Json Sensor',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/json_sensor/state',
        unique_id: 'test_name_json_sensor',
        json_attributes_topic: 'device_topic/json_sensor/state',
        value_template: "{{ value_json.value | default('') }}",
        entity_category: 'config',
      });
    });

    it('when status online is receieved', () => {
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      onFunc('online');
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/sensor/device_topic_json_sensor/config', {
        availability_topic: 'device_topic/json_sensor/status',
        device: { ...testDevice.device },
        name: 'Test Name Json Sensor',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/json_sensor/state',
        unique_id: 'test_name_json_sensor',
        json_attributes_topic: 'device_topic/json_sensor/state',
        value_template: "{{ value_json.value | default('') }}",
      });
    });
  });

  it('excludes value_json from value_template if set to null', () => {
    buildSubject('');
    jest.runAllTimers();
    expect(mqtt.publish).toBeCalledWith('homeassistant/sensor/device_topic_json_sensor/config', {
      availability_topic: 'device_topic/json_sensor/status',
      device: { ...testDevice.device },
      name: 'Test Name Json Sensor',
      payload_available: 'online',
      payload_not_available: 'offline',
      state_topic: 'device_topic/json_sensor/state',
      unique_id: 'test_name_json_sensor',
      json_attributes_topic: 'device_topic/json_sensor/state',
      value_template: "{{ default('') }}",
    });
  });

  describe('call setState', () => {
    const entity = buildSubject();

    it('publishes state when setState called with json state', () => {
      const state = { stringValue: 'state', numberValue: 0, objectValue: { value: 10 } };
      entity.setState(state);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/json_sensor/state', state);
    });

    it('publishes available offline when setState called with null', () => {
      entity.setState(null);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/json_sensor/status', 'offline');
      expect(mqtt.publish).not.toBeCalledWith('device_topic/json_sensor/state', null);
    });
  });
});
