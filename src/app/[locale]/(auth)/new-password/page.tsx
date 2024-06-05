import { NewPasswordForm } from '@/components/auth/form-new-password';
import { siteConfig } from '@/config/site';
import { pick } from 'lodash';
import { Metadata } from 'next';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale });
  return {
    title: `${t('metadata.auth.new_password')} - ${siteConfig.name}`,
    description: t('metadata.auth.new_password_description'),
    robots: { index: false, follow: false, nocache: false },
  };
}

const NewPasswordPage = async () => {
  const t = await getTranslations('auth.client');
  const messages = await getMessages()
  return (
    <section className="w-full space-y-4 lg:px-32">
      <h1 className="text-center">{t('new_password')}</h1>

      <NextIntlClientProvider
        messages={
          pick(messages, 'auth.client')
        }
      >
        <NewPasswordForm />
      </NextIntlClientProvider>

    </section>
  );
};

export default NewPasswordPage;
