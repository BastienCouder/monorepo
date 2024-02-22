'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { administrationLinks, primaryLinks } from '@/config/links';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
      <SheetContent className="w-[300px] sm:w-full">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription> */}
        </SheetHeader>
        <div className="w-full">
          <div className={cn('pb-4')}>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              {primaryLinks.map(
                (item, index) => (
                  // !item?.isNotAllowed?.includes(userRole) ? (
                  <Link
                    key={index}
                    href={item.route}
                    className={cn(
                      'px-2 py-1 text-lg font-medium transition-colors hover:text-primary',
                      'transition-colors hover:text-foreground/80',
                      pathname === item.route
                        ? 'font-semibold text-foreground'
                        : 'text-foreground/60'
                      // "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      // pathname !== item.route && "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                )
                // ) : null
              )}
              <Separator />
              {administrationLinks.map(
                (item, index) => (
                  // !item?.isNotAllowed?.includes(userRole) ? (
                  <Link
                    key={index}
                    href={item.route}
                    className={cn(
                      'px-2 py-1 text-lg font-medium transition-colors hover:text-primary',
                      'transition-colors hover:text-foreground/80',
                      pathname === item.route
                        ? 'font-semibold text-foreground'
                        : 'text-foreground/60'
                      // "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      // pathname !== item.route && "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                )
                // ) : null
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
