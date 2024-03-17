import { Icons } from '@/components/shared/icons';
import { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: 'Documentation',
      href: '/docs',
    },
    {
      title: 'Support',
      href: '/support',
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: 'My Files',
      href: '/dashboard/files',
      icon: Icons.file,
    },
    {
      title: 'Drive',
      href: '/dashboard/drive',
      icon: Icons.aperture,
    },
    {
      title: 'Sort AI',
      href: '/dashboard/sort-ai',
      icon: Icons.eye,
    },
    {
      title: 'Upgrade',
      href: '/pricing',
      icon: Icons.billing,
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Icons.settings,
    },
  ],
};
