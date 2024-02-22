import { Icons } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface ILogo {
  isCollapsed: boolean;
}

export default function Logo({ isCollapsed }: ILogo) {
  return (
    <div
      className={cn(
        'flex h-[52px] items-center',
        'justify-center',
        isCollapsed ? 'h-[52px]' : 'px-2'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          isCollapsed &&
            'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:hidden [&>svg]:w-auto'
        )}
      >
        <Icons.logo />
        <span className={cn('ml-2', isCollapsed && 'hidden')}>
          {siteConfig.name}
        </span>
      </div>
    </div>
  );
}
