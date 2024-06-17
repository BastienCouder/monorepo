import { Icons } from '@/components/shared/icons';
import { DashboardConfig } from '@/types';
import { useTranslations } from 'next-intl';

export function useDashboardConfig() {
  const t = useTranslations('navbar');

  // Configuration object using translated strings
  const dashboardConfig: DashboardConfig = {
    mainNav: [
      {
        title: t('main_nav.documentation'),
        href: '/docs',
      },
      {
        title: t('main_nav.support'),
        href: '/support',
        disabled: true,
      },
    ],
    sidebarNav: [
      {
        title: t('sidebar_nav.documentation'),
        href: '/docs',
        icon: Icons.document,
      },
      {
        title: t('sidebar_nav.documentation'),
        href: '/dashboard/drive',
        icon: Icons.drive,
      },
      {
        title: t('sidebar_nav.upgrade'),
        href: '/pricing',
        icon: Icons.billing,
      },
      {
        title: t('sidebar_nav.settings'),
        href: '/dashboard/settings',
        icon: Icons.settings,
      },
    ],
  };

  return dashboardConfig;
}
