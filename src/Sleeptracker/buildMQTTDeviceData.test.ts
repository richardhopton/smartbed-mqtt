import { safeId } from '@utils/safeId';
import { buildMQTTDeviceData } from './buildMQTTDeviceData';
import { Device } from './types/Device';

const device = {
  sleeptrackerProcessorID: 1234567,
  modelID: 'STS60',
  mattressBrandName: 'Tempur-Pedic',
} as Device;

describe(buildMQTTDeviceData.name, () => {
  it('uses the name the API supplied', () => {
    const { device: result } = buildMQTTDeviceData({ ...device, name: 'Bedroom' });

    expect(result.name).toEqual('Bedroom');
    expect(safeId(result.name)).toEqual('bedroom');
  });

  // Documents the mechanism behind #97: whatever buildMQTTDeviceData puts in
  // device.name reaches safeId unguarded from Entity's constructor.
  it('crashes the way #97 reports when the name reaches safeId as null', () => {
    expect(() => safeId(null as unknown as string)).toThrow(
      "Cannot read properties of null (reading 'toLowerCase')"
    );
  });

  // Accounts created through Sleeptracker's "Add Second Sleeper" invite flow come
  // back with a null name, because the bed is named by whoever registered the
  // processor. Entity's constructor passes device.name straight to safeId, so the
  // null crashed the add-on on the first entity it built.
  it('falls back to the processor id when the API omits the name', () => {
    const { device: result } = buildMQTTDeviceData({ ...device, name: null as unknown as string });

    expect(result.name).toEqual('Sleeptracker 1234567');
    expect(safeId(result.name)).toEqual('sleeptracker_1234567');
  });
});
