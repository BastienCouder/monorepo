import { ResetForm } from '@/components/auth/form-reset';
import { siteConfig } from '@/config/site';
import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Reset password - ${siteConfig.name}`,
    description: `Reset password`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const ResetPage = () => {
  return <ResetForm />;
};

export default ResetPage;
