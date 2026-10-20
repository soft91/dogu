/** 쿼리 파라미터로 쓸 수 있는 단일 값 타입 */
export type QueryValue = string | number | boolean | null | undefined;

/** 쿼리 파라미터 객체 타입 (배열 값 허용) */
export type QueryInput = Record<string, QueryValue | QueryValue[]>;

/** URL 쿼리 파라미터의 단일 항목 타입 */
export type QueryEntry = { key: string; value: string };

function getQueryString(input: string): string {
  const hashIndex = input.indexOf("#");
  const withoutHash = hashIndex >= 0 ? input.slice(0, hashIndex) : input;
  const queryIndex = withoutHash.indexOf("?");

  if (queryIndex >= 0) return withoutHash.slice(queryIndex + 1);
  if (withoutHash.includes("://")) return "";
  return withoutHash.startsWith("?") ? withoutHash.slice(1) : withoutHash;
}

/** 객체를 URL 쿼리 문자열로 직렬화합니다. (`null`/`undefined`는 제외) */
export function stringifyQuery(query: QueryInput): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === undefined || item === null) continue;
        params.append(key, String(item));
      }
      continue;
    }

    params.set(key, String(value));
  }

  return params.toString();
}

/** URL 또는 쿼리 문자열에서 쿼리 항목을 `{ key, value }` 객체로 반환합니다. */
export function parseQueryEntries(url: string): QueryEntry[] {
  return Array.from(new URLSearchParams(getQueryString(url)).entries()).map(([key, value]) => ({
    key,
    value,
  }));
}

/** URL 또는 쿼리 문자열을 객체로 파싱합니다. 동일 키는 배열로 묶습니다. */
export function parseQuery(url: string): Record<string, string | string[]> {
  const params = new URLSearchParams(getQueryString(url));
  const result: Record<string, string | string[]> = {};

  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    result[key] = values.length <= 1 ? (values[0] ?? "") : values;
  }

  return result;
}

/** URL 조각들을 `/`로 안전하게 이어 붙입니다. */
export function joinUrl(...parts: Array<string | null | undefined>): string {
  const filtered = parts.filter((part): part is string => Boolean(part));
  if (filtered.length === 0) return "";

  const [head, ...rest] = filtered;
  const base = (head ?? "").replace(/\/+$/, "");
  const tail = rest
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");

  if (!tail) return base;
  if (!base) return `/${tail}`.replace(/\/+/g, "/");
  return `${base}/${tail}`;
}

/** URL에 쿼리 파라미터를 추가합니다. (기존 쿼리/해시 유지) */
export function withQuery(url: string, query: QueryInput): string {
  const qs = stringifyQuery(query);
  if (!qs) return url;

  const hashIndex = url.indexOf("#");
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const separator = withoutHash.includes("?") ? "&" : "?";

  return `${withoutHash}${separator}${qs}${hash}`;
}
