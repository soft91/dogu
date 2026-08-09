/** 배열에서 중복 값을 제거한 새 배열을 반환합니다. */
export function unique<T>(array: readonly T[]): T[] {
  return [...new Set(array)];
}

/** 키 함수 기준으로 중복을 제거한 새 배열을 반환합니다. (첫 등장 항목 유지) */
export function uniqueBy<T>(array: readonly T[], key: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  const result: T[] = [];

  for (const item of array) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    result.push(item);
  }

  return result;
}

/** falsy 값(`null`, `undefined`, `false`, `0`, `""`)을 제거한 배열을 반환합니다. */
export function compact<T>(array: readonly (T | null | undefined | false | 0 | "")[]): T[] {
  return array.filter(Boolean) as T[];
}

/** 배열을 지정한 크기만큼 잘라 2차원 배열로 나눕니다. */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (size <= 0) throw new Error("chunk size must be greater than 0");

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/** 중첩 배열을 지정한 깊이만큼 평탄화합니다. */
export function flatten<T>(array: readonly (T | readonly T[])[], depth = 1): T[] {
  return array.flat(depth) as T[];
}

/** 키 함수 결과로 항목을 그룹핑한 객체를 반환합니다. */
export function groupBy<T, K extends string | number | symbol>(
  array: readonly T[],
  key: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (acc, item) => {
      const group = key(item);
      (acc[group] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

/** 여러 기준과 정렬 방향으로 배열을 정렬한 새 배열을 반환합니다. */
export function sortBy<T>(
  array: readonly T[],
  iteratees: Array<(item: T) => string | number>,
  orders: Array<"asc" | "desc"> = [],
): T[] {
  return [...array].sort((a, b) => {
    for (let i = 0; i < iteratees.length; i += 1) {
      const iteratee = iteratees[i]!;
      const av = iteratee(a);
      const bv = iteratee(b);
      if (av === bv) continue;
      const order = orders[i] ?? "asc";
      if (av > bv) return order === "asc" ? 1 : -1;
      return order === "asc" ? -1 : 1;
    }
    return 0;
  });
}

/** 조건에 맞는 항목과 아닌 항목으로 배열을 둘로 나눕니다. */
export function partition<T>(array: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];

  for (const item of array) {
    (predicate(item) ? pass : fail).push(item);
  }

  return [pass, fail];
}

/**
 * 숫자 범위 배열을 생성합니다.
 * - `range(5)` → `[0,1,2,3,4]`
 * - `range(1, 5)` → `[1,2,3,4]`
 */
export function range(start: number, end?: number, step = 1): number[] {
  const from = end === undefined ? 0 : start;
  const to = end === undefined ? start : end;

  if (step === 0) throw new Error("step must not be 0");

  const result: number[] = [];
  if (step > 0) {
    for (let i = from; i < to; i += step) result.push(i);
  } else {
    for (let i = from; i > to; i += step) result.push(i);
  }
  return result;
}

/** 배열의 첫 번째 요소를 반환합니다. */
export function first<T>(array: readonly T[]): T | undefined {
  return array[0];
}

/** 배열의 마지막 요소를 반환합니다. */
export function last<T>(array: readonly T[]): T | undefined {
  return array[array.length - 1];
}

/** 배열에서 임의의 요소 하나를 반환합니다. */
export function sample<T>(array: readonly T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/** 배열을 무작위로 섞은 새 배열을 반환합니다. */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/** 첫 배열에서 두 번째 배열에 포함된 값을 제외한 차집합을 반환합니다. */
export function difference<T>(array: readonly T[], values: readonly T[]): T[] {
  const exclude = new Set(values);
  return array.filter((item) => !exclude.has(item));
}

/** 두 배열에 모두 존재하는 값의 교집합을 반환합니다. */
export function intersection<T>(array: readonly T[], values: readonly T[]): T[] {
  const include = new Set(values);
  return array.filter((item) => include.has(item));
}
