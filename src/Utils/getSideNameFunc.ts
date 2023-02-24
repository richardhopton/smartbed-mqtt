const sideNames = ['Left', 'Right'];
export const getSideNameFunc = <T>(items: T[], getSideId: (item: T) => 0 | 1) =>
  items.length === 1 ? () => '' : (item: T) => sideNames[getSideId(item)];
