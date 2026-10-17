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
  findBfs,
  findDfs,
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
  usage?: string;
  parameters?: Array<{ name: string; type: string; description: string }>;
  returnType?: string;
};

type FunctionReference = Pick<PlaygroundFunction, "parameters" | "returnType">;

const parameter = (name: string, type: string, description: string) => ({ name, type, description });

/**
 * 플레이그라운드에서도 API 레퍼런스처럼 매개변수와 반환값을 확인할 수 있게 합니다.
 * `?`는 선택 매개변수, `=` 뒤는 기본값입니다.
 */
const references: Record<string, FunctionReference> = {
  capitalize: { parameters: [parameter("value", "string", "변환할 문자열입니다.")], returnType: "string" },
  camelCase: { parameters: [parameter("value", "string", "camelCase로 바꿀 문자열입니다.")], returnType: "string" },
  kebabCase: { parameters: [parameter("value", "string", "kebab-case로 바꿀 문자열입니다.")], returnType: "string" },
  snakeCase: { parameters: [parameter("value", "string", "snake_case로 바꿀 문자열입니다.")], returnType: "string" },
  slugify: { parameters: [parameter("value", "string", "URL 슬러그로 정규화할 문자열입니다.")], returnType: "string" },
  truncate: { parameters: [parameter("value", "string", "줄일 문자열입니다."), parameter("maxLength", "number", "반환 문자열의 최대 길이입니다."), parameter("omission?", "string = '...'", "잘린 뒤 붙일 표시입니다.")], returnType: "string" },
  template: { parameters: [parameter("input", "string", "{{key}} 자리표시자를 포함할 수 있는 템플릿입니다."), parameter("data", "Record<string, unknown>", "템플릿에 주입할 데이터입니다.")], returnType: "string" },
  ensurePrefix: { parameters: [parameter("value", "string", "확인할 문자열입니다."), parameter("prefix", "string", "없을 때 앞에 붙일 접두사입니다.")], returnType: "string" },
  ensureSuffix: { parameters: [parameter("value", "string", "확인할 문자열입니다."), parameter("suffix", "string", "없을 때 뒤에 붙일 접미사입니다.")], returnType: "string" },
  unique: { parameters: [parameter("array", "readonly T[]", "중복을 제거할 배열입니다.")], returnType: "T[]" },
  compact: { parameters: [parameter("array", "readonly (T | null | undefined | false | 0 | '')[]", "falsy 값을 제거할 배열입니다.")], returnType: "T[]" },
  chunk: { parameters: [parameter("array", "readonly T[]", "나눌 배열입니다."), parameter("size", "number", "각 묶음의 크기입니다. 0보다 커야 합니다.")], returnType: "T[][]" },
  range: { parameters: [parameter("start", "number", "끝값을 생략하면 시작값(0부터 생성), 지정하면 시작값입니다."), parameter("end?", "number", "생성 범위의 끝값(미포함)입니다."), parameter("step?", "number = 1", "증감 간격입니다. 0은 허용되지 않습니다.")], returnType: "number[]" },
  difference: { parameters: [parameter("array", "readonly T[]", "기준 배열입니다."), parameter("values", "readonly T[]", "기준 배열에서 제외할 값입니다.")], returnType: "T[]" },
  intersection: { parameters: [parameter("array", "readonly T[]", "기준 배열입니다."), parameter("values", "readonly T[]", "기준 배열에서 포함할 값입니다.")], returnType: "T[]" },
  clamp: { parameters: [parameter("value", "number", "제한할 숫자입니다."), parameter("min", "number", "허용 최솟값입니다."), parameter("max", "number", "허용 최댓값입니다.")], returnType: "number" },
  inRange: { parameters: [parameter("value", "number", "확인할 숫자입니다."), parameter("start", "number", "범위의 시작값(포함)입니다."), parameter("end", "number", "범위의 끝값(미포함)입니다.")], returnType: "boolean" },
  round: { parameters: [parameter("value", "number", "반올림할 숫자입니다."), parameter("precision?", "number = 0", "유지할 소수 자릿수입니다.")], returnType: "number" },
  formatNumber: { parameters: [parameter("value", "number", "표시할 숫자입니다."), parameter("options?", "Intl.NumberFormatOptions", "Intl 숫자 포맷 옵션입니다."), parameter("locale?", "string = 'ko-KR'", "BCP 47 로케일 문자열입니다.")], returnType: "string" },
  formatCurrency: { parameters: [parameter("value", "number", "표시할 금액입니다."), parameter("currency?", "string = 'KRW'", "ISO 4217 통화 코드입니다."), parameter("locale?", "string = 'ko-KR'", "BCP 47 로케일 문자열입니다.")], returnType: "string" },
  percent: { parameters: [parameter("value", "number", "분자 값입니다."), parameter("total", "number", "분모 값입니다. 0이면 0을 반환합니다."), parameter("digits?", "number = 1", "반올림할 소수 자릿수입니다.")], returnType: "number" },
  sum: { parameters: [parameter("values", "readonly number[]", "합계를 낼 숫자 배열입니다.")], returnType: "number" },
  average: { parameters: [parameter("values", "readonly number[]", "평균을 낼 숫자 배열입니다. 빈 배열이면 0입니다.")], returnType: "number" },
  pick: { parameters: [parameter("obj", "T extends object", "키를 선택할 원본 객체입니다."), parameter("keys", "readonly (keyof T)[]", "포함할 키 목록입니다.")], returnType: "Pick<T, K>" },
  omit: { parameters: [parameter("obj", "T extends object", "키를 제외할 원본 객체입니다."), parameter("keys", "readonly (keyof T)[]", "제외할 키 목록입니다.")], returnType: "Omit<T, K>" },
  get: { parameters: [parameter("obj", "unknown", "탐색할 객체입니다."), parameter("path", "string | readonly PathKey[]", "점 표기법 또는 키 배열 경로입니다."), parameter("defaultValue?", "T", "경로가 없거나 값이 undefined일 때 반환할 값입니다.")], returnType: "T | undefined" },
  invert: { parameters: [parameter("obj", "Record<string, string | number>", "키와 값을 뒤집을 객체입니다.")], returnType: "Record<string, string>" },
  formatDate: { parameters: [parameter("value", "Date | number | string", "포맷할 날짜 입력입니다."), parameter("pattern?", "string = 'YYYY-MM-DD'", "YYYY, MM, DD, HH, mm, ss 토큰을 쓸 수 있습니다.")], returnType: "string" },
  stringifyQuery: { parameters: [parameter("query", "Record<string, QueryValue | QueryValue[]>", "직렬화할 쿼리 객체입니다. null과 undefined는 제외됩니다.")], returnType: "string" },
  parseQuery: { parameters: [parameter("search", "string", "? 포함 여부와 관계없이 쿼리 문자열을 넣습니다.")], returnType: "Record<string, string | string[]>" },
  joinUrl: { parameters: [parameter("parts", "...(string | null | undefined)[]", "연결할 URL 조각들입니다.")], returnType: "string" },
  withQuery: { parameters: [parameter("url", "string", "쿼리를 추가할 URL입니다."), parameter("query", "QueryInput", "추가할 쿼리 객체입니다.")], returnType: "string" },
  isNil: { parameters: [parameter("value", "unknown", "검사할 값입니다.")], returnType: "value is null | undefined" },
  isEmpty: { parameters: [parameter("value", "unknown", "검사할 값입니다.")], returnType: "boolean" },
  cn: { parameters: [parameter("values", "...ClassValue[]", "문자열, 조건부 객체 또는 중첩 배열 형태의 클래스 값입니다.")], returnType: "string" },
  findBfs: { parameters: [parameter("root", "T", "탐색을 시작할 루트 노드입니다."), parameter("getChildren", "(node: T) => readonly T[] | undefined", "현재 노드의 자식 목록을 반환합니다."), parameter("predicate", "(node: T) => boolean", "찾는 노드라면 true를 반환합니다.")], returnType: "T | undefined" },
  findDfs: { parameters: [parameter("root", "T", "탐색을 시작할 루트 노드입니다."), parameter("getChildren", "(node: T) => readonly T[] | undefined", "현재 노드의 자식 목록을 반환합니다."), parameter("predicate", "(node: T) => boolean", "찾는 노드라면 true를 반환합니다.")], returnType: "T | undefined" },
};

