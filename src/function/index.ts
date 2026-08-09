/** 아무 동작도 하지 않는 빈 함수입니다. */
export function noop(): void {}

/** 입력값을 그대로 반환합니다. */
export function identity<T>(value: T): T {
  return value;
}

/** 함수가 한 번만 실행되도록 감쌉니다. 이후 호출은 첫 결과를 반환합니다. */
export function once<T extends (...args: never[]) => unknown>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true;
      result = fn(...args) as ReturnType<T>;
    }
    return result;
  }) as T;
}

/** 인자 기준으로 결과를 캐시하는 메모이제이션 함수를 만듭니다. */
export function memoize<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  keyFn: (...args: TArgs) => string = (...args) => JSON.stringify(args),
): (...args: TArgs) => TResult {
  const cache = new Map<string, TResult>();

  return (...args: TArgs) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key)!;
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
}

/** `debounce`가 반환하는 함수 타입 (`cancel`, `flush` 포함) */
export type Debounced<T extends (...args: never[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
  flush: () => void;
};

/**
 * 연속 호출을 마지막 호출 기준으로 지연 실행하는 디바운스 함수를 만듭니다.
 * - `cancel()`: 대기 중인 호출 취소
 * - `flush()`: 대기 중인 호출을 즉시 실행
 */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait = 200,
): Debounced<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      if (lastArgs) fn(...lastArgs);
      lastArgs = undefined;
    }, wait);
  }) as Debounced<T>;

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
    lastArgs = undefined;
  };

  debounced.flush = () => {
    if (!timer || !lastArgs) return;
    clearTimeout(timer);
    timer = undefined;
    fn(...lastArgs);
    lastArgs = undefined;
  };

  return debounced;
}

/** `throttle`이 반환하는 함수 타입 (`cancel` 포함) */
export type Throttled<T extends (...args: never[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
};

/**
 * 일정 간격 이하로는 함수가 호출되지 않도록 제한하는 스로틀 함수를 만듭니다.
 * - `cancel()`: 대기 중인 호출 취소
 */
export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  wait = 200,
): Throttled<T> {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - lastCall);
    lastArgs = args;

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      lastCall = now;
      fn(...args);
      lastArgs = undefined;
      return;
    }

    if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = undefined;
        if (lastArgs) fn(...lastArgs);
        lastArgs = undefined;
      }, remaining);
    }
  }) as Throttled<T>;

  throttled.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
    lastArgs = undefined;
  };

  return throttled;
}
