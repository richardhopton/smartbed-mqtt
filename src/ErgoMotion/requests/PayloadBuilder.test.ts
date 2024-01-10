import { PayloadBuilder } from './PayloadBuilder';

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
});
