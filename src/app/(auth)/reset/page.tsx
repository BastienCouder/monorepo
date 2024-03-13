import { ResetForm } from '@/components/auth/form-reset';
import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Réinitialisation - ${env.NAME_WEBSITE}`,
    description: `Réinitialisation`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const ResetPage = () => {
  return <ResetForm />;
};

export default ResetPage;
