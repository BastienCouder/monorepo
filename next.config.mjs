/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggresiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withNextIntl(
  withPWA({
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
        { protocol: 'https', hostname: 'utfs.io' },
      ],
    },

    webpackDevMiddleware: (config) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      return config;
    },
  })
);
