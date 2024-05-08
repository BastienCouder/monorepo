import { Icons } from '@/components/shared/icons';
import { useTranslations } from 'next-intl';

// Custom hook for admin links
export function useAdminLinks() {
  // const t = useTranslations('AdminLinks');

  const adminLinks = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      label: '',
      icon: Icons.gauge,
      isNotAllowed: ['USER'],
    },
  ];

  return adminLinks;
}

export function useDashboardLinks() {
  // const t = useTranslations('DashboardLinks');

  const dashboardLinks = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      label: '',
      icon: Icons.ellipsis,
      isNotAllowed: ['USER'],
    },
    {
      title: 'Settings',
      route: '/dashboard/settings',
      label: '',
      icon: Icons.settings,
    },
  ];

  return dashboardLinks;
}

export function useAppLinks() {
  // const t = useTranslations('AppLinks');

  const appLinks = [
    {
      title: 'Progress',
      route: '/profile',
      label: '',
      icon: Icons.user,
    },
  ];

  return appLinks;
}
