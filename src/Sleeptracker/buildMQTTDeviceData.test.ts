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

  it('falls back to the processor id when the API omits the name (#97, #92, #90)', () => {
    const { device: result } = buildMQTTDeviceData({ ...device, name: null as unknown as string });

    expect(result.name).toEqual('Sleeptracker 1234567');
    expect(safeId(result.name)).toEqual('sleeptracker_1234567');
  });
});
