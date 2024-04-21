import { LoginForm } from '@/components/auth/form-login';
import { siteConfig } from '@/config/site';
import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Login - ${siteConfig.name}`,
    description: `Login`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
