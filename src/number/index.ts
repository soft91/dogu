/** 숫자를 min~max 범위 안으로 제한합니다. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** 값이 `[start, end)` 범위에 포함되는지 확인합니다. */
export function inRange(value: number, start: number, end: number): boolean {
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  return value >= min && value < max;
}

/** 지정한 소수점 자리수로 반올림합니다. */
export function round(value: number, precision = 0): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/** 소수점 자릿수를 고정한 숫자로 변환합니다. (`toFixed` 후 number 반환) */
export function toFixedNumber(value: number, digits = 2): number {
  return Number(value.toFixed(digits));
}

/** locale에 맞게 숫자를 포맷팅한 문자열을 반환합니다. */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = "ko-KR",
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/** 숫자를 통화 형식 문자열로 포맷팅합니다. (기본 KRW) */
export function formatCurrency(
  value: number,
  currency = "KRW",
  locale = "ko-KR",
): string {
  return formatNumber(value, { style: "currency", currency }, locale);
}

/** `value / total`을 퍼센트(%)로 계산합니다. */
export function percent(value: number, total: number, digits = 1): number {
  if (total === 0) return 0;
  return round((value / total) * 100, digits);
}

/** min~max(포함) 범위의 정수 난수를 반환합니다. */
export function randomInt(min: number, max: number): number {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

/** 숫자 배열의 합계를 반환합니다. */
export function sum(values: readonly number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

/** 숫자 배열의 평균을 반환합니다. (빈 배열이면 0) */
export function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}
