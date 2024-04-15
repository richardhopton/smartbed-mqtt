import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { IEventSource } from 'Common/IEventSource';
import { Remote } from './Remote';

export const setupLightEntities = (
  _mqtt: IMQTTConnection,
  _controller: IController<number> & IEventSource,
  remote: Remote
) => {
  if (remote.commands.UBL) {
    return;
    //   _controller.on('notify',
  }
};
/*
const notifyUblState = (bArr: number[], str: string) => {
  let z = true;
  if (str !== 'CU170') {
    if ((bArr[2] & bArr[6] & 0) == 0 && (bArr[3] & bArr[7] & 2) == 0 && (bArr[4] & bArr[8] & 0) == 0) {
      z = false;
    }
  } else {
    if (
      (bArr[2] & bArr[6] & 0) == 0 &&
      (bArr[3] & bArr[7] & 0) == 0 &&
      (bArr[4] & bArr[8] & 2) == 0 &&
      (bArr[9] & bArr[5] & 0) == 0
    ) {
      z = false;
    }
  }
  // this.isUblOn = z;
  // BLEServiceObserver bLEServiceObserver = this.stateObserver;
  // if (bLEServiceObserver == null) return;
  // bLEServiceObserver.onUblStateChanged(z);
};
*/
