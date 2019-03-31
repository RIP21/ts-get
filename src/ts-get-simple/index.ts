export type AccessorFunction<T, R> = (object: T) => R

export function get<T, R>(object: T, accessorFn: AccessorFunction<T, R>): Exclude<R, null> | undefined
export function get<T, R>(
  object: T,
  accessorFn: AccessorFunction<T, R>,
  defaultValue: R,
): Exclude<R, undefined | null>

export function get<T, R>(
  object: T,
  accessorFn: AccessorFunction<T, R>,
  defaultValue?: R,
): R | undefined {
  try {
    const result = accessorFn(object)
    return result === undefined || result === null ? defaultValue : result
  } catch (e) {
    return defaultValue
  }
}

export default get
