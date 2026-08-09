/** 지정한 밀리초만큼 대기하는 Promise를 반환합니다. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** `retry` 함수의 재시도 옵션 */
export type RetryOptions = {
  /** 실패 시 추가 재시도 횟수 (기본 3) */
  retries?: number;
  /** 첫 재시도 전 대기 시간(ms) (기본 200) */
  delayMs?: number;
  /** 대기 시간 배수 (기본 2) */
  factor?: number;
  /** 재시도할 때마다 호출되는 콜백 */
  onRetry?: (error: unknown, attempt: number) => void;
};

/** 실패 시 지수 백오프로 비동기 함수를 재시도합니다. */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { retries = 3, delayMs = 200, factor = 2, onRetry } = options;
  let attempt = 0;
  let wait = delayMs;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      onRetry?.(error, attempt + 1);
      await sleep(wait);
      wait *= factor;
      attempt += 1;
    }
  }

  throw lastError;
}

/** Promise가 제한 시간 안에 끝나지 않으면 타임아웃 에러를 던집니다. */
export async function timeout<T>(
  promise: Promise<T>,
  ms: number,
  message = `Timed out after ${ms}ms`,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * 동시 실행 개수를 제한하는 실행기를 만듭니다.
 * @returns 제한된 동시성으로 비동기 함수를 실행하는 `run` 함수
 */
export function pLimit(concurrency: number) {
  if (concurrency < 1) throw new Error("concurrency must be >= 1");

  let active = 0;
  const queue: Array<() => void> = [];

  const next = () => {
    active -= 1;
    queue.shift()?.();
  };

  return async function run<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= concurrency) {
      await new Promise<void>((resolve) => queue.push(resolve));
    }

    active += 1;
    try {
      return await fn();
    } finally {
      next();
    }
  };
}

/** 여러 Promise의 성공/실패 결과를 모두 수집합니다. (`Promise.allSettled` 래퍼) */
export async function settleAll<T>(
  promises: readonly Promise<T>[],
): Promise<Array<{ status: "fulfilled"; value: T } | { status: "rejected"; reason: unknown }>> {
  return Promise.allSettled(promises);
}
