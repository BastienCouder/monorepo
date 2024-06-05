'use client';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { deleteItem } from '@/server/user/delete-item';
import { buttonVariants } from '@/components/ui/button';
import { useSelection } from '../../app/[locale]/(dashboard)/dashboard/(routes)/ai/(route)/_context/select-item';
import { cn, formatDate, formatStorage } from '@/lib/utils';
import FileOrFolderIcon from '../../app/[locale]/(dashboard)/dashboard/(routes)/ai/(route)/_components/files-folders-icon';
import {
  boxesIntersect,
  useSelectionContainer,
} from '@air/react-drag-to-select';
import MouseSelection from './mouse-selection';
import { File, Folder } from '@/models/db';
import { Checkbox } from '../ui/checkbox';
import CreateRenameModal from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[teamId]/_components/create-rename-modal';

interface GridFoldersFilesProps {
  data:
  | {
    folders: Folder[];
    files: File[];
  }
  | undefined;
  setCurrentPath: Dispatch<SetStateAction<string>>;
}

export default function GridFoldersFiles({
  data,
  setCurrentPath,
}: GridFoldersFilesProps) {
  const [selectionBox, setSelectionBox] = useState<DOMRect | null>(null);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const selectableItems = useRef<
    { left: number; top: number; width: number; height: number }[]
  >([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const { selectedItems, setSelectedItems, toggleItem } = useSelection();

  const items = data ? [...data.folders, ...data.files] : [];

  useEffect(() => {
    const newSelectedItems = selectedIndexes.map((index) => items[index].id);
    // Prevent unnecessary updates by checking if the selection has changed
    if (JSON.stringify(newSelectedItems) !== JSON.stringify(selectedItems)) {
      setSelectedItems(newSelectedItems);
    }
  }, [selectedIndexes, items, selectedItems, setSelectedItems]);

  useEffect(() => {
    const elementsContainer = document.getElementById('elements-container');
    if (elementsContainer) {
      selectableItems.current = Array.from(elementsContainer.childNodes).map(
        (item: ChildNode) => {
          const { left, top, width, height } = (
            item as HTMLElement
          ).getBoundingClientRect();
          return {
            left: left + window.scrollX,
            top: top + window.scrollY,
            width,
            height,
          };
        }
      );
    }
  }, [items]);

  const handleElementClick = useCallback(
    (index: number, event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        setSelectedIndexes((prevSelectedIndexes) => {
          const isSelected = prevSelectedIndexes.includes(index);
          if (isSelected) {
            return prevSelectedIndexes.filter((i) => i !== index);
          } else {
            return [...prevSelectedIndexes, index];
          }
        });
        setLastSelectedIndex(index);
      } else if (event.shiftKey) {
        if (lastSelectedIndex !== null) {
          const range = [lastSelectedIndex, index].sort((a, b) => a - b);
          const indexesToSelect = Array.from(
            { length: range[1] - range[0] + 1 },
            (_, i) => i + range[0]
          );
          setSelectedIndexes((prevSelectedIndexes) => [
            ...new Set([...prevSelectedIndexes, ...indexesToSelect]),
          ]);
        } else {
          setSelectedIndexes([index]);
        }
        setLastSelectedIndex(index);
      }
    },
    [lastSelectedIndex]
  );

  const handleSelectionChange = useCallback(
    (box: DOMRect) => {
      const adjustedBox = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
      };

      setSelectionBox(adjustedBox);
      const indexesToSelect: number[] = [];
      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(adjustedBox, item)) {
          indexesToSelect.push(index);
        }
      });

      setSelectedIndexes(indexesToSelect);
      setLastSelectedIndex(null);
    },
    [selectableItems]
  );

  const handleDragStart = useCallback(
    (event: React.DragEvent, index: number) => {
      if (!selectedIndexes.includes(index)) {
        setSelectedIndexes([index]);
      }
    },
    [selectedIndexes]
  );

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleRenameItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
    } catch (error) {
      console.error('Error renaming item:', error);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden p-1">
        <MouseSelection
          onSelectionChange={handleSelectionChange}
          hoverIndex={hoverIndex}
          selectedIndexes={selectedIndexes}
          isSelecting={isSelecting}
          setIsSelecting={setIsSelecting}
        />

        <ul
          id="elements-container"
          className="pb-5 w-full grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-6 justify-center sm:justify-start"
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              className={`element bg-background p-4 rounded-sm flex items-center w-full gap-x-8 ${selectedIndexes.includes(i) ? 'bg-input' : ''}`}
              onClick={(event) => handleElementClick(i, event)}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              onDragStart={(event) => handleDragStart(event, i)}
            >
              <div
                onClick={() => {
                  if (!item.hasOwnProperty('size')) {
                    setCurrentPath(item.id);
                  }
                }}
                className={`flex rounded-sm opacity-1 cursor-pointer`}
              >
                <FileOrFolderIcon item={item} />
              </div>
              <div className="w-full flex flex-col items-start gap-4">
                <div className="w-full flex justify-between items-center">
                  <h4 className={`font-semibold text-sm`}>{item.name}</h4>
                  <div className="flex gap-4">
                    <div
                      onClick={() => ''}
                      className={cn(
                        `  
                        ${buttonVariants({
                          variant: 'outline',
                          size: 'sm',
                        })}
                        ${selectedIndexes.includes(i) ? 'bg-primary text-background hover:bg-primary/80 hover:text-background/80' : ''}
                         cursor-pointer flex gap-2 text-xs`
                      )}
                    >
                      Download
                    </div>

                    <CreateRenameModal itemId={item.id} type="icon" selectedIndexes={selectedIndexes} i={i} />

                    {/* 
                    <label
                      className="relative flex cursor-pointer"
                      htmlFor={`checkbox - ${item.id}`}
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
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </label> */}
                  </div>
                </div>
                <div className="flex justify-between w-full items-end">
                  <div className="flex gap-4 items-end w-full">
                    <div>
                      {item.size ? (
                        <div
                          className={`flex items-center py-0.5 px-2 bg-muted rounded-sm ${selectedIndexes.includes(i) ? 'bg-primary text-background  hover:bg-primary/80 hover:text-background/80' : ''}`}
                        >
                          <p className="text-xs">{formatStorage(item.size)}</p>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center py-0.5 px-2 bg-muted rounded-sm ${selectedIndexes.includes(i) ? 'bg-primary text-background  hover:bg-primary/80 hover:text-background/80' : ''}`}
                        >
                          <p className="text-xs">
                            {formatStorage(item.sizeFolder)}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs">{formatDate(item.createdAt)}</p>

                    {/* <div className={`rounded - sm   ${ item.operate === true ? '' : '' }`}>
        {item.operate === true ? <CheckCheck size={14} color='#147D30' /> : <IoClose size={14} color='#A52330' />}
      </div> */}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
