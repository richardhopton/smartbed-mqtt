import { IDeviceData } from '@ha/IDeviceData';
import { PositionalCover } from '@ha/PositionalCover';
import { EntityConfig } from '@ha/base/Entity';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { wait } from '@utils/wait';

export class BedPositionCover extends PositionalCover {
  private targetPosition: number | undefined;
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, config: EntityConfig, maxPosition: number) {
    super(mqtt, deviceData, config, (position: number) => this.setTargetPosition(position), {
      positionOpen: maxPosition,
    });
  }

  async setTargetPosition(targetPosition: number) {
    this.targetPosition = targetPosition;
    while (this.targetPosition !== this.getPosition()) {
      const position = this.getPosition();
      const delta = this.targetPosition - position;
      const deltaAbs = Math.abs(delta);
      const direction = delta / deltaAbs;
      let offset = 100;
      while (deltaAbs < offset) {
        offset /= 10;
      }
      this.setPosition(position + direction * offset);
      await wait(300);
    }
  }
}
