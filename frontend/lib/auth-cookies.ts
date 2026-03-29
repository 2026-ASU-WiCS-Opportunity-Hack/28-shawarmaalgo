export const AUTH_COOKIE_NAME = 'wial_token';
export const ROLE_COOKIE_NAME = 'wial_role';

export function getClientCookie(name: string) {
  if (typeof document === 'undefined') return undefined;

  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!cookie) return undefined;
  return decodeURIComponent(cookie.slice(prefix.length));
}

export function getClientAuthToken() {
  return getClientCookie(AUTH_COOKIE_NAME);
}
