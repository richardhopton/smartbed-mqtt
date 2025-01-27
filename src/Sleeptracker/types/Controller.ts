import { Dictionary } from '@utils/Dictionary';
import { Credentials } from '../options';
import { Capability } from './HelloData';

export type Controller = {
  user: Credentials;
  side: 0 | 1;
  sideName: string;
  entities: Dictionary<Object>;
  capability: Capability;
};
