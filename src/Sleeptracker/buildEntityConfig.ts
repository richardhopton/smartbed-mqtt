export const buildEntityConfig = (entityName: string, sideName: string, category?: string) => ({
  description: sideName ? `${entityName}: ${sideName}` : entityName,
  category,
});
