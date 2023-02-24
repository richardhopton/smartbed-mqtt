import { notEmpty } from './notEmpty';

describe(notEmpty.name, () => {
  it.each([
    [null, false],
    [undefined, false],
    ['', true],
    [0, true],
  ])('handles %s and returns %s', (value, expected) => {
    const result = notEmpty(value);
    expect(result).toBe(expected);
  });
});
