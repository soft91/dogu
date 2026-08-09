type DateInput = Date | number | string;

/** DateInput을 유효한 Date로 변환합니다. 실패 시 에러를 던집니다. */
function toDate(value: DateInput): Date {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${String(value)}`);
  }
  return date;
}

/** 유효한 Date 객체인지 확인합니다. */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * 날짜를 패턴 문자열로 포맷팅합니다.
 * 지원 토큰: `YYYY`, `MM`, `DD`, `HH`, `mm`, `ss`
 */
export function formatDate(
  value: DateInput,
  pattern = "YYYY-MM-DD",
): string {
  const date = toDate(value);
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");

  const tokens: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, (token) => tokens[token] ?? token);
}

/** 날짜에 일(day)을 더한 Date를 반환합니다. */
export function addDays(value: DateInput, days: number): Date {
  const date = toDate(value);
  date.setDate(date.getDate() + days);
  return date;
}

/** 날짜에 시간(hour)을 더한 Date를 반환합니다. */
export function addHours(value: DateInput, hours: number): Date {
  const date = toDate(value);
  date.setHours(date.getHours() + hours);
  return date;
}

/** 해당 날짜의 시작 시각(00:00:00.000)을 반환합니다. */
export function startOfDay(value: DateInput): Date {
  const date = toDate(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** 해당 날짜의 끝 시각(23:59:59.999)을 반환합니다. */
export function endOfDay(value: DateInput): Date {
  const date = toDate(value);
  date.setHours(23, 59, 59, 999);
  return date;
}

/** 두 날짜의 일 단위 차이를 반환합니다. (`a - b`) */
export function diffInDays(a: DateInput, b: DateInput): number {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/** 두 날짜가 같은 날인지 확인합니다. */
export function isSameDay(a: DateInput, b: DateInput): boolean {
  return formatDate(a) === formatDate(b);
}

/** 주어진 날짜가 오늘인지 확인합니다. */
export function isToday(value: DateInput): boolean {
  return isSameDay(value, new Date());
}

/** 날짜를 `YYYY-MM-DD` 형식 문자열로 변환합니다. */
export function toISODate(value: DateInput = new Date()): string {
  return formatDate(value, "YYYY-MM-DD");
}
