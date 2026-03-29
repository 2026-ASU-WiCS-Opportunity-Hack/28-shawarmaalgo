import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, ROLE_COOKIE_NAME } from '@/lib/auth-cookies';

export function getServerAuthToken() {
  return cookies().get(AUTH_COOKIE_NAME)?.value;
}

export function getServerRole() {
  return cookies().get(ROLE_COOKIE_NAME)?.value;
}
