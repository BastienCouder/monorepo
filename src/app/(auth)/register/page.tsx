import { Metadata } from 'next';
import { env } from '@/lib/env';
import { RegisterForm } from '@/components/auth/form-register';
import { siteConfig } from '@/config/site';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Register at - ${siteConfig.name}`,
    description: `Register at`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
