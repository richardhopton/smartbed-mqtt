import { Light, LightState } from '@ha/Light';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { getString } from '@utils/getString';
import { IController } from 'Common/IController';
import { IEventSource } from 'Common/IEventSource';
import { Commands } from './Commands';

const WHITE = { r: 255, g: 255, b: 255 };
const DEFAULT_STATE = { color: WHITE, brightness: 255 };

interface LightEntities {
  underBedLights?: Light;
}

export const setupLightEntities = (mqtt: IMQTTConnection, controller: IController<number[]> & IEventSource) => {
  const { deviceData, entities, writeCommand } = controller;
  const cache = entities as LightEntities;

  if (!cache.underBedLights) {
    const light = (cache.underBedLights = new Light(
      mqtt,
      deviceData,
      {
        supportsBrightness: true,
        supportsRGB: true,
        description: getString('UnderBedLights'),
      },
      async (state) => {
        const oldState: LightState = light.getState() || {};
        const newState = { ...DEFAULT_STATE, ...oldState, ...state };
        try {
          if (!newState.status) return void (await writeCommand(Commands.RGBOff));
          const {
            color: { r, g, b },
            brightness,
          } = newState;
          await writeCommand(Commands.RGBSet(r, g, b, brightness));
        } finally {
          return newState;
        }
      }
    ).setOnline());
    controller.on('read', (data: Uint8Array) => {
      const [status, r, g, b, brightness] = data.slice(6, 11);
      light.setState(
        status === 0x1
          ? { status: true, brightness, color: { r, g, b } }
          : { ...(light.getState() || {}), status: false }
      );
    });
  }
};
