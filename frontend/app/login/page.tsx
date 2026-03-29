import LoginForm from '@/app/login/LoginForm';
import { getServerAuthToken, getServerRole } from '@/lib/auth';
import { getRoleDestination } from '@/lib/auth-routing';

export default function LoginPage() {
  const token = getServerAuthToken();
  const portalHref = token ? getRoleDestination(getServerRole()) || '/portal' : null;

  return <LoginForm isLoggedIn={Boolean(token)} portalHref={portalHref} />;
}
