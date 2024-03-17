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
import { CurrentFolderPath, ExtendedPrismaFolder } from './actions-folder';
import { isNotDefaultFolder } from '@/lib/utils';
import { renameFolder } from '@/server-actions/user/rename-folder-user';
import { useCurrentUser } from '@/hooks/use-current-user';
import { SelectFolderFilesForm } from './select-folder-files';

export interface DirectoryCardProps {
  key: number;
  folder: ExtendedPrismaFolder;
  usedSpace?: number;
  color: string;
  Icon: any;
  handleFolderClick: ({ folderName, folderId }: CurrentFolderPath) => void;
  currentPath: CurrentFolderPath;
  handleCheckboxChange: any;
  isChecked: boolean;
  handleDeleteFolder: (folderId: string) => void;
}

const DirectoryCard = ({
  key,
  folder,
  color,
  Icon,
  currentPath,
  usedSpace,
  handleFolderClick,
  handleDeleteFolder,
  handleCheckboxChange,
  isChecked,
}: DirectoryCardProps) => {
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
        await renameFolder(currentPath.folderId, userId, newName),
          setRenamingItem(null);
      }
    } catch (error) {
      console.error('Error renaming file or folder:', error);
    }
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
                stroke-width="1"
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
                isFile(folder.name) ? downloadFile(folder.name) : null
              }
            >
              {isFile(folder.name) ? (
                <Download size={17} color={color} />
              ) : null}
            </div>
            <div
              className=""
              onClick={() =>
                !isFile(folder.name) && isNotDefaultFolder(folder.name)
                  ? handleDeleteFolder(folder.id)
                  : null
              }
            >
              {!isFile(folder.name) && isNotDefaultFolder(folder.name) ? (
                <Trash size={17} color={color} />
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div
        onClick={() =>
          isFile(folder.name)
            ? null
            : handleFolderClick({
                folderName: folder.name,
                folderId: folder.id,
              })
        }
        className="space-y-2"
      >
        <div className="relative w-16 h-16 p-4">
          {isFile(folder.name) ? (
            <>
              <div
                className="rounded-md h-full w-full top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 absolute"
                style={{ backgroundColor: color, opacity: 0.2 }}
              ></div>
              <div
                className={`flex justify-center items-center rounded-md opacity-1 bg-[${color}]`}
              >
                {getFileIcon(folder.name)}
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
        {renamingItem === folder.name ? (
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
            className={`font-bold ${isFile(folder.name) ? 'cursor-pointer' : ''}`}
            onDoubleClick={() => handleDoubleClick(folder.name)}
          >
            {folder.name}
          </h4>
        )}

        {!isFile(folder.name) ? (
          <>
            <div className="bg-[#e0e0e0] rounded-lg w-full h-[4px]">
              <div
                className="rounded-lg h-full"
                style={{ width: `${usedPercentage}%`, backgroundColor: color }}
              ></div>
            </div>
            <p className="flex text-sm font-bold justify-between">
              <span>
                {folder.totalFiles} {folder.totalFiles! > 1 ? 'files' : 'file'}{' '}
              </span>{' '}
              <span>{folder.totalSize} Go</span>
            </p>
          </>
        ) : null}
      </div>
    </li>
  );
};

export default DirectoryCard;
