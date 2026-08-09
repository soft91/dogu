type ClassDictionary = Record<string, unknown>;
type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassValue[];

/** ClassValue를 클래스 이름 배열로 정규화합니다. */
function toClassNames(value: ClassValue): string[] {
  if (!value && value !== 0) return [];

  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(toClassNames);
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([key]) => key);
  }

  return [];
}

/**
 * 조건부 클래스명을 합쳐 하나의 문자열로 만듭니다.
 * (`clsx`와 유사한 경량 헬퍼)
 */
export function cn(...values: ClassValue[]): string {
  return values.flatMap(toClassNames).filter(Boolean).join(" ");
}
