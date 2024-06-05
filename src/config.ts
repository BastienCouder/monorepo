import { Pathnames } from 'next-intl/navigation';
import FlagGB from './assets/locales/en-flag';
import FlagFR from './assets/locales/fr-flag';

export const locales = ['fr', 'en', 'es'] as const;

export const localeNames: {
  [key: string]: {
    name: string;
    flag: React.FC<React.SVGProps<SVGSVGElement>>;
  };
} = {
  en: { name: 'English', flag: FlagGB },
  fr: { name: 'Français', flag: FlagFR },
};
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
