import { NewVerificationForm } from '@/components/auth/new-verification-form';
import { siteConfig } from '@/config/site';
import { env } from '@/lib/env';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Check auth - ${siteConfig.name}`,
    description: `Check auth`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const NewVerificationPage = () => {
  return <NewVerificationForm />;
};

export default NewVerificationPage;
