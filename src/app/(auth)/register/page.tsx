import { Metadata } from 'next';
import { env } from '@/lib/env';
import { RegisterForm } from '@/components/auth/form-register';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Inscription - ${env.NAME_WEBSITE}`,
    description: `Inscription`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
