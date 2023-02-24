export const buildEntityName = (entityName: string, sideName: string) =>
  sideName ? `${entityName}: ${sideName}` : entityName;
