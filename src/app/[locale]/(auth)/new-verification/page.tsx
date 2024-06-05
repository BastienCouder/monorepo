import { NewVerificationForm } from '@/components/auth/form-new-verification';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import pick from 'lodash/pick';
import { NextIntlClientProvider, } from 'next-intl';
import { getMessages } from 'next-intl/server';


export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale });
  return {
    title: `${t('metadata.auth.check_auth')} - ${siteConfig.name}`,
    description: t('metadata.auth.check_auth_description'),
    robots: { index: false, follow: false, nocache: false },
  };
}

const NewVerificationPage = async () => {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider
      messages={
        pick(messages, 'auth.client')
      }
    >
      <NewVerificationForm />
    </NextIntlClientProvider>
  )
};

export default NewVerificationPage;
