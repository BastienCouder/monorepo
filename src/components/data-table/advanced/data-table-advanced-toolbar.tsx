'use client';

import * as React from 'react';
import Link from 'next/link';
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from '@/types';
import { Cross2Icon, PlusCircledIcon, TrashIcon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import {
  ChevronDown,
  ClipboardCopyIcon,
  ClipboardIcon,
  Table as TableIcon,
} from 'lucide-react';
import { TbLayoutList } from 'react-icons/tb';
import { IoGrid, IoReturnDownBackOutline } from 'react-icons/io5';
import { useSelection } from '@/providers/select-item-provider';
import { useModal } from '@/hooks/use-modal-store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { CreateFolderTeamModal } from '@/components/modal/create-folder-team-modal';
import { Icons } from '@/components/shared/icons';
import { DropzoneModal } from '@/components/modal/dropzone-modal';
import { Card, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { CreateFolder } from './create-folder';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Text } from '@/components/container';
import ViewSwitcher from './view-switcher';
import { FiSearch } from 'react-icons/fi';
import Tree from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[teamId]/_components/tree';
import Sort from './sort-data';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  newRowLink?: string;
  basePath: string | undefined;
  isGridView?: boolean;
  switchToGridView: () => void;
  switchToTableView: () => void;
  sortOrder: 'alpha' | 'reverse-alpha' | 'date-asc' | 'date-desc';
  setSortOrder: (order: 'alpha' | 'reverse-alpha' | 'date-asc' | 'date-desc') => void;
  data: any;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
  basePath,
  isGridView,
  switchToGridView,
  switchToTableView,
  setSortOrder,
  sortOrder,
  data
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [searchInputs, setSearchInputs] = React.useState(
    searchableColumns.reduce(
      (acc, column) => {
        acc[column.id ? String(column.id) : ''] = '';
        return acc;
      },
      {} as Record<string, string>
    )
  );

  React.useEffect(() => {
    setSearchInputs(
      searchableColumns.reduce(
        (acc, column) => {
          acc[column.id ? String(column.id) : ''] = '';
          return acc;
        },
        {} as Record<string, string>
      )
    );
    table.resetColumnFilters();
  }, [basePath, searchableColumns, table]);

  const resetSearchInputs = () => {
    const resetInputs = searchableColumns.reduce(
      (acc, column) => ({
        ...acc,
        [column.id ? String(column.id) : '']: '',
      }),
      {}
    );
    setSearchInputs(resetInputs);
    table.resetColumnFilters();
  };

  React.useEffect(() => {
    resetSearchInputs();
  }, [basePath, searchableColumns, table]);

  return (
    <>
      <Card
        className={` ${isDesktop ? 'overflow-x-auto' : ''} flex w-full flex-col md:flex-row px-4 border-none md:items-center py-3 rounded-t-none shadow-none md:justify-between md:space-x-12 space-y-4 md:space-y-0 custom-scrollbar`}
      >
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumns.length > 0 &&
            searchableColumns.map((column) => {
              const columnId = String(column.id || '');
              return (
                table.getColumn(columnId) && (
                  <div className="relative">
                    <FiSearch className='absolute font-bold top-1/2 left-2 -translate-y-1/2' />
                    <Input
                      key={columnId}
                      className='flex items-center placeholder:text-foreground h-8 pl-8 w-[150px] lg:w-[250px]'
                      placeholder={`Search`}
                      value={searchInputs[columnId]}
                      onChange={(event) => {
                        const value = event.target.value;
                        setSearchInputs((prev) => ({
                          ...prev,
                          [columnId]: value,
                        }));
                        table.getColumn(columnId)?.setFilterValue(value);
                      }}
                    />
                  </div>
                )
              )
            })}
          {filterableColumns.length > 0 &&
            filterableColumns.map(
              (column) =>
                table.getColumn(column.id ? String(column.id) : '') && (
                  <DataTableFacetedFilter
                    key={String(column.id)}
                    column={table.getColumn(column.id ? String(column.id) : '')}
                    title={column.title}
                    options={column.options}
                  />
                )
            )}
          {isFiltered && (
            <Button
              aria-label="Réinitialiser les filtres"
              variant="default"
              className="h-7 px-4"
              size={'sm'}
              onClick={resetSearchInputs}
            >
              Reset
              <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
            </Button>
          )}
          <ViewSwitcher
            isGridView={isGridView}
            switchToGridView={switchToGridView}
            switchToTableView={switchToTableView}
          />
        </div>

        <div
          className={` ${isDesktop ? '' : 'overflow-x-auto'} flex items-center space-x-2 custom-scrollbar`}
        >
          <Popover>
            <PopoverTrigger
              className={`px-2 py-0 gap-2 ${cn(buttonVariants({ variant: 'none', size: 'sm' }))}`}
            >
              Arborescence <ChevronDown size={10} />{' '}
            </PopoverTrigger>
            <PopoverContent className="min-w-[300px]">
              <Tree data={data} />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger className={`outline-none ring-0 px-2 py-0 gap-2 ${cn(buttonVariants({ variant: 'none', size: 'sm' }))}`}>
              Sort By <ChevronDown size={10} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className='min-w-[250px]'>
              <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </Card>
    </>
  );
}
