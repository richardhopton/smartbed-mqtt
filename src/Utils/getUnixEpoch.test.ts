import { getUnixEpoch } from './getUnixEpoch';

describe(getUnixEpoch.name, () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it.each([
    [1672531200, '2023-01-01'],
    [1590969600, '2020-06-01'],
  ])('returns %s if date is %s', (expected, date) => {
    jest.setSystemTime(new Date(date));
    const result = getUnixEpoch();
    expect(result).toEqual(expected);
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
