import { joinNonEmpty } from './joinNonEmpty';

describe(joinNonEmpty.name, () => {
  it('handles no items', () => {
    const result = joinNonEmpty('.');
    expect(result).toEqual('');
  });

  it.each([
    [['item'], '.', 'item'],
    [['item1', 'item2'], '.', 'item1.item2'],
    [['item1', 'item2'], ',', 'item1,item2'],
    [['item1', '', 'item3'], '.', 'item1.item3'],
    [[null, undefined, ''], '.', ''],
    [[1, 2, true, [1, 2]], '.', '1.2.true.1,2'],
  ])('handles %s with $s separator returns %s', (items, separator, expected) => {
    const result = joinNonEmpty(separator, ...items);
    expect(result).toEqual(expected);
  });
});
