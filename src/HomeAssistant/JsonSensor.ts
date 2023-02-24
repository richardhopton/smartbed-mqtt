import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { IDeviceData } from './IDeviceData';
import { Sensor } from './Sensor';

export class JsonSensor<T> extends Sensor<T> {
  constructor(
    mqtt: IMQTTConnection,
    deviceData: IDeviceData,
    entityDesc: string,
    private valueField: string = 'value',
    private isDiagnostic = false
  ) {
    super(mqtt, deviceData, entityDesc);
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
      ...(this.isDiagnostic ? { entity_category: 'diagnostic' } : {}),
    };
  }
}
