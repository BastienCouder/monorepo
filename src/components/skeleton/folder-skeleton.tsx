import { Skeleton } from '@/components/ui/skeleton';

export function FolderSkeleton() {
  return (
    <div className="w-full space-y-3 overflow-auto">
      <div className="flex w-full items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        <div className="w-full gap-6 flex flex-col lg:flex-row">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
      <div className="flex w-full flex-col justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        <div className="w-full gap-6 flex flex-col lg:flex-row">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
