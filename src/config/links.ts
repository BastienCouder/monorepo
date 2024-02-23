'use client';

import { Icons } from '@/components/icons';

export const primaryLinks = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    label: '2',
    icon: Icons.gauge,
  },
  {
    title: 'Files',
    route: '/files',
    label: '3',
    icon: Icons.page,
  },
];

export const administrationLinks = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    label: '',
    icon: Icons.gauge,
  },
  {
    title: 'User Management',
    route: '/dashboard/users',
    label: '',
    icon: Icons.user,
    isNotAllowed: ['USER'],
  },
  {
    title: 'Courses',
    label: '',
    route: '/dashboard/courses',
    icon: Icons.course,
  },
  {
    title: 'Analytics',
    route: '/dashboard/analytics',
    label: '',
    icon: Icons.page,
  },
  {
    title: 'Settings',
    route: '/dashboard/settings',
    label: '',
    icon: Icons.settings,
  },
];
export const appLinks = [
  {
    title: 'Courses',
    route: '/course',
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
    title: 'Trophy',
    route: '/trophy',
    label: '',
    icon: Icons.trophy,
  },
];
