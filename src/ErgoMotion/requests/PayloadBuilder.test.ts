import { Commands } from '../types/Commands';
import { PayloadBuilder } from './PayloadBuilder';
import { getCommandBytes } from './sendBedCommand';

const headerBytes = [0x13, 0x0, 0x0, 0x0, 0x1a];
describe(PayloadBuilder.name, () => {
  it('it handles header bytes', () => {
    const bytes = new PayloadBuilder(26, 1).build();
    expect(bytes).toEqual(new Uint8Array(headerBytes));
  });

  it('it handles adding byte', () => {
    const bytes = new PayloadBuilder(26, 1).addByte(3).build();
    expect(bytes).toEqual(new Uint8Array([...headerBytes, 0x3]));
  });

  it('it handles adding bytes', () => {
    const bytes = new PayloadBuilder(26, 1).addBytes([4, 5, 6]).build();
    expect(bytes).toEqual(new Uint8Array([...headerBytes, 0x4, 0x5, 0x6]));
  });

  it('it handles adding int', () => {
    const bytes = new PayloadBuilder(26, 1).addInt(128).build();
    expect(bytes).toEqual(new Uint8Array([...headerBytes, 0x0, 0x0, 0x0, 0x80]));
  });

  it('it handles adding short', () => {
    const bytes = new PayloadBuilder(26, 1).addShort(64).build();
    expect(bytes).toEqual(new Uint8Array([...headerBytes, 0x0, 0x40]));
  });

  it('it handles adding string', () => {
    const bytes = new PayloadBuilder(26, 1).addString('test').build();
    expect(bytes).toEqual(new Uint8Array([...headerBytes, 0x74, 0x65, 0x73, 0x74]));
  });

  it('tests', () => {
    const bytes = new PayloadBuilder(16 + 5, 8)
      .addShort(123)
      .addShort(11)
      .addByte(0)
      .addBytes(getCommandBytes(Commands.PresetZeroG))
      .build();
    const value = Array.from(bytes, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
    expect(value).toEqual('8300000015007b000b00aa03000f00122334450000040100100000ea4055');
  });
});
