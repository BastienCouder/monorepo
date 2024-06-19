'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';
import { useRouteParam } from '@/providers/route-params-provider';
import { Separator } from '@/components/ui';

interface INav {
  isCollapsed: boolean;
  links: any;
}

export function Nav({ links, isCollapsed }: INav) {
  const pathname = usePathname();
  const { setParam } = useRouteParam();

  const handleBackClick = () => {
    setParam(null);
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col data-[collapsed=true]:py-2"
    >
      <nav className={`${isCollapsed ? 'gap-4' : 'gap-4'} grid px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2`}>
        {links.map((link: any, index: number) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  onClick={handleBackClick}
                  href={link.href}
                  className={cn(
                    buttonVariants({
                      variant: pathname?.startsWith(link.href)
                        ? 'default'
                        : 'icon',
                      size: 'icon',
                    }),
                    'h-9 w-9 rounded-full',
                    pathname?.startsWith(link.href) &&
                    'rounded-full'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <Separator />
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.href}
              onClick={handleBackClick}
              className={cn(
                buttonVariants({
                  variant: pathname?.startsWith(link.href)
                    ? 'default'
                    : 'ghost',
                }),
                pathname?.startsWith(link.href) && '',
                'justify-start  hover:bg-primary  hover:text-background'
              )}
            >
              <link.icon className="mr-3 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    'ml-auto',
                    pathname?.startsWith(link.href) &&
                    'text-background hover:bg-background dark:text-white'
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
