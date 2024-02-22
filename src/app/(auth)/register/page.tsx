import { Metadata } from 'next';
import { env } from '@/lib/env';
import { RegisterForm } from '@/components/auth/form-register';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Register - ${env.NAME_WEBSITE}`,
    description: `Register`,
  };
}

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
