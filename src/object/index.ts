import { isPlainObject } from "../type";
import { isObjectLike, toPath, type PathKey } from "./path";

/** 객체에서 지정한 키만 골라 새 객체를 만듭니다. */
export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

/** 객체에서 지정한 키를 제외한 새 객체를 만듭니다. */
export function omit<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const exclude = new Set<keyof T>(keys);
  const result = {} as Omit<T, K>;

  for (const key of Object.keys(obj) as Array<keyof T>) {
    if (!exclude.has(key)) {
      (result as T)[key] = obj[key];
    }
  }

  return result;
}

/** 객체의 각 값을 mapper로 변환한 새 객체를 반환합니다. */
export function mapValues<T extends object, R>(
  obj: T,
  mapper: (value: T[keyof T], key: keyof T) => R,
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;
  for (const key of Object.keys(obj) as Array<keyof T>) {
    result[key] = mapper(obj[key], key);
  }
  return result;
}

/** 객체의 각 키를 mapper로 변환한 새 객체를 반환합니다. */
export function mapKeys<T extends object>(
  obj: T,
  mapper: (key: keyof T, value: T[keyof T]) => string,
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {};
  for (const key of Object.keys(obj) as Array<keyof T>) {
    result[mapper(key, obj[key])] = obj[key];
  }
  return result;
}

/** 객체를 깊게 병합합니다. 중첩된 plain object는 재귀적으로 합칩니다. */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Partial<T> | Record<string, unknown>>
): T {
  const result: Record<string, unknown> = { ...target };

  for (const source of sources) {
    if (!source) continue;

    for (const [key, value] of Object.entries(source)) {
      const current = result[key];
      if (isPlainObject(current) && isPlainObject(value)) {
        result[key] = deepMerge(current, value);
      } else {
        result[key] = value;
      }
    }
  }

  return result as T;
}

/** 점/대괄호 경로로 중첩 객체 값을 안전하게 조회합니다. */
export function get<T = unknown>(
  obj: unknown,
  path: string | readonly PathKey[],
  defaultValue?: T,
): T | undefined {
  let current: unknown = obj;
  for (const key of toPath(path)) {
    if (!isObjectLike(current)) {
      return defaultValue;
    }
    current = current[key];
  }

  return (current === undefined ? defaultValue : current) as T | undefined;
}

/** 점/대괄호 경로로 중첩 객체에 값을 설정합니다. 중간 경로가 없으면 생성합니다. */
export function set<T extends object>(
  obj: T,
  path: string | readonly PathKey[],
  value: unknown,
): T {
  const keys = toPath(path);

  if (keys.length === 0) return obj;

  let current: Record<PathKey, unknown> = obj as Record<PathKey, unknown>;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i]!;
    const nextKey = keys[i + 1]!;
    const nextIsIndex = typeof nextKey === "number" || /^\d+$/.test(String(nextKey));

    if (current[key] == null || typeof current[key] !== "object") {
      current[key] = nextIsIndex ? [] : {};
    }

    current = current[key] as Record<PathKey, unknown>;
  }

  current[keys[keys.length - 1]!] = value;
  return obj;
}

/** 객체의 키와 값을 뒤집은 새 객체를 반환합니다. */
export function invert<T extends Record<string, string | number>>(obj: T): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[String(value)] = key;
  }
  return result;
}
