export function groupBy1<K extends string | number, V, T>(
  array: V[],
  groupingFn: (value: V) => K,
  valueMapper: (value: V) => T
): { [index in K]: T };

export function groupBy1<K extends string | number, V>(
  array: V[],
  groupingFn: (value: V) => K
): { [index in K]: V };

export function groupBy1<K extends string | number, V, T>(
  array: V[],
  groupingFn: (value: V) => K,
  valueMapper?: (value: V) => T
): any {
  const empty = {} as { [index in K]: T };
  const mapValue = valueMapper || ((v) => v);
  return array.reduce(
    (acc, x) => ({ ...acc, [groupingFn(x)]: mapValue(x) }),
    empty
  );
}
