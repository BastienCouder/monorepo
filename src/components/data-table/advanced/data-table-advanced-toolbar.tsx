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
import { Card, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { CreateFolder } from './create-folder';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Text } from '@/components/container';
import ViewSwitcher from './view-switcher';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
  copyRowsAction?: () => void;
  pasteRowsAction?: () => void;
  goBack?: () => void;
  basePath: string | undefined;
  isGridView?: boolean;
  switchToGridView: () => void;
  switchToTableView: () => void;
  teamId: string | undefined;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
  deleteRowsAction,
  copyRowsAction,
  pasteRowsAction,
  goBack,
  basePath,
  isGridView,
  switchToGridView,
  switchToTableView,
  teamId,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isPending, startTransition] = React.useTransition();
  const { selectedItems } = useSelection();
  const { onOpen } = useModal();
  const user = useCurrentUser();
  const isDesktop = useMediaQuery('(min-width: 768px)');
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

  const handleDropzone = () => {
    onOpen('dropzone');
  };

  const handleCreateFolder = (
    userId: string | undefined,
    teamId: string | undefined,
    basePath: string | undefined
  ) => {
    onOpen('create-folder-team', { userId, teamId, parentFolderId: basePath });
  };

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
          <DropzoneModal>
            <Button
              aria-label="Uploads"
              variant="default"
              size={'sm'}
              className="gap-2"
              onClick={() => handleDropzone()}
            >
              <Icons.uploads className="size-4" aria-hidden="true" /> Uploads
            </Button>
          </DropzoneModal>
          {teamId && (
            <>
              {isDesktop ? (
                <Popover>
                  <PopoverTrigger
                    className={`px-2 py-0 gap-2 ${cn(buttonVariants({ variant: 'default', size: 'sm' }))}`}
                  >
                    {' '}
                    <Icons.plus size={17} /> Create Folder
                  </PopoverTrigger>
                  <PopoverContent className="w-[350px]">
                    <CreateFolder
                      isDesktop={isDesktop}
                      userId={user?.id}
                      teamId={teamId}
                      parentFolderId={basePath}
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <CreateFolder
                  isDesktop={isDesktop}
                  userId={user?.id}
                  teamId={teamId}
                  parentFolderId={basePath}
                >
                  <Button
                    aria-label="Create Folder"
                    variant="default"
                    size={'sm'}
                    className="gap-2"
                    onClick={() =>
                      handleCreateFolder(user?.id, teamId, basePath)
                    }
                  >
                    <Icons.plus className="size-4" aria-hidden="true" /> Create
                    Folder
                  </Button>
                </CreateFolder>
              )}
            </>
          )}
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
              disabled={isPending || basePath === ''}
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
      </Card>
    </>
  );
}
