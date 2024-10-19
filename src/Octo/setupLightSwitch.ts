import { Switch } from '@ha/Switch';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { BLEController } from 'BLE/BLEController';
import { buildEntityConfig } from 'Common/buildEntityConfig';
import { extractFeatureValuePairFromData } from './extractFeaturesFromData';
import { extractPacketFromMessage } from './extractPacketFromMessage';
import { Command } from './octo';

interface UnderBedLightEntities {
  underBedLights?: Switch;
}

export const setupLightSwitch = (
  mqtt: IMQTTConnection,
  controller: BLEController<Command | number[]>,
  initialLightState: boolean
) => {
  const { entities, deviceData, writeCommand } = controller;
  const cache = entities as UnderBedLightEntities;

  if (!cache.underBedLights) {
    const config = buildEntityConfig('UnderBedLights');
    const underBedLights = (cache.underBedLights = new Switch(mqtt, deviceData, config, async (state: boolean) => {
      await writeCommand({
        command: [0x20, 0x72],
        data: [0x00, 0x01, 0x02, 0x01, 0x01, 0x01, 0x01, state ? 0x01 : 0x00],
      });

      return state;
    }));
    controller.on('feedback', (message) => {
      const packet = extractPacketFromMessage(message);
      if (!packet) return;
      const { command, data } = packet;
      if (command[0] == 0x21 && command[1] == 0x71) {
        // feature
        const featureValuePair = extractFeatureValuePairFromData(data);
        if (!featureValuePair) return;
        const { feature, value } = featureValuePair;
        if (feature == 0x3) underBedLights.setState(value[0] == 0x01);
      }
    });
  }
  cache.underBedLights.setState(initialLightState);
};
