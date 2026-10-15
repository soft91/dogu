import { isBrowser } from "../browser";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type StorageKind = "local" | "session";

/** 브라우저 Storage API를 안전하게 가져옵니다. (SSR/접근 불가 시 `null`) */
function getStorage(kind: StorageKind): StorageLike | null {
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
    kind?: StorageKind;
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
      try {
        getStorage(kind)?.removeItem(key);
      } catch {
        // Storage 접근 예외는 안전한 헬퍼의 경계 밖으로 전파하지 않습니다.
      }
    },
  };
}

function createStorageNamespace(kind: StorageKind) {
  return {
    get<T>(key: string, defaultValue?: T): T | undefined {
      return createStorage<T>(key, { kind }).get(defaultValue);
    },
    set<T>(key: string, value: T): boolean {
      return createStorage<T>(key, { kind }).set(value);
    },
    remove(key: string): void {
      createStorage(key, { kind }).remove();
    },
  };
}

/** localStorage용 간편 get/set/remove 헬퍼 */
export const local = createStorageNamespace("local");
/** sessionStorage용 간편 get/set/remove 헬퍼 */
export const session = createStorageNamespace("session");