/** JSON 실행 인수와 분리한, 문서용 TypeScript 사용 예시입니다. */
const usageExamples: Record<string, string> = {
  capitalize: 'const title = capitalize("dogu library")',
  camelCase: 'const fieldName = camelCase("user-profile name")',
  kebabCase: 'const slug = kebabCase("userProfile Name")',
  snakeCase: 'const key = snakeCase("userProfile Name")',
  slugify: 'const slug = slugify("Hello, Dogu Playground!")',
  truncate: 'const preview = truncate(article.body, 120, "…")',
  template: 'const message = template("안녕하세요, {{user.name}}님!", { user })',
  ensurePrefix: 'const handle = ensurePrefix(username, "@")',
  ensureSuffix: 'const filename = ensureSuffix(name, ".json")',
  unique: 'const tagIds = unique(posts.map((post) => post.tagId))',
  compact: 'const labels = compact([title, subtitle, description])',
  chunk: 'const pages = chunk(products, 20)',
  range: 'const pageNumbers = range(1, totalPages + 1)',
  difference: 'const removedIds = difference(previousIds, nextIds)',
  intersection: 'const selectedVisibleIds = intersection(selectedIds, visibleIds)',
  clamp: 'const progress = clamp(completed / total, 0, 1)',
  inRange: 'const isBusinessHour = inRange(hour, 9, 18)',
  round: 'const rating = round(rawRating, 1)',
  formatNumber: 'const label = formatNumber(viewCount, { notation: "compact" })',
  formatCurrency: 'const price = formatCurrency(amount, "KRW")',
  percent: 'const completion = percent(doneCount, totalCount)',
  sum: 'const total = sum(cartItems.map((item) => item.price))',
  average: 'const averageScore = average(reviews.map((review) => review.score))',
  pick: 'const payload = pick(user, ["name", "email"])',
  omit: 'const publicUser = omit(user, ["passwordHash", "refreshToken"])',
  get: 'const city = get<string>(response, "user.address.city", "Seoul")',
  invert: 'const sizeByCode = invert({ small: "S", medium: "M" })',
  formatDate: 'const publishedAt = formatDate(post.createdAt, "YYYY.MM.DD HH:mm")',
  stringifyQuery: 'const query = stringifyQuery({ page: 1, tags: ["react", "ts"] })',
  parseQuery: 'const filters = parseQuery(location.search)',
  joinUrl: 'const endpoint = joinUrl(API_URL, "v1", "users", userId)',
  withQuery: 'const href = withQuery("/search", { q: keyword, page: 1 })',
  isNil: 'if (isNil(user)) return <EmptyState />',
  isEmpty: 'const showEmptyState = isEmpty(results)',
  cn: 'const className = cn("button", { active: isActive, disabled: isDisabled })',
  findBfs: 'const target = findBfs(root, (node) => node.children, (node) => node.id === targetId)',
  findDfs: 'const match = findDfs(root, (node) => node.children, (node) => node.type === "folder")',
};

