import { wait } from '@utils/wait';

export const loopWithWait = async <TItem>(items: TItem[], body: (item: TItem) => Promise<void>, delay: number = 50) => {
  let itemsLeft = items.length;
  for (const item of items) {
    await body(item);
    if (--itemsLeft) await wait(delay);
  }
};
