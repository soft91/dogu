/** 현재 실행 환경이 브라우저인지 확인합니다. (SSR 안전) */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/** 현재 실행 환경이 서버인지 확인합니다. */
export function isServer(): boolean {
  return !isBrowser();
}

/** 텍스트를 클립보드에 복사합니다. 성공 여부를 반환합니다. */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser()) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    try {
      textarea.select();
      return document.execCommand("copy");
    } finally {
      textarea.remove();
    }
  } catch {
    return false;
  }
}

/** 쿠키 값을 이름으로 조회합니다. (서버에서는 `undefined`) */
export function getCookie(name: string): string | undefined {
  if (!isBrowser()) return undefined;

  const matched = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!matched) return undefined;
  return decodeURIComponent(matched.slice(name.length + 1));
}

/** 쿠키를 설정합니다. (서버에서는 no-op) */
export function setCookie(
  name: string,
  value: string,
  options: {
    days?: number;
    path?: string;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
  } = {},
): void {
  if (!isBrowser()) return;

  const { days, path = "/", sameSite = "Lax", secure } = options;
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}`;

  if (days != null) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    cookie += `; Expires=${expires}`;
  }

  if (secure ?? sameSite === "None") {
    cookie += "; Secure";
  }

  document.cookie = cookie;
}

/** 쿠키를 삭제합니다. */
export function removeCookie(name: string, path = "/"): void {
  setCookie(name, "", { days: -1, path });
}

/** Blob을 파일로 다운로드합니다. (서버에서는 no-op) */
export function downloadBlob(filename: string, blob: Blob): void {
  if (!isBrowser()) return;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
