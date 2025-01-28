import { Select } from '@ha/Select';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IEventSource } from 'Common/IEventSource';
import { Light } from '@ha/Light';
import { ICache } from 'Common/ICache';
import { massageOptions } from './massageOptions';
import { massageWaveOptions } from './massageWaveOptions';

interface Cache {
  massageHead?: Select;
  massageFoot?: Select;
  massageWave?: Select;
  underBedLights?: Light;
}

export const setupEventListeners = (
  _mqtt: IMQTTConnection,
  { cache: { massageHead, massageFoot, massageWave, underBedLights }, on }: ICache<Cache> & IEventSource
) => {
  on('read', (data: Uint8Array) => {
    const head = data[2] - 0x40;
    if ((head & 0x80) === 0x0) {
      massageHead?.setState(massageOptions[0]);
    } else {
      const strength = head - 0x80;
      massageHead?.setState(massageOptions[strength + 1]);
    }

    const foot = data[3] - 0x40;
    if ((foot & 0x80) === 0x0) {
      massageFoot?.setState(massageOptions[0]);
    } else {
      const strength = foot - 0x80;
      massageFoot?.setState(massageOptions[strength + 1]);
    }

    const wave = data[0];
    if ((wave & 0x2) === 0x2) {
      massageWave?.setState(massageWaveOptions[0]);
    } else {
      const level = wave / 0x10;
      massageWave?.setState(massageWaveOptions[level + 1]);
    }

    const [status, r, g, b, brightness] = data.slice(6, 11);
    underBedLights?.setState(
      status === 0x1
        ? { status: true, brightness, color: { r, g, b } }
        : { ...(underBedLights.getState() || {}), status: false }
    );
  });
};
