'use client';
import { Badge } from '@/components/ui/badge';
import { Download, Ellipsis, LucideProps, Trash } from 'lucide-react';
import React from 'react';
import getFileIcon from './icon-file';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { File, } from '@/schemas/db';

import { CurrentPath } from './actions-folder';

export interface FileCardProps {
  key: number;
  file: File
  usedSpace?: number;
  color: string;
  Icon: any;
  currentPath: CurrentPath;
  handleCheckboxChange: () => void;
  isChecked: boolean;
  handleDeleteFile: (fileId: string) => void;
  refreshData: () => void;
}

const FileCard = ({
  key,
  file,
  color,
  Icon,
  currentPath,
  usedSpace,
  handleDeleteFile,
  handleCheckboxChange,
  isChecked,
  refreshData
}: FileCardProps) => {
  const [renamingItem, setRenamingItem] = React.useState<string | null>(null);
  const [newName, setNewName] = React.useState<string>('');
  const totalSpace = 20;
  const usedPercentage = (usedSpace! / totalSpace) * 100;
  const user = useCurrentUser();
  const userId = user?.id;

  const handleDoubleClick = (itemName: string) => {
    setRenamingItem(itemName);
    setNewName(itemName);
  };
  const isFile = (name: string) => name.includes('.');
  const renameItem = async (newName: string) => {
    try {
      if (userId) {
        // await renameItem(file.id, userId, newName),
        setRenamingItem(null);
        refreshData()
      }
    } catch (error) {
      console.error('Error renaming file or folder:', error);
    }
  };


  const downloadFile = (fileName: string) => {
    const url = `http:localhost:9000/api/download?path=${encodeURIComponent(currentPath + '/' + fileName)}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <li key={key} className="bg-background p-4 rounded-md w-full space-y-4">
      <div className="w-full flex justify-between">
        <div className="inline-flex items-center">
          <label
            className="relative flex items-center cursor-pointer"
            htmlFor="checkbox"
          >
            <input
              type="checkbox"
              className="relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-primary transition-all checked:border-primary checked:bg-primary checked:before:bg-primary hover:before:opacity-10"
              id="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span className="absolute text-background transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={`h-5 p-2
                         cursor-pointer`}
              style={{ backgroundColor: color, opacity: 0.9 }}
            >
              <Ellipsis size={20} color="background" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-12 justify-center p-2 cursor-pointer">
            <div
              className=""
              onClick={() =>
                !isFile(file.name) ? downloadFile(file.name) : null
              }
            >
              {!isFile(file.name) ? (
                <Download size={17} color={color} />
              ) : null}
            </div>
            <div
              className=""
              onClick={() =>
                isFile(file.name)
                  ? handleDeleteFile(file.id)
                  : null
              }
            >
              {isFile(file.name) ? (
                <Trash size={17} color={color} />
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div

        className="space-y-2"
      >
        <div className="relative w-16 h-16 p-4">
          {isFile(file.name) ? (
            <>
              <div
                className="rounded-md h-full w-full top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 absolute"
                style={{ backgroundColor: color, opacity: 0.2 }}
              ></div>
              <div
                className={`flex justify-center items-center rounded-md opacity-1 bg-[${color}]`}
              >
                {getFileIcon(file.name)}
              </div>
            </>
          ) : (
            <>
              <div
                className="rounded-md h-full w-full top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 absolute"
                style={{ backgroundColor: color, opacity: 0.2 }}
              ></div>
              <div
                className={`flex justify-center items-center rounded-md opacity-1 bg-[${color}]`}
              >
                <Icon color={color} />
              </div>
            </>
          )}
        </div>
        {renamingItem === file.name ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => renameItem(newName)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                renameItem(newName);
              }
            }}
          />
        ) : (
          <h4
            className={`font-bold ${isFile(file.name) ? 'cursor-pointer' : ''}`}
            onDoubleClick={() => handleDoubleClick(file.name)}
          >
            {file.name}
          </h4>
        )}
      </div>
    </li>
  );
};

export default FileCard;
