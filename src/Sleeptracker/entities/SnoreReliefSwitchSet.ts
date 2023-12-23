import { IDeviceData } from '@ha/IDeviceData';
import { Switch } from '@ha/Switch';
import { IStateful } from '@ha/base/IStateful';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { buildEntityConfig } from 'Sleeptracker/buildEntityConfig';
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
    this.tilt = new Switch(mqtt, deviceData, buildEntityConfig('Snore Relief Tilt', sideName, 'config'), (state) =>
      onChange({ ...this.getState(), snoreReliefTilt: state })
    );
    this.vibration = new Switch(
      mqtt,
      deviceData,
      buildEntityConfig('Snore Relief Vibration', sideName, 'config'),
      (state) => onChange({ ...this.getState(), snoreReliefVibration: state })
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
