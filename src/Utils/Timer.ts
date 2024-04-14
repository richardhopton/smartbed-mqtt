import { Deferred } from '@utils/deferred';
import { wait } from '@utils/wait';

export class Timer {
  public done = new Deferred<void>();
  private count: number = 1;
  private canceled = false;

  constructor(
    private onTick: () => void | Promise<void>,
    duration?: number,
    private frequency?: number,
    private onFinish?: () => void | Promise<void>,
    autoStart = true
  ) {
    if (duration && !frequency) frequency = 200;
    if (frequency) {
      if (!duration) duration = 10_000;
      this.count = Math.trunc(duration / frequency);
    }
    if (autoStart) void this.start();
  }

  start = async () => {
    while (this.count > 0) {
      try {
        await this.onTick();
      } catch (err) {
        this.done.reject(err);
      }
      if (--this.count > 0 && this.frequency) await wait(this.frequency);
    }
    if (this.onFinish && !this.canceled) await this.onFinish();
    this.done.resolve();
  };

  cancel = async () => {
    this.canceled = true;
    this.count = 0;
    await this.done;
  };
}
