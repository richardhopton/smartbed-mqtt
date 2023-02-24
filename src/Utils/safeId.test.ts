import { safeId } from './safeId';

describe(safeId.name, () => {
  it.each([
    ['', ''],
    ['VALUE', 'value'],
    ['value', 'value'],
    ['test value', 'test_value'],
    ['test-value', 'test_value'],
    ['test - value', 'test_value'],
    ['test - \\/=+value', 'test_value'],
  ])("handles '%s' and returns '%s'", (value, expected) => {
    const result = safeId(value);
    expect(result).toEqual(expected);
  });
});
