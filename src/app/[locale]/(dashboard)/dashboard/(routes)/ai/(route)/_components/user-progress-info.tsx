'use client';
import React from 'react';
import { formatStorage } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface UserStorageInfoProps {
  user: {
    storageUsed: number;
    storageLimit: number;
  };
}

export default function UserStorageInfo({ user }: UserStorageInfoProps) {
  const usagePercentage = (user.storageUsed / user.storageLimit) * 100;
  console.log(user);

  return (
    <div className="w-full pb-2">
      <small>
        {Math.round((user.storageUsed / user.storageLimit) * 100)} used of 100 %
      </small>
      <Progress
        value={usagePercentage}
        variant={usagePercentage >= 100 ? 'success' : 'default'}
      />
    </div>
  );
}
