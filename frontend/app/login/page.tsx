import { redirect } from 'next/navigation';
import LoginForm from '@/app/login/LoginForm';
import { getServerAuthToken, getServerRole } from '@/lib/auth';
import { getRoleDestination } from '@/lib/auth-routing';

export default function LoginPage() {
  const token = getServerAuthToken();
  const destination = token ? getRoleDestination(getServerRole()) : null;

  if (destination) {
    redirect(destination);
  }

  return <LoginForm />;
}
