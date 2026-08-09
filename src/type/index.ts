/** `null` 또는 `undefined`를 허용하는 타입 */
export type Nullable<T> = T | null | undefined;

/** 문자열 키를 가진 객체 타입 */
export type Dictionary<T = unknown> = Record<string, T>;

/** JS 원시 값 타입 */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/** 값이 `null` 또는 `undefined`인지 확인합니다. */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/** 값이 `null`/`undefined`가 아닌지 확인합니다. */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/** 값이 문자열인지 확인합니다. */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/** 값이 유효한 숫자인지 확인합니다. (`NaN` 제외) */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

/** 값이 불리언인지 확인합니다. */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/** 값이 함수인지 확인합니다. */
export function isFunction(value: unknown): value is (...args: never[]) => unknown {
  return typeof value === "function";
}

/** 값이 배열인지 확인합니다. */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/** 값이 배열이 아닌 객체인지 확인합니다. */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 값이 순수 객체(`{}`)인지 확인합니다. (클래스 인스턴스 제외) */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!isObject(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** 값이 비어 있는지 확인합니다. (nil, 빈 문자열/배열/객체/Map/Set) */
export function isEmpty(value: unknown): boolean {
  if (isNil(value)) return true;
  if (isString(value) || isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

/** 도달하면 안 되는 분기에서 타입 안전성을 보장하며 에러를 던집니다. */
export function assertNever(value: never, message = "Unexpected value"): never {
  throw new Error(`${message}: ${String(value)}`);
}