export const formatCall = (name: string, args: unknown[]) =>
  `${name}(${args.map((arg) => JSON.stringify(arg)).join(", ")})`;

const entry = (
  category: string,
  name: string,
  description: string,
  example: unknown[],
  run: (...args: any[]) => unknown,
  usage?: string,
  parameters?: PlaygroundFunction["parameters"],
): PlaygroundFunction => ({
  category,
  name,
  description,
  example,
  run,
  usage: usage ?? usageExamples[name] ?? `const result = ${formatCall(name, example)}`,
  ...references[name],
  ...(parameters === undefined ? {} : { parameters }),
});

type ExampleTreeNode = { id: string; children?: ExampleTreeNode[] };

const findInExampleTree = (
  search: typeof findBfs | typeof findDfs,
  root: ExampleTreeNode,
  id: string,
) => search(root, (node) => node.children, (node) => node.id === id);

const exampleTree = {
  id: "root",
  children: [
    { id: "left", children: [{ id: "deep-match" }] },
    { id: "right", children: [{ id: "target" }] },
  ],
};

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
  entry(
    "Tree",
    "findBfs",
    "너비 우선으로 가장 가까운 일치 노드 찾기",
    [exampleTree, "target"],
    (root: ExampleTreeNode, id: string) => findInExampleTree(findBfs, root, id),
    'const result = findBfs(root, (node) => node.children, (node) => node.id === "target")',
    [
      { name: "root", type: "T", description: "탐색을 시작할 루트 노드입니다." },
      { name: "getChildren", type: "(node: T) => readonly T[] | undefined", description: "현재 노드에서 다음에 탐색할 자식 목록을 반환합니다." },
      { name: "predicate", type: "(node: T) => boolean", description: "찾으려는 노드이면 true를 반환합니다." },
    ],
  ),
  entry(
    "Tree",
    "findDfs",
    "깊이 우선으로 첫 번째 일치 노드 찾기",
    [exampleTree, "target"],
    (root: ExampleTreeNode, id: string) => findInExampleTree(findDfs, root, id),
    'const result = findDfs(root, (node) => node.children, (node) => node.id === "target")',
    [
      { name: "root", type: "T", description: "탐색을 시작할 루트 노드입니다." },
      { name: "getChildren", type: "(node: T) => readonly T[] | undefined", description: "현재 노드에서 다음에 탐색할 자식 목록을 반환합니다." },
      { name: "predicate", type: "(node: T) => boolean", description: "찾으려는 노드이면 true를 반환합니다." },
    ],
  ),
];

export const categories = [...new Set(functions.map(({ category }) => category))];
