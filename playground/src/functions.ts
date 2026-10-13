import {
  average,
  camelCase,
  capitalize,
  chunk,
  clamp,
  cn,
  compact,
  difference,
  ensurePrefix,
  ensureSuffix,
  formatCurrency,
  formatDate,
  formatNumber,
  get,
  inRange,
  intersection,
  invert,
  isEmpty,
  isNil,
  joinUrl,
  kebabCase,
  omit,
  parseQuery,
  percent,
  pick,
  range,
  round,
  slugify,
  snakeCase,
  stringifyQuery,
  sum,
  template,
  truncate,
  unique,
  withQuery,
} from "@dogu/index";

export type PlaygroundFunction = {
  name: string;
  category: string;
  description: string;
  example: unknown[];
  run: (...args: any[]) => unknown;
};

export const formatCall = (name: string, args: unknown[]) =>
  `${name}(${args.map((arg) => JSON.stringify(arg)).join(", ")})`;

const entry = (
  category: string,
  name: string,
  description: string,
  example: unknown[],
  run: (...args: any[]) => unknown,
): PlaygroundFunction => ({ category, name, description, example, run });

export const functions: PlaygroundFunction[] = [
  entry("String", "capitalize", "첫 글자를 대문자로 변환", ["dogu library"], capitalize),
  entry("String", "camelCase", "문자열을 camelCase로 변환", ["hello-dogu world"], camelCase),
  entry("String", "kebabCase", "문자열을 kebab-case로 변환", ["helloDogu World"], kebabCase),
  entry("String", "snakeCase", "문자열을 snake_case로 변환", ["helloDogu World"], snakeCase),
  entry("String", "slugify", "URL에 적합한 슬러그 생성", ["Hello, Dogu Playground!"], slugify),
  entry("String", "truncate", "문자열을 지정 길이로 축약", ["Dogu makes utilities pleasant", 18], truncate),
  entry("String", "template", "템플릿의 {{key}}를 데이터로 치환", ["안녕하세요, {{user.name}}님!", { user: { name: "Dogu" } }], template),
  entry("String", "ensurePrefix", "접두사가 없을 때 추가", ["dogu", "@"], ensurePrefix),
  entry("String", "ensureSuffix", "접미사가 없을 때 추가", ["README", ".md"], ensureSuffix),

  entry("Array", "unique", "배열에서 중복 제거", [[1, 1, 2, 3, 3]], unique),
  entry("Array", "compact", "배열에서 falsy 값 제거", [[0, 1, false, 2, "", 3, null]], compact),
  entry("Array", "chunk", "배열을 지정한 크기로 분할", [[1, 2, 3, 4, 5, 6, 7], 3], chunk),
  entry("Array", "range", "숫자 범위 배열 생성", [1, 10, 2], range),
  entry("Array", "difference", "두 배열의 차집합", [[1, 2, 3, 4], [2, 4]], difference),
  entry("Array", "intersection", "두 배열의 교집합", [[1, 2, 3], [2, 3, 4]], intersection),

  entry("Number", "clamp", "숫자를 min~max 범위로 제한", [120, 0, 100], clamp),
  entry("Number", "inRange", "숫자가 범위에 포함되는지 확인", [7, 1, 10], inRange),
  entry("Number", "round", "지정한 소수점 자리로 반올림", [3.141592, 3], round),
  entry("Number", "formatNumber", "로케일에 맞춰 숫자 표시", [1234567.89], formatNumber),
  entry("Number", "formatCurrency", "통화 형식으로 표시", [125000, "KRW", "ko-KR"], formatCurrency),
  entry("Number", "percent", "전체 대비 비율 계산", [37, 80, 1], percent),
  entry("Number", "sum", "숫자 배열 합계", [[12, 18, 25, 45]], sum),
  entry("Number", "average", "숫자 배열 평균", [[12, 18, 25, 45]], average),

  entry("Object", "pick", "선택한 키만 포함하는 객체 생성", [{ name: "Dogu", version: "0.1.0", private: false }, ["name", "version"]], pick),
  entry("Object", "omit", "선택한 키를 제외한 객체 생성", [{ name: "Dogu", version: "0.1.0", private: false }, ["private"]], omit),
  entry("Object", "get", "중첩 경로의 값을 안전하게 조회", [{ user: { profile: { name: "Dogu" } } }, "user.profile.name", "없음"], get),
  entry("Object", "invert", "객체의 키와 값을 뒤집기", [{ small: "S", medium: "M", large: "L" }], invert),

  entry("Date", "formatDate", "날짜를 패턴에 맞게 표시", ["2026-08-23T14:30:00", "YYYY년 MM월 DD일 HH:mm"], formatDate),

  entry("URL", "stringifyQuery", "객체를 쿼리 문자열로 변환", [{ page: 2, tag: ["ts", "react"], active: true }], stringifyQuery),
  entry("URL", "parseQuery", "쿼리 문자열을 객체로 변환", ["?page=2&tag=ts&tag=react"], parseQuery),
  entry("URL", "joinUrl", "URL 조각을 안전하게 연결", ["https://example.com/", "/users/", "dogu"], joinUrl),
  entry("URL", "withQuery", "URL에 쿼리 파라미터 추가", ["/search#result", { q: "dogu", page: 1 }], withQuery),

  entry("Type", "isNil", "null 또는 undefined인지 확인", [null], isNil),
  entry("Type", "isEmpty", "값이 비어 있는지 확인", [{}], isEmpty),
  entry("CSS", "cn", "조건부 클래스 이름을 결합", ["button", { active: true, disabled: false }, ["large"]], cn),
];

export const categories = [...new Set(functions.map(({ category }) => category))];
