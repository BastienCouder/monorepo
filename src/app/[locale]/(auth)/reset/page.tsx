import { ResetForm } from '@/app/[locale]/(auth)/_components/form-reset';
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
    title: `${t('metadata.auth.reset_password')} - ${siteConfig.name}`,
    description: t('metadata.auth.reset_password_description'),
    robots: { index: false, follow: false, nocache: false },
  };
}

const ResetPage = async () => {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, 'auth.client')}>
      <ResetForm />
    </NextIntlClientProvider>
  );
};

export default ResetPage;
