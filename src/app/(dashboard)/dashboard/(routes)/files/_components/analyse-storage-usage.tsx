'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getFolderDetails } from '../_lib/folder-custom-details';
import { useTheme } from 'next-themes';
import { LucideIcon } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { User } from '@/schemas/db';
import { UseThemeProps } from 'next-themes/dist/types';
import { formatStorage } from '@/lib/utils';

export interface Directory {
  name: string;
  usedSpace: number;
  Icon?: LucideIcon;
  filesCount?: number;
}

export type StorageUsageProps = {
  summary: {
    folders: {
      name: string;
      totalSize: number;
      totalFiles: number;
    }[];
    totalSize: number;
    totalFiles: number;
  };
  user: User
};

interface GraphDataItem {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;

  payload?: { payload: GraphDataItem; color: string }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;

    return (
      <div className="p-3 text-background text-sm bg-foreground rounded-lg">
        <p>{`${name} : ${formatStorage(value)}`}</p>
      </div>
    );
  }

  return null;
};

export default function StorageUsage({ summary, user }: StorageUsageProps) {
  const folderColors = summary.folders.map(folder => getFolderDetails(folder.name).color);

  let folderData = summary.folders.map((folder) => ({
    name: folder.name,
    value: Math.max(folder.totalSize, 0.01),
  }));

  if (
    summary.totalSize > 0 &&
    folderData.reduce((acc, folder) => acc + folder.value, 0) === 0
  ) {
    folderData = folderData.map((folder, index) => ({
      ...folder,
      value: summary.totalSize / folderData.length,
    }));
  }


  return (
    <div className="w-full bg-background flex justify-center items-center flex-col p-4 rounded-md">
      <section className="relative" style={{ width: 300, height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={folderData}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {folderData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={folderColors[index % folderColors.length]}
                  className="rounded-full"
                />
              ))}
            </Pie>
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<CustomTooltip />}
            />
          </PieChart>
        </ResponsiveContainer>
        <p
          className="font-bold absolute flex flex-col gap-px items-center -z-1"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="text-base">{formatStorage(user?.storageUsed)}</span>
          <span className="text-sm">of {formatStorage(user?.storageLimit)}</span>
        </p>
      </section>
      {/* <div className='text-center'>
                <p>Total: {totalSpace} Go</p>
                <p>Utilisé: {totalUsedSpace} Go</p>
                <p>Libre: {freeSpace} Go</p>
              </div> */}

      <div className="w-full flex flex-col gap-4 mt-6">
        {summary.folders.map((folder, index) => {
          const { color, Icon } = getFolderDetails(folder.name);
          return (
            <div key={`${index}`} className="flex gap-4 items-center">
              <div className="rounded-md p-2 bg-muted h-10 w-10">
                {Icon && <Icon color={color} />}
              </div>
              <div className="w-full flex justify-between">
                <p className="text-sm flex flex-col">
                  <span className="font-bold">{folder.name}</span>
                  <span className="text-foreground/70 text-xs">
                    {folder.totalFiles}{' '}
                    {folder.totalFiles > 1 ? 'files' : 'file'}
                  </span>
                </p>
                <p className="text-sm font-bold">
                  {formatStorage(folder.totalSize)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
