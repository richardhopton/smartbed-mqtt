import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { mocked, testDevice } from '@utils/testHelpers';
import { mock } from 'jest-mock-extended';
import { loadStrings } from '@utils/getString';
import { Bed } from 'Sleeptracker/types/Bed';
import { Capability } from 'Sleeptracker/types/HelloData';
import { Controller } from 'Sleeptracker/types/Controller';
import { setupMotorEntities } from './motorEntities';

const mqtt = mock<IMQTTConnection>();

const buildCapability = (side: 0 | 1): Capability => ({
  controllerModel: 'test',
  controllerVersion: 1,
  massageRoster: { foot: false, head: false, headTilt: false, lumber: false },
  memSlotCount: 0,
  motorRoster: { foot: true, head: true, headTilt: false, lumber: false },
  side,
});

const buildController = (side: 0 | 1, sideName: string): Controller => ({
  user: { email: 'email', password: 'password' },
  side,
  sideName,
  entities: {},
  capability: buildCapability(side),
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

  // Both sides of a split-king share one processor (one device), so their motor
  // covers must carry the side in unique_id/topic or they collide and only one
  // side's covers reach Home Assistant.
  it('suffixes the side name onto each cover for a dual-controller bed', async () => {
    await setupMotorEntities(mqtt, bed, buildController(1, 'Right'));
    await setupMotorEntities(mqtt, bed, buildController(0, 'Left'));
    jest.runAllTimers();

    const ids = coverUniqueIds();
    expect(ids).toEqual(
      expect.arrayContaining(['test_name_head_right', 'test_name_feet_right', 'test_name_head_left', 'test_name_feet_left'])
    );
    // Regression: no two covers may share a unique_id (the collision bug).
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('omits the side suffix for a single-controller bed', async () => {
    await setupMotorEntities(mqtt, bed, buildController(0, ''));
    jest.runAllTimers();

    const ids = coverUniqueIds();
    expect(ids).toEqual(expect.arrayContaining(['test_name_head', 'test_name_feet']));
  });
});
