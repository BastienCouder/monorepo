import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="px-4 py-8 w-full space-y-3 overflow-auto">
      <div className="flex w-full items-center justify-between overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-56" />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-24 h-8" />
            <Skeleton className="size-8" />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        <div className="w-full gap-4 flex flex-col lg:flex-row">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <div className="flex w-full flex-col justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        <div className="w-full gap-4 flex flex-col lg:flex-row">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
      <div className="flex w-full lg:flex-col items-end justify-end gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        <div className="w-full flex pl-0 lg:pl-4 justify-end flex-col items-end lg:flex-row">
          <Skeleton className="h-24 w-full lg:w-1/2" />
        </div>
      </div>
    </div>
  );
}
