import { cleanJsonState } from './cleanJsonState';
import { getUnixEpoch } from './getUnixEpoch';

describe(cleanJsonState.name, () => {
  it.each([
    [{}, '', "''"],
    [null, 'any string', ''],
  ])('should return %s if passed undefined with parent of %s%s', (expected, parentKey, _) => {
    const actual = cleanJsonState(undefined, [], parentKey);
    expect(actual).toEqual(expected);
  });

  it('should handle simple objects', () => {
    const nowSecs = getUnixEpoch();
    const expected = { value: 10, lastUpdate: new Date(nowSecs * 1000).toISOString(), type: 'degreesCelsius' };
    const state = { value: 10, lastUpdateGMTSecs: nowSecs, type: 'degreesCelsius' };
    const actual = cleanJsonState(state);
    expect(actual).toEqual(expected);
  });

  it('should handle complex objects', () => {
    const nowSecs = getUnixEpoch();
    const expected = {
      test: { value: 10, lastUpdate: new Date(nowSecs * 1000).toISOString(), type: 'degreesCelsius' },
      tests: [{ lastUpdate: new Date(nowSecs * 1000).toISOString() }],
    };
    const state = {
      test: { value: 10, lastUpdateGMTSecs: nowSecs, type: 'degreesCelsius' },
      tests: [{ timeLastUpdate: nowSecs }],
    };
    const actual = cleanJsonState(state);
    expect(actual).toEqual(expected);
  });

  it('properly cases with stripping gmt from beginning', () => {
    const nowSecs = getUnixEpoch();
    const expected = { lastUpdate: new Date(nowSecs * 1000).toISOString() };
    const state = { gmtLastUpdate: nowSecs };
    const actual = cleanJsonState(state);
    expect(actual).toEqual(expected);
  });

  it('properly cases with stripping time from beginning', () => {
    const nowSecs = getUnixEpoch();
    const expected = { lastUpdate: new Date(nowSecs * 1000).toISOString() };
    const state = { timeLastUpdate: nowSecs };
    const actual = cleanJsonState(state);
    expect(actual).toEqual(expected);
  });

  it('properly trims Gmt from end', () => {
    const nowSecs = getUnixEpoch();
    const expected = { lastUpdate: new Date(nowSecs * 1000).toISOString() };
    const state = { lastUpdateGmt: nowSecs };
    const actual = cleanJsonState(state);
    expect(actual).toEqual(expected);
  });

  it('should strip GmtString fields', () => {
    const expected = { value: 10 };
    const state = { value: 10, someRandomGmtString: 'degreesCelsius' };
    const actual = cleanJsonState(state);
    expect(actual).toEqual(expected);
  });

  it('should convert localTimeNow field based on gmtOffset', () => {
    const gmtOffset = -28800;
    const localTimeNow = 1676751261;
    const state = { gmtOffset, localTimeNow };
    const actual = cleanJsonState(state);
    expect(actual).toEqual({ localTimeNow: '2023-02-18T20:14:21.000-0800', gmtOffset });
  });

  it('should handle cableTime field', () => {
    const nowSecs = getUnixEpoch();
    const expected = { cableTime: new Date(nowSecs * 1000).toISOString() };
    const state = { cableTime: nowSecs };
    const actual = cleanJsonState(state);
    expect(actual).toEqual(expected);
  });

  it('should strip unwanted fields', () => {
    const expected = {
      child: { value: 10 },
    };
    const state = { outerType: 'temperature', child: { value: 10, type: 'degreesCelsius' } };
    const actual = cleanJsonState(state, ['outerType', 'child.type']);
    expect(actual).toEqual(expected);
  });

  it('should handle simple arrays', () => {
    const expected = {
      productFeatures: ['api_flan_config_all', 'sleepz', 'motors', 'env_sensors'],
      values: [1, 2, 3],
    };
    const actual = cleanJsonState(expected);
    expect(actual).toEqual(expected);
  });
});
