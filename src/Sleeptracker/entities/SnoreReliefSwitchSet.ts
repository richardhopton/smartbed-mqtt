import { IStateful } from '@ha/base/IStateful';
import { IDeviceData } from '@ha/IDeviceData';
import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityName } from '@utils/buildEntityName';
import { SnoreRelief } from '../types/SnoreRelief';

export class SnoreReliefSwitchSet implements IStateful<SnoreRelief> {
  private tilt: Switch;
  private vibration: Switch;

  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    sideName: string,
    onChange: (value: SnoreRelief) => Promise<void>
  ) {
    this.tilt = new Switch(
      mqtt,
      deviceData,
      buildEntityName('Snore Relief Tilt', sideName),
      (state) => onChange({ ...this.getState(), snoreReliefTilt: state }),
      true
    );
    this.vibration = new Switch(
      mqtt,
      deviceData,
      buildEntityName('Snore Relief Vibration', sideName),
      (state) => onChange({ ...this.getState(), snoreReliefVibration: state }),
      true
    );
  }

  setState(state: SnoreRelief | null): void {
    if (state === null) {
      this.tilt.setOffline();
      this.vibration.setOffline();
      return;
    }
    this.tilt.setState(state.snoreReliefTilt);
    this.vibration.setState(state.snoreReliefVibration);
  }

  getState(): SnoreRelief {
    const snoreReliefTilt = this.tilt.getState() || false;
    const snoreReliefVibration = this.vibration.getState() || false;

    return { snoreReliefTilt, snoreReliefVibration };
  }
}
