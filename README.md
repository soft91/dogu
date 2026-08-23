# dogu

React / Next.js에서 공통으로 쓰는 TypeScript 유틸 라이브러리입니다.

- ESM + CJS 듀얼 빌드
- 트리셰이킹 가능 (`sideEffects: false`)
- 카테고리별 서브패스 import 지원
- Next.js SSR 환경을 고려한 browser / storage 유틸

## Install

```bash
npm install dogu
# or
yarn add dogu
# or
pnpm add dogu
```

로컬에서 다른 프로젝트에 연결하려면:

```bash
npm run build
npm link
# 다른 프로젝트에서
npm link dogu
```

## Usage

```ts
import { debounce, cn, formatDate, unique } from "dogu";

unique([1, 1, 2]); // [1, 2]
cn("btn", { active: true }); // "btn active"
formatDate(new Date(), "YYYY-MM-DD HH:mm");
```

카테고리별 import:

```ts
import { chunk, groupBy } from "dogu/array";
import { pick, omit } from "dogu/object";
import { camelCase, slugify } from "dogu/string";
import { clamp, formatCurrency } from "dogu/number";
import { addDays, isToday } from "dogu/date";
import { sleep, retry } from "dogu/async";
import { debounce, throttle } from "dogu/function";
import { isNil, isEmpty } from "dogu/type";
import { withQuery, joinUrl } from "dogu/url";
import { isBrowser, copyToClipboard } from "dogu/browser";
import { local, createStorage } from "dogu/storage";
import { cn } from "dogu/css";
```

## Modules

| Path | 포함 유틸 |
| --- | --- |
| `dogu/array` | `unique`, `chunk`, `groupBy`, `sortBy`, `partition` ... |
| `dogu/object` | `pick`, `omit`, `deepMerge`, `get`, `set` ... |
| `dogu/string` | `camelCase`, `kebabCase`, `truncate`, `slugify` ... |
| `dogu/number` | `clamp`, `formatNumber`, `formatCurrency`, `percent` ... |
| `dogu/date` | `formatDate`, `addDays`, `isToday`, `diffInDays` ... |
| `dogu/async` | `sleep`, `retry`, `timeout`, `pLimit` ... |
| `dogu/function` | `debounce`, `throttle`, `once`, `memoize` ... |
| `dogu/type` | `isNil`, `isEmpty`, `isPlainObject`, `assertNever` ... |
| `dogu/url` | `stringifyQuery`, `parseQuery`, `joinUrl`, `withQuery` |
| `dogu/browser` | `isBrowser`, `copyToClipboard`, cookie helpers |
| `dogu/storage` | SSR-safe `local` / `session` / `createStorage` |
| `dogu/css` | `cn` |

## Scripts

```bash
npm install
npm run build
npm test
npm run typecheck
```

## Playground

브라우저에서 유틸 함수의 JSON 인수를 편집하고 결과를 바로 확인할 수 있습니다.

```bash
npm run playground
```

프로덕션 빌드는 `npm run playground:build`로 생성합니다. `main` 브랜치에 push하면
테스트와 타입 검사를 거쳐 GitHub Pages에 자동으로 배포됩니다.

## Next.js note

`dogu/browser`, `dogu/storage`는 서버에서도 import해도 안전합니다. 실제 DOM/Storage 접근은 `isBrowser()` 체크 후 동작합니다.
