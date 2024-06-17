import React from 'react';
import { TbLayoutList } from 'react-icons/tb';
import { IoGrid } from 'react-icons/io5';
import { Text } from '@/components/container';
import { useMediaQuery } from '@/hooks/use-media-query';
type Props = {
  isGridView: boolean | undefined;
  switchToGridView: () => void;
  switchToTableView: () => void;
};

const ViewSwitcher = ({
  switchToGridView,
  switchToTableView,
  isGridView,
}: Props) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <>
      {isDesktop ? (
        <div className=" bg-muted rounded-[25px] flex justify-center items-center gap-5 p-2 px-3 relative">
          <div
            className={`absolute top-0 left-0 w-1/2 h-full bg-primary rounded-[25px] transition-transform duration-300 ${isGridView ? 'transform translate-x-0' : 'transform translate-x-full'}`}
          />
          <button
            onClick={switchToGridView}
            className={`z-10 gap-3 flex items-center p-1 rounded-sm cursor-pointer transition-colors duration-300 ${isGridView ? 'text-muted' : 'text-primary'}`}
          >
            <IoGrid size={13} />
            <Text.Small className="first-letter:uppercase">grid</Text.Small>
          </button>
          <button
            onClick={switchToTableView}
            className={`z-10 gap-3 flex items-center p-1 rounded-sm cursor-pointer transition-colors duration-300 ${!isGridView ? 'text-muted' : 'text-primary'}`}
          >
            <TbLayoutList size={16} />
            <Text.Small className="first-letter:uppercase">table</Text.Small>
          </button>
        </div>
      ) : (
        <div className="min-w-[4.5rem] bg-muted rounded-md flex justify-center items-center gap-3 p-1 relative">
          <div
            className={`absolute top-0 left-0 w-1/2 h-full bg-primary rounded-sm transition-transform duration-300 ${isGridView ? 'transform translate-x-0' : 'transform translate-x-full'}`}
          />
          <button
            onClick={switchToGridView}
            className={`z-10 gap-1 flex items-center p-1 rounded-sm cursor-pointer transition-colors duration-300 ${isGridView ? 'text-muted' : 'text-primary'}`}
          >
            <IoGrid size={13} />
          </button>
          <button
            onClick={switchToTableView}
            className={`z-10 gap-1 flex items-center p-1 rounded-sm cursor-pointer transition-colors duration-300 ${!isGridView ? 'text-muted' : 'text-primary'}`}
          >
            <TbLayoutList size={16} />
          </button>
        </div>
      )}
    </>
  );
};

export default ViewSwitcher;
