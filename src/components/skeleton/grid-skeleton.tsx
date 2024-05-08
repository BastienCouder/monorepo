import { Skeleton } from '@/components/ui/skeleton';

export function GridSkeleton() {
  return (
    <div className="w-full space-y-3 overflow-auto">
      {/* <div className="flex justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-36" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div> */}
      <div className="flex w-full items-center justify-between gap-4 overflow-auto py-1 sm:flex-row sm:gap-8">
        <div className="w-full gap-6 flex flex-col lg:flex-row">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <div className="flex w-full flex-col justify-between gap-4 overflow-auto  py-1 sm:flex-row sm:gap-8">
        <div className="w-full gap-6 flex flex-col lg:flex-row">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <div className="flex w-full flex-col justify-between gap-4 overflow-auto  py-1 sm:flex-row sm:gap-8">
        <div className="w-full gap-6 flex flex-col lg:flex-row">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
