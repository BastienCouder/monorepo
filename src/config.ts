import { Pathnames } from 'next-intl/navigation';

export const locales = ['fr', 'en', 'es'] as const;

export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  // '/about-us': {
  //   fr: '/about-us',
  //   en: '/a-propos',
  //   es: '/a-propos',
  // },
  // '/contact-us': {
  //   fr: '/contact-us',
  //   en: '/contactez-nous',
  //   es: '/contactez-nous',
  // },
};

export const localePrefix = 'as-needed';

export type AppPathnames = keyof typeof pathnames;
