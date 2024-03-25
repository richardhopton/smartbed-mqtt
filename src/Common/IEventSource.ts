export interface IEventSource {
  on(eventName: string, handler: (data: Uint8Array) => void): this;
}
