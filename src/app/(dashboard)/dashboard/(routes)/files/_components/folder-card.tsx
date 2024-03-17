'use client';
import { Badge } from '@/components/ui/badge';
import { Download, Ellipsis, Trash } from 'lucide-react';
import React from 'react';
import getFileIcon from './icon-file';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CurrentFolderPath } from '../actions-folder';
import { isNotDefaultFolder } from '@/lib/utils';

export interface DirectoryCardProps {
  key: number;
  id: string;
  name: string;
  usedSpace?: number;
  color: string;
  Icon: any;
  handleFolderClick: ({ folderName, folderId }: CurrentFolderPath) => void;
  currentPath: CurrentFolderPath;
  handleCheckboxChange: any;
  isChecked: boolean;
  totalSize?: number;
  totalFiles?: number;
  handleDeleteFolder: (folderId: string) => void;
}

const DirectoryCard = ({
  key,
  id,
  name,
  usedSpace,
  color,
  Icon,
  currentPath,
  handleFolderClick,
  isChecked,
  handleCheckboxChange,
  totalSize,
  totalFiles,
  handleDeleteFolder,
}: DirectoryCardProps) => {
  const [renamingItem, setRenamingItem] = React.useState<string | null>(null);
  const [newName, setNewName] = React.useState<string>('');

  const totalSpace = 20;
  const usedPercentage = (usedSpace! / totalSpace) * 100;

  const handleDoubleClick = (itemName: string) => {
    setRenamingItem(itemName);
    setNewName(itemName);
  };
  const isFile = (name: string) => name.includes('.');
  const renameItem = async (oldName: string, newName: string) => {
    try {
      const response = await fetch('http://localhost:9000/api/file', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldName, newName, path: currentPath }),
      });

      if (response.ok) {
      } else {
        throw new Error('Failed to rename');
      }
    } catch (error) {
      console.error('Error renaming file or folder:', error);
    }
    setRenamingItem(null);
  };

  const downloadFile = (fileName: string) => {
    const url = `http://localhost:9000/api/download?path=${encodeURIComponent(currentPath + '/' + fileName)}`;
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
        <Checkbox
          className="w-5 h-5"
          onChange={handleCheckboxChange}
          checked={isChecked}
        />
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
              onClick={() => (isFile(name) ? downloadFile(name) : null)}
            >
              {isFile(name) ? <Download size={17} color={color} /> : null}
            </div>
            <div
              className=""
              onClick={() => (!isFile(name) && isNotDefaultFolder(name) ? handleDeleteFolder(id) : null)}
            >
              {!isFile(name) && isNotDefaultFolder(name) ? <Trash size={17} color={color} /> : null}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div
        onClick={() =>
          isFile(name)
            ? null
            : handleFolderClick({ folderName: name, folderId: id })
        }
        className="space-y-2"
      >
        <div className="relative w-16 h-16 p-4">
          {isFile(name) ? (
            <>
              <div
                className="rounded-md h-full w-full top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 absolute"
                style={{ backgroundColor: color, opacity: 0.2 }}
              ></div>
              <div
                className={`flex justify-center items-center rounded-md opacity-1 bg-[${color}]`}
              >
                {getFileIcon(name)}
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
        {renamingItem === name ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => renameItem(name, newName)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                renameItem(name, newName);
              }
            }}
          />
        ) : (
          <h4
            className={`font-bold ${isFile(name) ? 'cursor-pointer' : ''}`}
            onDoubleClick={() => handleDoubleClick(name)}
          >
            {name}
          </h4>
        )}

        {!isFile(name) ? (
          <>
            <div className="bg-[#e0e0e0] rounded-lg w-full h-[4px]">
              <div
                className="rounded-lg h-full"
                style={{ width: `${usedPercentage}%`, backgroundColor: color }}
              ></div>
            </div>
            <p className="flex text-sm font-bold justify-between">
              <span>
                {totalFiles} {totalFiles! > 1 ? 'files' : 'file'}{' '}
              </span>{' '}
              <span>{totalSize} Go</span>
            </p>
          </>
        ) : null}
      </div>
    </li>
  );
};

export default DirectoryCard;
