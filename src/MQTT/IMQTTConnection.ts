export interface IMQTTConnection {
  unsubscribe(topic: string): void;
  on(event: string, listener: (this: IMQTTConnection, message: string) => void): this;
  off(event: string, listener: (this: IMQTTConnection, message: string) => void): this;
  publish(topic: string, message: any): void;
  subscribe(topic: string): void;
}
