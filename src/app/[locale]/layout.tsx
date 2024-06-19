import '@/styles/globals.css';
import pick from 'lodash/pick';
import { fontHeading, fontRaleway, fontSans, fontUrban } from '@/assets/fonts';
import { Analytics } from '@/components/analytics';
import { ThemeProvider } from '@/components/providers';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SocketProvider } from '@/providers/socket-provider';
import { Viewport } from 'next';

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: never };
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'React',
    'Prisma',
    'PlanetScale',
    'Auth.js',
    'shadcn ui',
    'Resend',
    'React Email',
    'Stripe',
  ],
  authors: [
    {
      name: 'bastiencdr',
    },
  ],
  creator: 'bastiencdr',
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@miickasmt',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const RootLayout = async ({
  children,
  params: { locale },
}: RootLayoutProps) => {
  const session = await auth();
  const messages = await getMessages({ locale });

  return (
    <SessionProvider session={session}>
      <html lang={locale} suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable,
            fontUrban.variable,
            fontRaleway.variable,
            fontHeading.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={pick(messages, 'Error')}>
              <SocketProvider>{children}</SocketProvider>
            </NextIntlClientProvider>
            <Analytics />
            {/* <Toaster /> */}
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
};

export default RootLayout;
