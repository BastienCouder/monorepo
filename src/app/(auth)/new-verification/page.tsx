import { NewVerificationForm } from '@/components/auth/new-verification-form';
import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Vérification - ${env.NAME_WEBSITE}`,
    description: `Vérification`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const NewVerificationPage = () => {
  return <NewVerificationForm />;
};

export default NewVerificationPage;
