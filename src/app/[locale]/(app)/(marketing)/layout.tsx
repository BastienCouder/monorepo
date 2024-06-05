import { NavBar } from '@/components/layout/navbar';
import { marketingConfig } from '@/config/marketing';
import { currentUser } from '@/lib/auth';
import { pick } from 'lodash';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Suspense } from 'react';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await currentUser();
  const messages = await getMessages()

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback="">
        <NextIntlClientProvider
          messages={
            pick(messages, 'navbar')
          }
        >
          <NavBar user={user} items={marketingConfig.mainNav} scroll={true} />
        </NextIntlClientProvider>
      </Suspense>

      <main className="flex-1">{children}</main>
    </div>
  );
}
