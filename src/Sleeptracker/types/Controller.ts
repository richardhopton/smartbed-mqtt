import { Entity } from '@ha/base/Entity';
import { Dictionary } from '@utils/Dictionary';
import { Credentials } from '@utils/Options';
import { Capability } from './HelloData';

export type Controller = {
  user: Credentials;
  side: 0 | 1;
  sideName: string;
  entities: Dictionary<Entity>;
  capability: Capability;
};
