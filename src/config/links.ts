'use client';

import { Icons } from '@/components/icons';

export const adminLinks = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    label: '',
    icon: Icons.gauge,
    isNotAllowed: ['USER'],
  },
];

export const dashboardLinks = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    label: '',
    icon: Icons.gauge,
  },
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
    title: 'Favories',
    route: '/favories',
    label: '',
    icon: Icons.star,
  },
  {
    title: 'Trophées',
    route: '/trophy',
    label: '',
    icon: Icons.trophy,
  },
];
