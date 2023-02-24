export const safeId = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/__+/, '_');
};
