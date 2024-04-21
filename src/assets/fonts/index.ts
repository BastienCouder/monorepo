import localFont from 'next/font/local';
import { Inter as FontSans, Urbanist, Raleway } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontUrban = Urbanist({
  subsets: ['latin'],
  variable: '--font-urban',
});

export const fontRaleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway ',
});

export const fontHeading = localFont({
  src: './CalSans-SemiBold.woff2',
  variable: '--font-heading',
});
