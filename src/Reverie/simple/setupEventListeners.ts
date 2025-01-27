import { NumberSlider } from '@ha/NumberSlider';
import { PositionalCover } from '@ha/PositionalCover';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { ICache } from 'Common/ICache';
import { IEventSource } from 'Common/IEventSource';

interface Cache {
  headMotor?: PositionalCover;
  feetMotor?: PositionalCover;
  massageHead?: NumberSlider;
  massageFoot?: NumberSlider;
}

export const setupEventListeners = (_mqtt: IMQTTConnection, { on, cache }: IEventSource & ICache<Cache>) => {
  const { headMotor, feetMotor, massageHead, massageFoot } = cache;

  on('notify', (bytes) => {
    if (bytes.length !== 9) return;
    headMotor?.setPosition(bytes[2]);
    feetMotor?.setPosition(bytes[3]);
    massageHead?.setState(bytes[4]);
    massageFoot?.setState(bytes[5]);
  });
};
