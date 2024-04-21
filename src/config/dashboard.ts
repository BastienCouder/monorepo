import { Icons } from '@/components/shared/icons';
import { DashboardConfig } from '@/types';
import { useTranslations } from 'next-intl';

export function useDashboardConfig(): DashboardConfig {
  const t = useTranslations('DashboardConfig');

  // Configuration object using translated strings
  const dashboardConfig: DashboardConfig = {
    mainNav: [
      {
        title: t('Documentation'),
        href: '/docs',
      },
      {
        title: t('Support'),
        href: '/support',
        disabled: true,
      },
    ],
    sidebarNav: [
      // {
      //   title: t('My Files'),
      //   href: '/dashboard/files',
      //   icon: Icons.file,
      // },
      {
        title: t('Drive'),
        href: '/dashboard/drive',
        icon: Icons.drive,
      },
      {
        title: t('AI'),
        href: '/dashboard/ai',
        icon: Icons.spinner,
      },
      // {
      //   title: t('Upgrade'),
      //   href: '/pricing',
      //   icon: Icons.billing,
      // },
      // {
      //   title: t('Settings'),
      //   href: '/dashboard/settings',
      //   icon: Icons.settings,
      // },
    ],
  };

  return dashboardConfig;
}
