'use client';

import * as React from 'react';
import Link from 'next/link';
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from '@/types';
import {
  CaretLeftIcon,
  Cross2Icon,
  PlusCircledIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import {
  ClipboardCopyIcon,
  ClipboardIcon,
  Table as TableIcon,
} from 'lucide-react';
import { TbLayoutList } from 'react-icons/tb';
import { IoGrid, IoReturnDownBackOutline } from 'react-icons/io5';
import { useSelection } from '@/app/[locale]/(dashboard)/dashboard/(routes)/ai/(route)/_context/select-item';
import { VscActivateBreakpoints } from 'react-icons/vsc';
import CreateFolderTeamModal from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[slug]/_components/create-modal-folder-team';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
  operateRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
  copyRowsAction?: () => void;
  pasteRowsAction?: () => void;
  goBack?: () => void;
  basePath: string | undefined;
  isGridView?: boolean;
  toggleView: () => void;
  teamId: string | undefined;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
  deleteRowsAction,
  copyRowsAction,
  operateRowsAction,
  pasteRowsAction,
  goBack,
  basePath,
  isGridView,
  toggleView,
  teamId,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isPending, startTransition] = React.useTransition();
  const { selectedItems } = useSelection();

  const hasTableSelectedItems = table.getSelectedRowModel().rows.length > 0;
  const hasContextSelectedItems = selectedItems.length > 0;
  const disableActions = !hasTableSelectedItems && !hasContextSelectedItems;

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

  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map((column) => {
            const columnId = String(column.id || '');
            return (
              table.getColumn(columnId) && (
                <Input
                  key={columnId}
                  placeholder={`Rechercher...`}
                  value={searchInputs[columnId]}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearchInputs((prev) => ({
                      ...prev,
                      [columnId]: value,
                    }));
                    table.getColumn(columnId)?.setFilterValue(value);
                  }}
                  className="h-7 w-[150px] lg:w-[250px]"
                />
              )
            );
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
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
        <div className="w-[4.5rem] bg-primary rounded-md flex justify-center items-center gap-3 p-1">
          <button
            onClick={toggleView}
            className={` ${isGridView ? 'bg-muted text-primary' : 'bg-primary text-muted'} cc  p-1 rounded-sm  cursor-pointer`}
          >
            {<IoGrid size={13} />}
          </button>
          <button
            onClick={toggleView}
            className={` ${isGridView ? 'bg-primary text-muted' : 'bg-muted text-primary'} transition-all p-1 rounded-sm  cursor-pointer`}
          >
            {<TbLayoutList size={16} />}
          </button>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {' '}
              {operateRowsAction && (
                <Button
                  aria-label="Activer les lignes sélectionnées"
                  variant="outline"
                  size="sm"
                  className="h-8 transition-all"
                  onClick={operateRowsAction}
                  disabled={isPending || disableActions}
                >
                  <VscActivateBreakpoints
                    className="mr-2 size-4"
                    aria-hidden="true"
                  />
                  Activate / desactivate
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Activate or desactivate item to sort</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <Popover>
          <PopoverTrigger className='ms-2'>
            <div>
              <Icons.help size={18} color='hsl(var(--primary))' />
            </div>
          </PopoverTrigger>
          <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover> */}
      </div>

      <div className="flex items-center space-x-2">
        <CreateFolderTeamModal basePath={basePath} teamId={teamId} />
        {copyRowsAction && (
          <Button
            aria-label="Copier les lignes sélectionnées"
            variant="outline"
            size="sm"
            className="h-8 transition-all"
            onClick={copyRowsAction}
            disabled={isPending || disableActions}
          >
            <ClipboardCopyIcon className="mr-2 size-4" aria-hidden="true" />
            Copier
          </Button>
        )}

        {pasteRowsAction && (
          <Button
            aria-label="Coller les éléments"
            variant="outline"
            size="sm"
            className="h-8 transition-all"
            onClick={pasteRowsAction}
            disabled={isPending}
          >
            <ClipboardIcon className="mr-2 size-4" aria-hidden="true" />
            Coller
          </Button>
        )}
        {/* Bouton de suppression et création de nouvelle ligne existant */}
        {deleteRowsAction ? (
          <Button
            aria-label="Supprimer les lignes sélectionnées"
            variant="outline"
            size="sm"
            className="h-8 transition-all"
            onClick={(event) => {
              startTransition(() => {
                table.toggleAllPageRowsSelected(false);
                deleteRowsAction(event);
              });
            }}
            disabled={isPending || disableActions}
          >
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete
          </Button>
        ) : newRowLink ? (
          <Link aria-label="Créer une nouvelle ligne" href={newRowLink}>
            <div
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className: 'h-8 transition-all',
                })
              )}
            >
              <PlusCircledIcon className="mr-2 size-4" aria-hidden="true" />
              Nouveau
            </div>
          </Link>
        ) : null}
        {goBack && (
          <Button
            aria-label="Coller les éléments"
            variant="default"
            size="sm"
            className="h-8 transition-all"
            onClick={goBack}
            disabled={isPending}
          >
            <IoReturnDownBackOutline
              className="mr-2 size-4"
              aria-hidden="true"
            />
            Back
          </Button>
        )}
        {/* <DataTableViewOptions table={table} /> */}
      </div>
    </div>
  );
}
