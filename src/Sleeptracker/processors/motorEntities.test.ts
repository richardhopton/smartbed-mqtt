import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { loadStrings } from '@utils/getString';
import { Bed } from 'Sleeptracker/types/Bed';
import { Capability } from 'Sleeptracker/types/HelloData';
import { Controller } from 'Sleeptracker/types/Controller';
import { setupMotorEntities } from './motorEntities';

const mqtt = mock<IMQTTConnection>();

const buildCapability = (side: 0 | 1, motorOverrides: Partial<Capability['motorRoster']> = {}): Capability => ({
  controllerModel: 'test',
  controllerVersion: 1,
  massageRoster: { foot: false, head: false, headTilt: false, lumber: false },
  memSlotCount: 0,
  motorRoster: { foot: true, head: true, headTilt: false, lumber: false, ...motorOverrides },
  side,
});

const buildController = (
  side: 0 | 1,
  sideName: string,
  motorOverrides: Partial<Capability['motorRoster']> = {}
): Controller => ({
  user: { email: 'email', password: 'password' },
  side,
  sideName,
  entities: {},
  capability: buildCapability(side, motorOverrides),
});

const bed = { deviceData: testDevice } as unknown as Bed;

const coverUniqueIds = () =>
  mocked(mqtt.publish)
    .mock.calls.filter(([topic]) => typeof topic === 'string' && topic.startsWith('homeassistant/cover/'))
    .map(([, config]) => (config as { unique_id: string }).unique_id);

describe(setupMotorEntities.name, () => {
  beforeAll(async () => {
    await loadStrings();
    jest.useFakeTimers();
  });
  beforeEach(jest.resetAllMocks);

  it('suffixes the side name onto each cover for a dual-controller bed (#94, #95)', async () => {
    await setupMotorEntities(mqtt, bed, buildController(1, 'Right'));
    await setupMotorEntities(mqtt, bed, buildController(0, 'Left'));
    jest.runAllTimers();

    const ids = coverUniqueIds();
    expect(ids).toEqual(
      expect.arrayContaining([
        'test_name_head_right',
        'test_name_feet_right',
        'test_name_head_left',
        'test_name_feet_left',
      ])
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('omits the side suffix for a single-controller bed', async () => {
    await setupMotorEntities(mqtt, bed, buildController(0, ''));
    jest.runAllTimers();

    const ids = coverUniqueIds();
    expect(ids).toEqual(expect.arrayContaining(['test_name_head', 'test_name_feet']));
  });

  it('supports both lumbar and legacy lumber field names (#58, #63)', async () => {
    await setupMotorEntities(mqtt, bed, buildController(0, 'Left', { lumbar: true }));
    await setupMotorEntities(mqtt, bed, buildController(1, 'Right', { lumber: true }));
    jest.runAllTimers();

    const ids = coverUniqueIds();
    expect(ids).toEqual(expect.arrayContaining(['test_name_lumbar_left', 'test_name_lumbar_right']));
  });
});
