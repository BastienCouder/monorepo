'use client';

import Spinner from '@/components/spinner';

export default function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-bacground">
      <Spinner />
    </div>
  );
}
