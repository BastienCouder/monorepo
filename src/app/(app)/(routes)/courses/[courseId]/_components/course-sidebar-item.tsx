'use client';

import { BookOpen, CheckCircle, Lock } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : BookOpen;
  const isActive = pathname?.includes(id);

  const onClick = () => {
    if (!isLocked) {
      router.push(`/courses/${courseId}/chapters/${id}`);
    }
  };

  return (
    <>
      <div className="max-w-full hidden xl:block">
        <button
          onClick={onClick}
          type="button"
          className={cn(
            'w-full group border-[1px] flex items-center gap-x-2 text-primary text-sm pl-4 transition-all bg-background hover:text-background hover:bg-secondary',
            isActive &&
              ' text-background bg-primary hover:text-background hover:bg-secondary',
            isCompleted &&
              'bg-emerald-500/70 text-background hover:text-background hover:bg-green-700',
            isCompleted && isActive && 'bg-emerald-500/70'
          )}
        >
          <Icon
            size={22}
            className={cn(
              'text-primary group-hover:text-background',
              isActive && 'text-background group-hover:text-background',
              isCompleted && 'text-background'
            )}
          />
          <div className="w-full px-4 justify-start gap-x-2 py-4">{label}</div>
        </button>
      </div>
      <div className="block xl:hidden">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={onClick}
              className={cn(
                'h-6 w-6 border',
                isActive && ' bg-primary hover:bg-secondary',
                isCompleted && 'bg-emerald-500/70 hover:bg-green-700',
                isCompleted && isActive && 'bg-emerald-500/70'
              )}
            ></TooltipTrigger>
            <TooltipContent>
              <p className="px-2 py-1 font-bold">{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};
