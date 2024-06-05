import { Icons } from '@/components/shared/icons';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AiFillFolderOpen } from 'react-icons/ai';

interface ILogo {
  isCollapsed: boolean;
}

export default function Logo({ isCollapsed }: ILogo) {
  return (
    <div
      className={cn(
        'flex h-[52px] items-start py-2',
        'justify-center',
        isCollapsed ? 'h-[52px]' : 'px-2'
      )}
    >
      <Link
        href={'/'}
        className={cn(
          'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          isCollapsed &&
          'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:hidden [&>svg]:w-auto'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
            isCollapsed &&
            'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:hidden [&>svg]:w-auto'
          )}
        >
          <div
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'icon',
              }),
              'h-9 w-9'
            )}
          >
            <span>
              {' '}
              <AiFillFolderOpen />
            </span>
          </div>
          <span className={cn('ml-2', isCollapsed && 'hidden')}>
            {siteConfig.name}
          </span>
        </div>
      </Link>
    </div>
  );
}
