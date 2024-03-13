'use client';

import { Icons } from '@/components/icons';

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
    title: 'Utilisateurs',
    route: '/dashboard/users',
    label: '',
    icon: Icons.user,
  },
  {
    title: 'Cours',
    label: '',
    route: '/dashboard/courses',
    icon: Icons.course,
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
    title: 'Cours',
    route: '/courses',
    label: '',
    icon: Icons.course,
  },
  {
    title: 'Progression',
    route: '/profile',
    label: '',
    icon: Icons.user,
  },
];
