/** 문자열의 첫 글자만 대문자로 변환합니다. */
export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** 문자열을 camelCase로 변환합니다. (`hello-world` → `helloWorld`) */
export function camelCase(value: string): string {
  return value
    .replace(/[_\-\s]+(.)?/g, (_, char: string | undefined) => (char ? char.toUpperCase() : ""))
    .replace(/^(.)/, (char) => char.toLowerCase());
}

/** 문자열을 kebab-case로 변환합니다. (`helloWorld` → `hello-world`) */
export function kebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

/** 문자열을 snake_case로 변환합니다. (`helloWorld` → `hello_world`) */
export function snakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

/** 문자열을 PascalCase로 변환합니다. (`hello-world` → `HelloWorld`) */
export function pascalCase(value: string): string {
  const camel = camelCase(value);
  return capitalize(camel);
}

/** 문자열을 최대 길이로 자르고 말줄임표(기본 `...`)를 붙입니다. */
export function truncate(value: string, maxLength: number, omission = "..."): string {
  if (maxLength < 0) throw new Error("maxLength must be >= 0");
  if (value.length <= maxLength) return value;
  if (maxLength <= omission.length) return omission.slice(0, maxLength);
  return `${value.slice(0, maxLength - omission.length)}${omission}`;
}

/** URL/슬러그에 쓰기 좋은 형태로 문자열을 정규화합니다. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** `{{key}}` 형태의 템플릿 문자열에 데이터를 채워 넣습니다. */
export function template(input: string, data: Record<string, unknown>): string {
  return input.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key: string) => {
    const value = key.split(".").reduce<unknown>((acc, part) => {
      if (acc == null || typeof acc !== "object") return undefined;
      return (acc as Record<string, unknown>)[part];
    }, data);

    return value == null ? "" : String(value);
  });
}

/** 문자열 앞에 접두사가 없으면 추가합니다. */
export function ensurePrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value : `${prefix}${value}`;
}

/** 문자열 뒤에 접미사가 없으면 추가합니다. */
export function ensureSuffix(value: string, suffix: string): string {
  return value.endsWith(suffix) ? value : `${value}${suffix}`;
}

/** 문자열 앞의 접두사를 제거합니다. (없으면 그대로 반환) */
export function stripPrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

/** 문자열 뒤의 접미사를 제거합니다. (없으면 그대로 반환) */
export function stripSuffix(value: string, suffix: string): string {
  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
}
