'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { adminLinks, appLinks } from '@/config/links';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  // SheetClose,
  SheetContent,
  // SheetDescription,
  // SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

interface IMobileNav extends React.HTMLAttributes<HTMLElement> {
  userRole?: string;
}

// eslint-disable-next-line no-unused-vars
export const MobileNav = ({ userRole }: IMobileNav) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-full space-y-2">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <div className="w-full">
          <div className={cn('pt-4')}>
            <div className="grid gap-2 grid-flow-row auto-rows-max text-sm">
              {adminLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.route}
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'default',
                    }),
                    'px-2 py-2 flex justify-start font-medium transition-colors hover:text-primary',
                    'transition-colors hover:text-foreground/80',
                    pathname === item.route &&
                      'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white border-r-4 text-primary border-primary rounded-r-none',
                    'justify-start hover:text-primary'
                  )}
                >
                  {item.title}
                </Link>
              ))}
              <Separator />
              {appLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.route}
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'default',
                    }),
                    'px-2 py-2 flex justify-start font-medium transition-colors hover:text-primary',
                    'transition-colors hover:text-foreground/80',
                    pathname === item.route &&
                      'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white border-r-4 text-primary border-primary rounded-r-none',
                    'justify-start hover:text-primary'
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
