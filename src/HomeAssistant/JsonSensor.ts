import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IDeviceData } from './IDeviceData';
import { Sensor } from './Sensor';
import { EntityConfig } from './base/Entity';

export class JsonSensor<T> extends Sensor<T> {
  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityConfig: EntityConfig,
    private valueField: string = 'value'
  ) {
    super(mqtt, deviceData, entityConfig);
  }

  mapState(state: T | undefined): any {
    return state === undefined ? {} : state;
  }

  discoveryState() {
    const value_template = [`default('')`];
    if (this.valueField) value_template.unshift(`value_json.${this.valueField}`);
    return {
      ...super.discoveryState(),
      value_template: `{{ ${value_template.join(' | ')} }}`,
      json_attributes_topic: this.stateTopic,
    };
  }
}
