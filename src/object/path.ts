export type PathKey = string | number;

/** 점 표기법 또는 배열로 받은 경로를 순회 가능한 키 목록으로 정규화합니다. */
export function toPath(path: string | readonly PathKey[]): PathKey[] {
  if (typeof path !== "string") return [...path];

  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean)
    .map((key) => (/^\d+$/.test(key) ? Number(key) : key));
}

/** 값이 속성 접근 가능한 객체 또는 함수인지 확인합니다. */
export function isObjectLike(value: unknown): value is Record<PathKey, unknown> {
  return value !== null && (typeof value === "object" || typeof value === "function");
}
