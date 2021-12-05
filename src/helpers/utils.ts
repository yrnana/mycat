import {
  camelCase,
  isArray,
  isEmpty,
  isObjectLike,
  isPlainObject,
  map,
  set,
  transform,
} from 'lodash-es';

export function toCamelCase<T extends Record<string, unknown>>(
  root: unknown,
): T {
  function createIteratee(converter: (node: unknown) => unknown) {
    return (result: Record<string, unknown>, value: unknown, key: string) =>
      set(
        result,
        camelCase(key),
        isObjectLike(value) ? converter(value) : value,
      );
  }

  function humps(node: unknown): unknown {
    if (isArray(node)) return map(node as unknown[], humps);
    if (isPlainObject(node)) {
      if (isEmpty(node)) return node;
      return transform(node as Record<string, unknown>, createIteratee(humps));
    }
    return node;
  }

  return humps(root) as T;
}
