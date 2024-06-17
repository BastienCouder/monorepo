'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <h2 className="mb-5 text-center text-xl font-semibold">{message}</h2>
      <Button onClick={handleRefresh} variant="default">
        Try again
      </Button>
    </div>
  );
}
