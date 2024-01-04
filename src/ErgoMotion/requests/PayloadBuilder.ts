import { intToBytes } from '@utils/intToBytes';
import { shortToBytes } from '@utils/shortToBytes';

export class PayloadBuilder {
  bytes: number[];
  length: number;

  constructor(length: number, type: number) {
    this.bytes = new Array(length);
    this.length = 0;
    this.addByte((type << 4) | 3);
    this.addInt(length);
  }

  addByte(byte: number) {
    const position = (this.length += 1) - 1;
    this.bytes[position] = byte;
    return this;
  }

  addBytes(bytes: number[]) {
    let position = (this.length += bytes.length) - bytes.length;
    for (const byte of bytes) {
      this.bytes[position] = byte;
      position++;
    }
    return this;
  }

  addInt(value: number) {
    return this.addBytes(intToBytes(value));
  }

  addShort(value: number) {
    return this.addBytes(shortToBytes(value));
  }

  addString(value: string) {
    return this.addBytes([...Buffer.from(value)]);
  }

  build() {
    return new Uint8Array(this.bytes.slice(0, this.length));
  }
}
