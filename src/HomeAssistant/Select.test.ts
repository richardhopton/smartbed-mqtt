import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { Select } from './Select';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const onChange = jest.fn();
const options = ['one', 'two', 'three'];
const buildSubject = (category?: string) =>
  new Select(mqtt, testDevice, { description: 'Select', category, options }, async (state) => {
    onChange(state);
  });

describe(Select.name, () => {
  beforeAll(() => jest.useFakeTimers());

  beforeEach(jest.resetAllMocks);

  describe('publishes discovery', () => {
    let onFunc: ((state: string) => Promise<void>) | null = null;

    beforeEach(() => {
      onFunc = null;
      mocked(mqtt.on).mockImplementation((topic, func) => {
        if (topic === 'homeassistant/status') onFunc = func;
      });
    });

    it('on construction', () => {
      buildSubject();
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/select/device_topic_select/config', {
        availability_topic: 'device_topic/select/status',
        device: { ...testDevice.device },
        name: 'Select',
        options,
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/select/state',
        unique_id: 'test_name_select',
        command_topic: 'device_topic/select/command',
      });
    });

    it('on construction with entity category', () => {
      buildSubject('config');
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/select/device_topic_select/config', {
        availability_topic: 'device_topic/select/status',
        device: { ...testDevice.device },
        name: 'Select',
        options,
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/select/state',
        unique_id: 'test_name_select',
        command_topic: 'device_topic/select/command',
        entity_category: 'config',
      });
    });

    it('when status online is receieved', async () => {
      buildSubject();
      jest.runAllTimers();
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      await onFunc('online');
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/select/device_topic_select/config', {
        availability_topic: 'device_topic/select/status',
        device: { ...testDevice.device },
        name: 'Select',
        options,
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/select/state',
        unique_id: 'test_name_select',
        command_topic: 'device_topic/select/command',
      });
    });
  });

  it('subscribes to command on construction', () => {
    buildSubject();
    expect(mqtt.subscribe).toBeCalledWith('device_topic/select/command');
  });

  it('attaches event emitter on construction', () => {
    (mqtt.on as jest.Mock<any, any>).mockImplementationOnce((_command, _func) => {
      // noop
    });
    buildSubject();
    expect(mqtt.on).toBeCalledWith('device_topic/select/command', expect.anything());
  });

  describe('command handling', () => {
    let onFunc: ((state: string) => Promise<void>) | null = null;

    beforeEach(() => {
      onFunc = null;
      mocked(mqtt.on).mockImplementation((topic, func) => {
        if (topic !== 'homeassistant/status') onFunc = func;
      });
    });

    it.each(options)('published state %s when event handler is called', async (option) => {
      buildSubject();
      expect(mqtt.publish).not.toBeCalledWith('device_topic/select/state');
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      onChange.mockImplementation(() => {});
      await onFunc(option);
      expect(onChange).toBeCalledWith(option);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/select/state', option);
    });

    it('ignores unexpected payloads', async () => {
      buildSubject();
      expect(mqtt.publish).not.toBeCalledWith('device_topic/select/state');
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      await onFunc('UNSUPPORTED');
      expect(onChange).not.toBeCalled();
      jest.runAllTimers();
      expect(mqtt.publish).not.toBeCalledWith('device_topic/select/state', expect.anything());
    });
  });
});
