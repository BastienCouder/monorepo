'use client';

import { Icons } from '@/components/shared/icons';

export const adminLinks = [
  {
    title: 'Dashboard',
    route: '/dashboard/courses',
    label: '',
    icon: Icons.gauge,
    isNotAllowed: ['USER'],
  },
];

export const dashboardLinks = [
  {
    title: 'Dashboard',
    route: '/dashboard/courses',
    label: '',
    icon: Icons.ellipsis,
    isNotAllowed: ['USER'],
  },
  {
    title: 'Paramètres',
    route: '/dashboard/settings',
    label: '',
    icon: Icons.settings,
  },
];
export const appLinks = [
  {
    title: 'Progression',
    route: '/profile',
    label: '',
    icon: Icons.user,
  },
];
