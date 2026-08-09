import { isBrowser } from "../browser";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** 브라우저 Storage API를 안전하게 가져옵니다. (SSR/접근 불가 시 `null`) */
function getStorage(kind: "local" | "session"): StorageLike | null {
  if (!isBrowser()) return null;

  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * 키에 바인딩된 typed storage 헬퍼를 만듭니다.
 * SSR 환경에서도 안전하게 동작하며, get/set/remove를 제공합니다.
 */
export function createStorage<T>(
  key: string,
  options: {
    kind?: "local" | "session";
    serialize?: (value: T) => string;
    deserialize?: (raw: string) => T;
  } = {},
) {
  const {
    kind = "local",
    serialize = JSON.stringify,
    deserialize = JSON.parse as (raw: string) => T,
  } = options;

  return {
    /** 저장된 값을 읽고, 없거나 파싱 실패 시 기본값을 반환합니다. */
    get(defaultValue?: T): T | undefined {
      const storage = getStorage(kind);
      if (!storage) return defaultValue;

      const raw = storage.getItem(key);
      if (raw == null) return defaultValue;

      try {
        return deserialize(raw);
      } catch {
        return defaultValue;
      }
    },
    /** 값을 직렬화해 저장합니다. 성공 여부를 반환합니다. */
    set(value: T): boolean {
      const storage = getStorage(kind);
      if (!storage) return false;

      try {
        storage.setItem(key, serialize(value));
        return true;
      } catch {
        return false;
      }
    },
    /** 저장된 값을 삭제합니다. */
    remove(): void {
      getStorage(kind)?.removeItem(key);
    },
  };
}

/** localStorage용 간편 get/set/remove 헬퍼 */
export const local = {
  /** localStorage에서 JSON 값을 읽습니다. */
  get<T>(key: string, defaultValue?: T): T | undefined {
    return createStorage<T>(key, { kind: "local" }).get(defaultValue);
  },
  /** localStorage에 JSON 값을 저장합니다. */
  set<T>(key: string, value: T): boolean {
    return createStorage<T>(key, { kind: "local" }).set(value);
  },
  /** localStorage에서 키를 삭제합니다. */
  remove(key: string): void {
    createStorage(key, { kind: "local" }).remove();
  },
};

/** sessionStorage용 간편 get/set/remove 헬퍼 */
export const session = {
  /** sessionStorage에서 JSON 값을 읽습니다. */
  get<T>(key: string, defaultValue?: T): T | undefined {
    return createStorage<T>(key, { kind: "session" }).get(defaultValue);
  },
  /** sessionStorage에 JSON 값을 저장합니다. */
  set<T>(key: string, value: T): boolean {
    return createStorage<T>(key, { kind: "session" }).set(value);
  },
  /** sessionStorage에서 키를 삭제합니다. */
  remove(key: string): void {
    createStorage(key, { kind: "session" }).remove();
  },
};
