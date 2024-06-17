import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/container';

export const GridSkeleton = () => {
  return (
    <Container.Div className="w-full space-y-3 overflow-auto">
      {/* <Container className="flex justify-between">
        <Container className="flex gap-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-36" />
        </Container>
        <Container className="flex gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </Container>
      </Container> */}
      <Container.Div className="flex w-full items-center justify-between gap-4 overflow-auto py-1 sm:flex-row sm:gap-8">
        <Container.Div className="w-full gap-6 flex flex-col lg:flex-row">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Container.Div>
      </Container.Div>
      <Container.Div className="flex w-full flex-col justify-between gap-4 overflow-auto  py-1 sm:flex-row sm:gap-8">
        <Container.Div className="w-full gap-6 flex flex-col lg:flex-row">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Container.Div>
      </Container.Div>
      <Container.Div className="flex w-full flex-col justify-between gap-4 overflow-auto  py-1 sm:flex-row sm:gap-8">
        <Container.Div className="w-full gap-6 flex flex-col lg:flex-row">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Container.Div>
      </Container.Div>
      <Container.Div className="flex w-full flex-col justify-between gap-4 overflow-auto  py-1 sm:flex-row sm:gap-8">
        <Container.Div className="w-full gap-6 flex flex-col lg:flex-row">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </Container.Div>
      </Container.Div>
    </Container.Div>
  );
};
