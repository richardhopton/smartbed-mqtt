import { Deferred } from '@utils/deferred';
import { wait } from '@utils/wait';

export class Timer {
  private finished = new Deferred<void>();
  private canceled = new Deferred<void>();
  private isCanceled = false;

  private waitAtEnd?: boolean;

  constructor(
    private onTick: () => void | Promise<void>,
    private count: number = 1,
    private waitTime?: number,
    private onFinish?: () => void | Promise<void>
  ) {
    this.waitAtEnd = this.count === 1 && !!this.waitTime;
  }

  extendCount = (count: number) => (this.count = count);

  start = async () => {
    while (this.count > 0) {
      try {
        const remainingCount = --this.count;

        const promises = [this.onTick()];

        if (this.waitTime && (remainingCount || this.waitAtEnd)) promises.push(wait(this.waitTime));
        await Promise.race([this.canceled, Promise.all(promises)]);
      } catch (err) {
        this.finished.reject(err);
      }
      if (this.isCanceled) break;
    }
    if (this.onFinish) await this.onFinish();
    this.finished.resolve();
  };

  cancel = async () => {
    this.canceled.resolve();
    this.isCanceled = true;
    this.count = 0;
    await this.finished;
  };
}
