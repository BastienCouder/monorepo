'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { UserAvatar } from '@/components/shared/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditCard, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import type { User } from 'next-auth';
import { Icons } from '../shared/icons';

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'name' | 'image' | 'email'>;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const t = useTranslations('navbar.user_account');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none ring-0'>
        <UserAvatar
          user={{ name: user?.name || '', image: user?.image || '', email: user?.email || '' }}
          className="size-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user?.name}</p>}
            {user?.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/drive"
            className="flex items-center space-x-2.5"
          >
            <Icons.dashboard className="size-4" />
            <p className="text-sm">{t('dashboard')}</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/pricing" className="flex items-center space-x-2.5">
            <Icons.billing className="size-4" />
            <p className="text-sm">{t('upgrade')}</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-2.5"
          >
            <Icons.settings className="size-4" />
            <p className="text-sm">{t('settings')}</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/`,
            });
          }}
        >
          <div className="flex items-center space-x-2.5">
            <LogOut className="size-4" />
            <p className="text-sm">{t('logout')}</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
