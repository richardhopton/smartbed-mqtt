export interface IStateful<T> {
  setState(state: T | null): void;
  getState(): T | undefined;
}
