'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { useSelectionContainer } from '@air/react-drag-to-select';

interface MouseSelectionProps {
  onSelectionChange: any;
  hoverIndex: number | null;
  selectedIndexes: number[];
  isSelecting: boolean;
  setIsSelecting: Dispatch<SetStateAction<boolean>>;
}

const MouseSelection = React.memo(
  ({
    onSelectionChange,
    hoverIndex,
    selectedIndexes,
    isSelecting,
    setIsSelecting,
  }: MouseSelectionProps) => {
    const { DragSelection } = useSelectionContainer({
      eventsElement: document.getElementById('root'),
      onSelectionChange,
      onSelectionStart: () => {
        console.log('OnSelectionStart');
      },
      onSelectionEnd: () => {
        setIsSelecting(false);
        // Uncomment if needed:
        // if (selectedIndexes.length > 0) {
        //   setActiveId(`item-${selectedIndexes.sort().join("-")}`);
        // } else {
        //   setActiveId(null);
        // }
      },
      isEnabled: hoverIndex === null || isSelecting,
    });

    return <DragSelection />;
  }
);

export default React.memo(MouseSelection);
