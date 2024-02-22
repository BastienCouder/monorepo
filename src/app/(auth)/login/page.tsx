import { LoginForm } from '@/components/auth/form-login';
import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `login - ${env.NAME_WEBSITE}`,
    description: `login`,
  };
}

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
