import { LoginForm } from '@/components/auth/form-login';
import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Connexion - ${env.NAME_WEBSITE}`,
    description: `Connexion`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
