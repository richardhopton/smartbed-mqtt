import { StringsKey, getString } from '@utils/getString';

export const buildEntityConfig = (key: StringsKey, category?: string) => ({
  description: getString(key),
  category,
});
