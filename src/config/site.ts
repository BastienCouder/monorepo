import { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'LMS',
  description: '',
  dateFormate: 'MM/dd/yyyy',
  url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://zuupee.com',
};
