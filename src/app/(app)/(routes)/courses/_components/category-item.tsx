'use client';

import qs from 'query-string';
import { IconType } from 'react-icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: IconType;
}

export const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categories');
  const currentTitle = searchParams.get('title');

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categories: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button onClick={onClick} type="button">
      <Badge
        className={cn(
          'text-sm flex items-center gap-x-1 transition',
          isSelected && 'bg-secondary'
        )}
      >
        {Icon && <Icon size={20} />}
        <div className="truncate">{label}</div>
      </Badge>
    </button>
  );
};
