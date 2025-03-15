import { Metadata } from 'next';
import { getMessages, getTranslations } from 'next-intl/server';
import { RegisterForm } from '@/app/(auth)/_components/form-register';
import { siteConfig } from '@/config/site';
import { NextIntlClientProvider } from 'next-intl';
import { pick } from 'lodash';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale });
  return {
    title: `${t('metadata.auth.register_at')} - ${siteConfig.name}`,
    description: t('metadata.auth.register_description'),
    robots: { index: false, follow: false, nocache: false },
  };
}

const RegisterPage = async () => {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, 'auth.client')}>
      <RegisterForm />
    </NextIntlClientProvider>
  );
};

export default RegisterPage;
