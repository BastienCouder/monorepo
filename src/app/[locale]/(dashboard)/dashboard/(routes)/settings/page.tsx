import { SettingsForm } from '@/app/[locale]/(auth)/_components/form-settings';
import { siteConfig } from '@/config/site';
import { pick } from 'lodash';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: `${t('metadata.auth.settings_user')} - ${siteConfig.name}`,
    description: t('metadata.auth.settings_user_description'),
    robots: { index: false, follow: false, nocache: false },
  };
}

const SettingsPage = async () => {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, 'auth')}>
      <SettingsForm />
    </NextIntlClientProvider>
  );
};

export default SettingsPage;
