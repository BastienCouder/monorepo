'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelection } from '../../providers/select-item-provider';
import {
  boxesIntersect,
} from '@air/react-drag-to-select';
import MouseSelection from './mouse-selection';
import { File, Folder } from '@/models/db';
import GridItems from './grid-items';
import { useMediaQuery } from '@/hooks/use-media-query';
import Dropzone from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[teamId]/_components/dropzone';

interface GridFoldersFilesProps {
  data:
  | {
    folders: Folder[];
    files: File[];
  }
  | undefined;
  setCurrentPath: (path: { id: string; name: string }) => void;
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
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { selectedItems, setSelectedItems } = useSelection();

  const items = data ? [...data.folders, ...data.files] : [];

  useEffect(() => {
    const newSelectedItems = selectedIndexes.map((index) => items[index].id);
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

  useEffect(() => {
    if (selectedIndexes.length < 0 && items.length > 0) {
      setSelectedItems([]);
    }
  }, [selectedIndexes, items, setSelectedItems]);

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

  return (
    <>
      {
        items.length > 0 ? (
          <div className="relative overflow-hidden p-2">
            {isDesktop && (
              <MouseSelection
                onSelectionChange={handleSelectionChange}
                hoverIndex={hoverIndex}
                selectedIndexes={selectedIndexes}
                isSelecting={isSelecting}
                setIsSelecting={setIsSelecting}
              />
            )}
            <GridItems
              items={items}
              setSelectedIndexes={setSelectedIndexes}
              setLastSelectedIndex={setLastSelectedIndex}
              lastSelectedIndex={lastSelectedIndex}
              selectedIndexes={selectedIndexes}
              setHoverIndex={setHoverIndex}
              handleDragStart={handleDragStart}
              setCurrentPath={setCurrentPath}
            />
          </div>
        ) : (
          <>
            <Dropzone folderId='' teamId='' />
          </>)
      }
    </>
  );
}
