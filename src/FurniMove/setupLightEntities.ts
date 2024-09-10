import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IController } from 'Common/IController';
import { IEventSource } from 'Common/IEventSource';
import { buildCommandButton } from 'Common/buildCommandButton';
import { Remote } from './Remote';

export const setupLightEntities = (
  mqtt: IMQTTConnection,
  controller: IController<number> & IEventSource,
  remote: Remote
) => {
  const ublCommand = remote.commands.UBL;
  if (ublCommand) {
    if (typeof ublCommand === 'number')
      buildCommandButton('FurniMove', mqtt, controller, 'UnderBedLightsToggle', ublCommand);
    controller.on('feedback', () => {});
    return;
  }
};

/*
const notifyUblState = (bArr: number[], str: string) => {
  const lightStatus =
    !(bArr[2] & bArr[6] & 0) ||
    !(bArr[3] & bArr[7] & 2) ||
    !(bArr[4] & bArr[8] & 0) ||
    (str === 'CU170' && !(bArr[9] & bArr[5] & 0));
  console.log(lightStatus);
  // this.isUblOn = z;
  // BLEServiceObserver bLEServiceObserver = this.stateObserver;
  // if (bLEServiceObserver == null) return;
  // bLEServiceObserver.onUblStateChanged(z);
};
*/
/*

function notifyUblState(r11: number[], str: string): void {
    return (str === "CU170"
            ? (r11[4] & r11[8] & 2)
            : (r11[3] & r11[7] & 2)) === 0;
}



const notifyUblState = (r11: number[], str: string): boolean =>
    (str === "CU170"        ? r11[4] & r11[8] & 2        : r11[3] & r11[7] & 2) === 0;


*/
