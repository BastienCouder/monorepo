import { NewPasswordForm } from '@/components/auth/new-password-form';
import { siteConfig } from '@/config/site';
import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `New password - ${siteConfig.name}`,
    description: `New password`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const NewPasswordPage = () => {
  return (
    <section className="w-full space-y-4 lg:px-32">
      <h1 className="text-center">New password</h1>
      <NewPasswordForm />
    </section>
  );
};

export default NewPasswordPage;
