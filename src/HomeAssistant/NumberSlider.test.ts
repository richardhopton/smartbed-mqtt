import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { NumberSlider, NumberSliderConfig } from './NumberSlider';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const onChange = jest.fn();
const buildSubject = (config: { category?: string } & NumberSliderConfig = {}) =>
  new NumberSlider(mqtt, testDevice, { description: 'Number Slider', ...config }, async (state) => {
    onChange(state);
  });

describe(NumberSlider.name, () => {
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
      expect(mqtt.publish).toBeCalledWith('homeassistant/number/device_topic_number_slider/config', {
        availability_topic: 'device_topic/number_slider/status',
        device: { ...testDevice.device },
        min: 0,
        max: 100,
        mode: 'slider',
        name: 'Number Slider',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/number_slider/state',
        unique_id: 'test_name_number_slider',
        command_topic: 'device_topic/number_slider/command',
      });
    });

    it('on construction with entity category', () => {
      buildSubject({ category: 'config' });
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/number/device_topic_number_slider/config', {
        availability_topic: 'device_topic/number_slider/status',
        device: { ...testDevice.device },
        min: 0,
        max: 100,
        mode: 'slider',
        name: 'Number Slider',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/number_slider/state',
        unique_id: 'test_name_number_slider',
        command_topic: 'device_topic/number_slider/command',
        entity_category: 'config',
      });
    });

    it('on construction with config', () => {
      buildSubject({ min: 1, max: 64, icon: 'mdi:waves-arrow-right' });
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('homeassistant/number/device_topic_number_slider/config', {
        availability_topic: 'device_topic/number_slider/status',
        device: { ...testDevice.device },
        icon: 'mdi:waves-arrow-right',
        min: 1,
        max: 64,
        mode: 'slider',
        name: 'Number Slider',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/number_slider/state',
        unique_id: 'test_name_number_slider',
        command_topic: 'device_topic/number_slider/command',
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
      expect(mqtt.publish).toBeCalledWith('homeassistant/number/device_topic_number_slider/config', {
        availability_topic: 'device_topic/number_slider/status',
        device: { ...testDevice.device },
        min: 0,
        max: 100,
        mode: 'slider',
        name: 'Number Slider',
        payload_available: 'online',
        payload_not_available: 'offline',
        state_topic: 'device_topic/number_slider/state',
        unique_id: 'test_name_number_slider',
        command_topic: 'device_topic/number_slider/command',
      });
    });
  });

  it('subscribes to command on construction', () => {
    buildSubject();
    expect(mqtt.subscribe).toBeCalledWith('device_topic/number_slider/command');
  });

  it('attaches event emitter on construction', () => {
    (mqtt.on as jest.Mock<any, any>).mockImplementationOnce((_command, _func) => {
      // noop
    });
    buildSubject();
    expect(mqtt.on).toBeCalledWith('device_topic/number_slider/command', expect.anything());
  });

  describe('command handling', () => {
    let onFunc: ((state: string) => Promise<void>) | null = null;

    beforeEach(() => {
      onFunc = null;
      mocked(mqtt.on).mockImplementation((topic, func) => {
        if (topic !== 'homeassistant/status') onFunc = func;
      });
    });

    it.each([
      ['2', 2, '2'],
      ['20', 20, '20'],
    ])('published state %s when event handler is called', async (payload, state, expectedPublish) => {
      buildSubject();
      expect(mqtt.publish).not.toBeCalledWith('device_topic/number_slider/state');
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      onChange.mockImplementation(() => {});
      await onFunc(payload);
      expect(onChange).toBeCalledWith(state);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/number_slider/state', expectedPublish);
    });

    it('ignores unexpected payloads', async () => {
      buildSubject();
      expect(mqtt.publish).not.toBeCalledWith('device_topic/number_slider/state');
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      await onFunc('UNSUPPORTED');
      expect(onChange).not.toBeCalled();
      jest.runAllTimers();
      expect(mqtt.publish).not.toBeCalledWith('device_topic/number_slider/state', expect.anything());
    });
  });
  describe('call setState', () => {
    const entity = buildSubject();

    it.each([
      ['5', 5],
      ['10', 10],
    ])('publishes state %s when setState called with %s', (expected, state) => {
      entity.setState(state);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/number_slider/state', expected);
    });

    it('publishes available offline when setState called with null', () => {
      entity.setState(null);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/number_slider/status', 'offline');
      expect(mqtt.publish).not.toBeCalledWith('device_topic/number_slider/state', null);
    });
  });
});
