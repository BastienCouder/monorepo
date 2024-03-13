import { NewPasswordForm } from '@/components/auth/new-password-form';
import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Nouveau mot de passe - ${env.NAME_WEBSITE}`,
    description: `Nouveau mot de passe`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const NewPasswordPage = () => {
  return (
    <section className="w-full space-y-4 lg:px-32">
      <h1 className="text-center">Nouveau mot de passe</h1>
      <NewPasswordForm />
    </section>
  );
};

export default NewPasswordPage;
