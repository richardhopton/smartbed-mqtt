import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { Button } from './Button';

const mqtt: IMQTTConnection = mock<IMQTTConnection>();
const onPress = jest.fn();
const buildSubject = (isConfig = false) => new Button(mqtt, testDevice, 'Button', onPress, isConfig);

describe(Button.name, () => {
  beforeAll(() => jest.useFakeTimers());

  beforeEach(jest.resetAllMocks);

  it('publishes discovery on construction', () => {
    buildSubject();
    jest.runAllTimers();
    expect(mqtt.publish).toBeCalledWith('homeassistant/button/device_topic_button/config', {
      availability_topic: 'device_topic/button/status',
      device: { ...testDevice.device },
      name: 'Test Name Button',
      payload_available: 'online',
      payload_not_available: 'offline',
      unique_id: 'test_name_button',
      command_topic: 'device_topic/button/command',
    });
  });

  it('publishes discovery on construction with config entity category', () => {
    buildSubject(true);
    jest.runAllTimers();
    expect(mqtt.publish).toBeCalledWith('homeassistant/button/device_topic_button/config', {
      availability_topic: 'device_topic/button/status',
      device: { ...testDevice.device },
      name: 'Test Name Button',
      payload_available: 'online',
      payload_not_available: 'offline',
      unique_id: 'test_name_button',
      command_topic: 'device_topic/button/command',
      entity_category: 'config',
    });
  });

  it('subscribes to command on construction', () => {
    buildSubject();
    expect(mqtt.subscribe).toBeCalledWith('device_topic/button/command');
  });

  it('attaches event emitter on construction', () => {
    (mqtt.on as jest.Mock<any, any>).mockImplementationOnce((_command, _func) => {
      // noop
    });
    buildSubject();
    expect(mqtt.on).toBeCalledWith('device_topic/button/command', expect.anything());
  });

  describe('command handling', () => {
    let onFunc: ((state: string) => void) | null = null;

    beforeEach(() => {
      onFunc = null;
      mocked(mqtt.on).mockImplementationOnce((_, func) => {
        onFunc = func;
      });
    });

    it('onPress called when event handler is called', () => {
      buildSubject();
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      onFunc('PRESS');
      expect(onPress).toBeCalled();
    });

    it('ignores unexpected payloads', () => {
      buildSubject();
      expect(onFunc).not.toBeNull();
      if (!onFunc) return;

      jest.resetAllMocks();
      onFunc('UNSUPPORTED');
      expect(onPress).not.toBeCalled();
    });
  });
});
