import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { Switch } from './Switch';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const onChange = jest.fn();
const buildSubject = (isConfig = false) =>
  new Switch(
    mqtt,
    testDevice,
    'Switch',
    async (state) => {
      onChange(state);
    },
    isConfig
  );

describe(Switch.name, () => {
  beforeAll(() => jest.useFakeTimers());

  beforeEach(jest.resetAllMocks);

  it('publishes discovery on construction', () => {
    buildSubject();
    jest.runAllTimers();
    expect(mqtt.publish).toBeCalledWith('homeassistant/switch/device_topic_switch/config', {
      availability_topic: 'device_topic/switch/status',
      device: { ...testDevice.device },
      name: 'Test Name Switch',
      payload_available: 'online',
      payload_not_available: 'offline',
      state_topic: 'device_topic/switch/state',
      unique_id: 'test_name_switch',
      command_topic: 'device_topic/switch/command',
    });
  });

  it('publishes discovery on construction with entity category', () => {
    buildSubject(true);
    jest.runAllTimers();
    expect(mqtt.publish).toBeCalledWith('homeassistant/switch/device_topic_switch/config', {
      availability_topic: 'device_topic/switch/status',
      device: { ...testDevice.device },
      name: 'Test Name Switch',
      payload_available: 'online',
      payload_not_available: 'offline',
      state_topic: 'device_topic/switch/state',
      unique_id: 'test_name_switch',
      command_topic: 'device_topic/switch/command',
      entity_category: 'config',
    });
  });

  it('subscribes to command on construction', () => {
    buildSubject();
    expect(mqtt.subscribe).toBeCalledWith('device_topic/switch/command');
  });

  it('attaches event emitter on construction', () => {
    (mqtt.on as jest.Mock<any, any>).mockImplementationOnce((_command, _func) => {
      // noop
    });
    buildSubject();
    expect(mqtt.on).toBeCalledWith('device_topic/switch/command', expect.anything());
  });

  describe('command handling', () => {
    let onFunc: ((state: string) => Promise<void>) | null = null;

    beforeEach(() => {
      onFunc = null;
      mocked(mqtt.on).mockImplementationOnce((_, func) => {
        onFunc = func;
      });
    });

    it.each([
      ['ON', true, 'ON'],
      ['OFF', false, 'OFF'],
    ])('published state %s when event handler is called', async (payload, state, expectedPublish) => {
      buildSubject();
      expect(mqtt.publish).not.toBeCalledWith('device_topic/switch/state');
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      onChange.mockImplementation(() => {});
      await onFunc(payload);
      expect(onChange).toBeCalledWith(state);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/switch/state', expectedPublish);
    });

    it('ignores unexpected payloads', () => {
      buildSubject();
      expect(mqtt.publish).not.toBeCalledWith('device_topic/switch/state');
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      onFunc('UNSUPPORTED');
      expect(onChange).not.toBeCalled();
      jest.runAllTimers();
      expect(mqtt.publish).not.toBeCalledWith('device_topic/switch/state', expect.anything());
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
      expect(mqtt.publish).toBeCalledWith('device_topic/switch/state', expected);
    });

    it('publishes available offline when setState called with null', () => {
      entity.setState(null);
      jest.runAllTimers();
      expect(mqtt.publish).toBeCalledWith('device_topic/switch/status', 'offline');
      expect(mqtt.publish).not.toBeCalledWith('device_topic/switch/state', null);
    });
  });
});
