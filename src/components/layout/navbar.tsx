'use client';

import useScroll from '@/hooks/use-scroll';
import { MainNavItem } from '@/types';
import { User } from 'next-auth';
import { MainNav } from './main-nav';
import { UserAccountNav } from './user-account-nav';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSigninModal } from '@/hooks/use-signin-modal';
import { ModeToggle } from './mode-toggle';
import { useTranslations } from 'next-intl';
import { LangSwitcher } from '../shared/language-switcher';

interface NavBarProps {
  user: Pick<User, 'name' | 'image' | 'email'> | undefined;
  items?: MainNavItem[];
  children?: React.ReactNode;
  rightElements?: React.ReactNode;
  scroll?: boolean;
}

export function NavBar({
  user,
  items,
  children,
  rightElements,
  scroll = false,
}: NavBarProps) {
  const t = useTranslations('navbar');
  const scrolled = useScroll(50);
  const signInModal = useSigninModal();

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${scroll ? (scrolled ? 'border-b' : 'bg-background/0') : 'border-b'
        }`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <MainNav items={items}>{children}</MainNav>
        <div className="flex items-center space-x-3">
          {rightElements}
          <div className="px-2">
            <ModeToggle />
          </div>
          <div className="px-2">
            <LangSwitcher />
          </div>
          {!user ? (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
            >
              {t('login_page')}
            </Link>
          ) : <UserAccountNav user={user} />}
          {/* {user ? (
            <UserAccountNav user={user} />
          ) : (
            <Button
              className="px-3"
              variant="default"
              size="sm"
              onClick={signInModal.onOpen}
            >
              {t('sign_in')}
            </Button>
          )} */}
        </div>
      </div>
    </header>
  );
}
