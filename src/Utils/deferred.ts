type Resolver<T> = (value: T | PromiseLike<T>) => void;
type Rejector = (reason?: any) => void;

export class Deferred<T> extends Promise<T> {
  public resolve: Resolver<T>;
  public reject: Rejector;

  constructor(deferred = (_resolve: Resolver<T>, _reject: Rejector) => {}) {
    let _resolve: Resolver<T>;
    let _reject: Rejector;

    super((resolve, reject) => {
      deferred(resolve, reject);

      _resolve = resolve;
      _reject = reject;
    });

    this.resolve = _resolve!;
    this.reject = _reject!;
  }
}
