'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getFolderDetails } from '../_lib/folder-details';
import { MultiFileDropzone } from './dropzone';
import { useTheme } from 'next-themes';
import { User } from '@prisma/client';

export interface Directory {
  name: string;
  usedSpace: number;
  Icon?: any;
  filesCount?: any;
}

export type StorageUsageProps = {
  summary: {
    folders: {
      name: string;
      totalSizeGB: number;
      totalFiles: number;
    }[];
    totalSizeGB: number;
    totalFiles: number;
  };
  user: User;
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
        <p>{`${name} : ${value.toFixed(2)} GB`}</p>
      </div>
    );
  }

  return null;
};
export default function StorageUsage({ summary, user }: StorageUsageProps) {
  const theme = useTheme();
  const COLORS = [
    '#2146B5',
    '#0E9606',
    '#9216BB',
    '#BC8224',
    theme.theme === 'dark' ? '#D6E6E6' : '#555C5C',
  ];

  let folderData = summary.folders.map((folder) => ({
    name: folder.name,
    value: Math.max(folder.totalSizeGB, 0.01),
  }));
  // Si aucun espace n'est utilisé, diviser équitablement pour visualisation
  if (
    summary.totalSizeGB > 0 &&
    folderData.reduce((acc, folder) => acc + folder.value, 0) === 0
  ) {
    folderData = folderData.map((folder, index) => ({
      ...folder,
      value: summary.totalSizeGB / folderData.length,
    }));
  }

  const totalUsedSpace = folderData
    .reduce((acc, folder) => acc + folder.value, 0)
    .toFixed(2);
  const totalSpace = summary.totalSizeGB.toFixed(2);
  const freeSpace = (Number(totalSpace) - Number(totalUsedSpace)).toFixed(2);

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
                  fill={COLORS[index % COLORS.length]}
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
          className="font-bold absolute flex flex-col gap-px items-center"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="text-lg">{user.name}</span>
          <span>of {user.name}</span>
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
                  {folder.totalSizeGB.toFixed(2)} Go
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
