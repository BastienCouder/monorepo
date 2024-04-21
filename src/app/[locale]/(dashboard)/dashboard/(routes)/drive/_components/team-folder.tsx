'use client';

import { Ellipsis, Folder } from 'lucide-react';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface DirectoryCardProps {
  key: number;
}

const DirectoryCard = ({ key }: DirectoryCardProps) => {
  return (
    <li key={key} className="bg-background p-4 rounded-md w-full space-y-4">
      <div className="w-full flex justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={`h-5 p-2
                         cursor-pointer bg-primary opacity-1/2`}
            >
              <Ellipsis size={20} color="background" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-12 justify-center p-2 cursor-pointer"></PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <div className="relative w-16 h-16 p-4">
          <>
            <div className="rounded-md h-full w-full top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 absolute"></div>
            <div
              className={`flex justify-center items-center rounded-md opacity-1 bg-primary`}
            >
              <Folder />
            </div>
          </>
        </div>
        <>
          <div className="bg-[#e0e0e0] rounded-lg w-full h-[4px]">
            <div
              className="rounded-lg h-full"
              // style={{ width: `${usedPercentage}%`, backgroundColor: color }}
            ></div>
          </div>
          <p className="flex text-sm font-bold justify-between">
            {/* <span>
              {totalFiles} {totalFiles! > 1 ? 'files' : 'file'}{' '}
            </span>{' '}
            <span>{totalSize} Go</span> */}
          </p>
        </>
      </div>
    </li>
  );
};

export default DirectoryCard;
