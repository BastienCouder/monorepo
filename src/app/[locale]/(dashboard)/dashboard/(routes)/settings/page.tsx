import SettingsForm from '@/components/auth/form-settings';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Settings user - ${siteConfig.name}`,
    description: `Settings user`,
    robots: { index: false, follow: false, nocache: false },
  };
}

const SettingsPage = () => {
  return <SettingsForm />;
};

export default SettingsPage;
