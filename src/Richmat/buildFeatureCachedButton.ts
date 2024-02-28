import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { StringsKey } from '@utils/getString';
import { buildCachedButton } from 'Common/buildCachedButton';
import { Controller } from './types/Controller';
import { Features } from './types/Features';

export const buildFeatureCachedButton = (
  feature: Features,
  mqtt: IMQTTConnection,
  { hasFeature, ...controller }: Controller,
  name: StringsKey,
  command: number,
  category?: string
) => {
  if (hasFeature(feature)) buildCachedButton('Richmat', mqtt, controller, name, command, category);
};
