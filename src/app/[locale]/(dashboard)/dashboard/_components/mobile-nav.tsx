'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { dashboardLinks } from '@/config/links';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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
        <Button aria-label="menu" variant="outline" size="icon">
          <Menu className="h-6 w-6" aria-label="icon menu" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-full">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <div className="w-full">
          <div className={cn('pb-4')}>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              {dashboardLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.route}
                  className={cn(
                    'px-2 py-1 text-lg font-medium transition-colors hover:text-primary',
                    'transition-colors hover:text-foreground/80',
                    pathname === item.route
                      ? 'font-semibold text-foreground'
                      : 'text-foreground/60'
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
