import FileOrFolderIcon from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[teamId]/_components/files-folders-icon';
import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { buttonVariants } from '../ui';
import CreateRenameModal from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[teamId]/_components/create-rename-modal';
import { cn, formatDate, formatStorage } from '@/lib/utils';
import { File, Folder } from '@/models/db';

interface GridItemsProps {
    items: (Folder | File)[]
    setSelectedIndexes: Dispatch<SetStateAction<number[]>>;
    setLastSelectedIndex: Dispatch<SetStateAction<number | null>>;
    lastSelectedIndex: number | null;
    selectedIndexes: number[];
    setHoverIndex: Dispatch<SetStateAction<number | null>>;
    handleDragStart: (event: React.DragEvent, index: number) => void;
    setCurrentPath: (path: { id: string; name: string }) => void;
}

const GridItems = ({
    items,
    setSelectedIndexes,
    setLastSelectedIndex,
    lastSelectedIndex,
    selectedIndexes,
    setHoverIndex,
    handleDragStart,
    setCurrentPath,
}: GridItemsProps) => {
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

    return (
        <ul
            id="elements-container"
            className="w-full grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-6 justify-center sm:justify-start"
        >
            {items.map((item, i) => (
                <li
                    key={item.id}
                    className={`element border p-4 rounded-sm flex items-center w-full gap-x-8 ${selectedIndexes.includes(i) ? 'bg-input' : ''}`}
                    onClick={(event) => handleElementClick(i, event)}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onDragStart={(event) => handleDragStart(event, i)}
                >
                    <div
                        onClick={() => {
                            if (!item.hasOwnProperty('size')) {
                                setCurrentPath({ id: item.id, name: item.name });
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
                                            variant: 'secondary',
                                            size: 'sm',
                                        })}
                        ${selectedIndexes.includes(i) ? 'bg-primary text-background hover:bg-primary/80 hover:text-background/80' : ''}
                         cursor-pointer flex gap-2 text-xs`
                                    )}
                                >
                                    Download
                                </div>
                                <CreateRenameModal
                                    itemId={item.id}
                                    type="icon"
                                    selectedIndexes={selectedIndexes}
                                    i={i}
                                />
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
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default GridItems;
