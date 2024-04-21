import React from 'react';
import { formatStorage } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface TeamStorageInfoProps {
    team: {
        storageUsed: number;
        storageLimit: number;
    };
}

export default function TeamStorageInfo({ team }: TeamStorageInfoProps) {
    const usagePercentage = (team.storageUsed / team.storageLimit) * 100;

    return (
        <div className='w-96 pb-2'>
            <small>
                {formatStorage(team.storageUsed)} used of {formatStorage(team.storageLimit)}
            </small>
            <Progress
                value={usagePercentage}
                variant={usagePercentage >= 100 ? 'success' : 'default'}
            />
        </div>
    );
};
