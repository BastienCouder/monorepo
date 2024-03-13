import { LucideIcon } from 'lucide-react';

import { iconVariants } from '@/components/icon-badge';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  numberOfItems: number;
  variant?: 'default' | 'success' | 'primary';
  label: string;
  icon: LucideIcon;
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-4 p-3">
      <Icon className={cn(iconVariants({ variant, size: 'default' }))} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? 'Cours' : 'Cours'}
        </p>
      </div>
    </div>
  );
};
