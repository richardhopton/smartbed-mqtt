import { Deferred } from '@utils/deferred';
import { wait } from '@utils/wait';

export class Timer {
  public done = new Deferred<void>();
  private canceled = new Deferred<void>();
  private isCanceled = false;

  private count: number;
  private waitTime?: number;
  private waitAtEnd?: boolean;
  private onFinish?: () => void | Promise<void>;

  constructor(
    private onTick: () => void | Promise<void>,
    options: {
      count?: number;
      waitTime?: number;
      onFinish?: () => void | Promise<void>;
    } = {}
  ) {
    this.count = options.count || 1;
    this.waitTime = options.waitTime;
    this.waitAtEnd = this.count === 1 && !!options.waitTime;
    this.onFinish = options.onFinish;

    void this.start();
  }

  start = async () => {
    while (this.count > 0) {
      try {
        const remainingCount = --this.count;

        const promises = [this.onTick()];
        if (this.waitTime && (remainingCount || this.waitAtEnd)) promises.push(wait(this.waitTime));
        await Promise.any([this.canceled, Promise.all(promises)]);
      } catch (err) {
        this.done.reject(err);
      }
      if (this.isCanceled) break;
    }
    if (this.onFinish && !this.isCanceled) await this.onFinish();
    this.done.resolve();
  };

  cancel = async () => {
    this.canceled.resolve();
    this.isCanceled = true;
    this.count = 0;
    await this.done;
  };
}
