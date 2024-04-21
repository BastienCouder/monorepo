'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { FolderSkeleton } from '@/components/skeleton/folder-skeleton';
import { deleteItem } from '@/server-actions/user/delete-item';
import { User } from '@/schemas/db';
import { Download, Ellipsis, Trash } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import { formatStorage } from '@/lib/utils';
import FileOrFolderIcon from './files-folders-icon';
import { useSelection } from '../../../../ai/(route)/_context/select-item';
import { Checkbox } from '@/components/ui/checkbox';

interface GridFoldersFilesProps {
  data: any,
  basePath: string | undefined
  setCurrentPath: Dispatch<SetStateAction<string>>
}

export default function GridFoldersFiles({ data, basePath, setCurrentPath }: GridFoldersFilesProps) {
  const { selectedItems, toggleItem } = useSelection();
  const [isLoading, setIsLoading] = useState(false);

  const items = [...data.folders, ...data.files];

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <FolderSkeleton />
        </>) : (
        <>
          <ul className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6 justify-center sm:justify-start">
            {items.map(item => (
              <li key={item.id} className="bg-background p-4 rounded-md w-full space-y-4">
                <div className="w-full flex justify-between">
                  <div className="inline-flex items-center">
                    <label
                      className="relative flex items-center cursor-pointer"
                      htmlFor={`checkbox-${item.id}`}
                    >
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItem(item.id)}
                        aria-label={`Select ${item.name}`}
                        className="translate-y-[2px]"
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
                        style={{ opacity: 0.9 }}
                      >
                        <Ellipsis size={20} color="background" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-12 justify-center p-2 cursor-pointer">
                      <div>
                        <Download size={17} />
                      </div>
                      <div >
                        <Trash size={17} onClick={() => handleDeleteItem(item.id)} />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div
                  className={`relative space-y-2 flex flex-col justify-end ${item.size ? '' : 'pt-0'}`}
                  onDoubleClick={() => {
                    if (!item.hasOwnProperty('size')) {
                      setCurrentPath(item.id);
                    } else {
                      if (item.firebaseUrl) {
                        window.open(item.firebaseUrl, '_blank');
                      }
                    }
                  }}
                >
                  <div className={`flex rounded-md opacity-1`}>
                    <FileOrFolderIcon item={item} />
                  </div>
                  <div className='flex justify-between items-end'>
                    <h4 className={`font-bold cursor-pointer ml-1 ${item.size ? 'pt-2' : 'pt-0'}`}>
                      {item.name}
                    </h4>
                    <div>
                      {item.size && (
                        <div className='flex items-center py-0.5 px-2 bg-muted rounded-lg'><p className='text-xs'>{formatStorage(item.size)}</p></div>
                      )}
                    </div>
                  </div>
                  {item.filesAggregate && (
                    <div className='flex justify-between items-end'>
                      <p className={`cursor-pointer ml-1`}>
                        {item.filesAggregate && item.filesAggregate._count.id}{" "}{item.filesAggregate._count.id > 1 ? 'files' : 'file'}
                      </p>

                      <div>
                        {item.size ? (
                          <div className='flex items-center py-0.5 px-2 bg-muted rounded-lg'><p className='text-xs'>{formatStorage(item.size)}</p></div>
                        ) : <div className='flex items-center'><p className='text-sm font-semibold uppercase'>{formatStorage(item.filesAggregate._sum.size)}</p></div>}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )
      }
    </>
  );
}
