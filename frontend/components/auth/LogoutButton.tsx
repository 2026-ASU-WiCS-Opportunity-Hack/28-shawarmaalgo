'use client';

import { useRouter } from 'next/navigation';
import { AUTH_COOKIE_NAME, ROLE_COOKIE_NAME } from '@/lib/auth-cookies';
import { Button } from '@/components/ui/button';

type LogoutButtonProps = {
  label?: string;
  fullWidth?: boolean;
  className?: string;
};

export function LogoutButton({ label = 'Log out', fullWidth = false, className }: LogoutButtonProps) {
  const router = useRouter();

  function handleLogout() {
    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `${ROLE_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    router.replace('/login');
    router.refresh();
  }

  return (
    <Button onClick={handleLogout} fullWidth={fullWidth} className={className}>
      {label}
    </Button>
  );
}
