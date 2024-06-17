'use client';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { UserAvatar } from '@/components/shared/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { LogOut } from 'lucide-react';
import type { User } from 'next-auth';
import { Icons } from '@/components/shared/icons';
import { Container, Link, Text } from '@/components/container';

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'name' | 'image' | 'email'>;
  isCollapsed?: boolean;
}

export function UserAccountNav({ user, isCollapsed }: UserAccountNavProps) {
  const t = useTranslations('navbar.user_account');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none ring-0">
        <UserAvatar
          user={{
            name: user?.name || '',
            image: user?.image || '',
            email: user?.email || '',
          }}
          className=""
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <Container.Div className="flex items-center justify-start gap-2 p-2">
          <Container.Div className="flex flex-col space-y-1 leading-none">
            {user?.name && (
              <Text.Small className="font-medium">{user?.name}</Text.Small>
            )}
            {user?.email && (
              <Text.Small className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </Text.Small>
            )}
          </Container.Div>
        </Container.Div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/drive"
            className="flex items-center space-x-2.5"
          >
            <Icons.dashboard className="size-4" />
            <Text.Small>{t('dashboard')}</Text.Small>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/pricing" className="flex items-center space-x-2.5">
            <Icons.billing className="size-4" />
            <Text.Small>{t('uTextgrade')}</Text.Small>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-2.5"
          >
            <Icons.settings className="size-4" />
            <Text.Small>{t('settings')}</Text.Small>
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
          <Container.Div className="flex items-center space-x-2.5">
            <LogOut className="size-4" />
            <Text.Small>{t('logout')}</Text.Small>
          </Container.Div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
