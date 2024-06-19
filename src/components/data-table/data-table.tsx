'use client';

import * as React from 'react';
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from '@/types';
import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card
} from '@/components/ui';

import { DataTableAdvancedToolbar } from './advanced/data-table-advanced-toolbar';
import { DataTableToolbar } from './data-table-toolbar';
import GridFoldersFiles from '@/components/dnd/grid';
import { GridSkeleton } from '../skeleton/grid-skeleton';
import { useSelection } from '@/providers/select-item-provider';
import Dropzone from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[teamId]/_components/dropzone';
import DataTableSecondToolbar from './advanced/data-table-second-toolbar';

interface DataTableProps<TData, TValue> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  dataTable: TanstackTable<TData>;

  /**
   * The columns of the table
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * The searchable columns of the table
   * @default []
   * @type {id: keyof TData, title: string}[]
   * @example searchableColumns={[{ id: "title", title: "titles" }]}
   */
  searchableColumns?: DataTableSearchableColumn<TData>[];

  /**
   * The filterable columns of the table. When provided, renders dynamic faceted filters, and the advancedFilter prop is ignored.
   * @default []
   * @type {id: keyof TData, title: string, options: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[]
   * @example filterableColumns={[{ id: "status", title: "Status", options: ["todo", "in-progress", "done", "canceled"]}]}
   */
  filterableColumns?: DataTableFilterableColumn<TData>[];

  /**
   * Show notion like filters when enabled
   * @default false
   * @type boolean
   */
  advancedFilter?: boolean;

  /**
   * The content to render in the floating bar on row selection, at the bottom of the table. When null, the floating bar is not rendered.
   * The datTable instance is passed as a prop to the floating bar content.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBarContent={TasksTableFloatingBarContent(dataTable)}
   */
  floatingBarContent?: React.ReactNode | null;

  /**
   * The action to delete rows
   * @default undefined
   * @type React.MouseEventHandler<HTMLButtonElement> | undefined
   * @example deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
   */
  deleteRowsAction?: (() => void) | undefined;
  copyRowsAction?: (() => void) | undefined;
  pasteRowsAction?: (() => void) | undefined;
  goBack?: (() => void) | undefined;
  basePath?: string;
  data?: { folders: any[]; files: any[] };
  currentPath: (path: { id: string; name: string }) => void;
  teamId?: string | undefined;
  isLoading: boolean;
  tree: any;
  isFirstFetch: boolean;
  sortOrder: 'alpha' | 'reverse-alpha' | 'date-asc' | 'date-desc';
  setSortOrder: (order: 'alpha' | 'reverse-alpha' | 'date-asc' | 'date-desc') => void;
}

export function DataTable<TData, TValue>({
  tree,
  dataTable,
  columns,
  searchableColumns = [],
  filterableColumns = [],
  advancedFilter = false,
  deleteRowsAction,
  copyRowsAction,
  pasteRowsAction,
  goBack,
  basePath,
  data,
  currentPath,
  teamId,
  isLoading,
  isFirstFetch,
  sortOrder,
  setSortOrder
}: DataTableProps<TData, TValue>) {
  const [isGridView, setIsGridView] = React.useState(true);
  const { clearSelection } = useSelection();

  const resetDataTableState = () => {
    // dataTable.getIsAllRowsSelected = [];:
  };

  // These functions handle the switch between views
  const switchToGridView = () => {
    setIsGridView(true);
    clearSelection();
  };

  const switchToTableView = () => {
    setIsGridView(false);
    clearSelection();
  };

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      {advancedFilter ? (
        <DataTableAdvancedToolbar
          table={dataTable}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          data={tree}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          basePath={basePath}
          isGridView={isGridView}
          switchToGridView={switchToGridView}
          switchToTableView={switchToTableView}
        />
      ) : (
        <DataTableToolbar
          table={dataTable}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          deleteRowsAction={deleteRowsAction}
          copyRowsAction={copyRowsAction}
          pasteRowsAction={pasteRowsAction}
          goBack={goBack}
          basePath={basePath}
          isGridView={isGridView}
          switchToGridView={switchToGridView}
          switchToTableView={switchToTableView}
        />
      )}
      <>
        <DataTableSecondToolbar
          table={dataTable}
          deleteRowsAction={deleteRowsAction}
          copyRowsAction={copyRowsAction}
          pasteRowsAction={pasteRowsAction}
          goBack={goBack}
          basePath={basePath}
          teamId={teamId}
        />
      </>
      <Card className="p-4">
        <div className="md:max-h-[450px] md:overflow-y-auto md:pr-4 scrollbar-custom">
          {isGridView ? (
            <>
              {isLoading && isFirstFetch ? (
                <>
                  <GridSkeleton />
                </>
              ) : (
                <GridFoldersFiles data={data} setCurrentPath={currentPath} />
              )}
            </>
          ) : (
            <>
              {!data ? (
                <Dropzone folderId={''} teamId={''} />
              ) : (
                <>
                  <div className="rounded-sm">
                    <Table>
                      <TableHeader>
                        {dataTable.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id}>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                </TableHead>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>

                      <TableBody>
                        {dataTable.getRowModel().rows?.length ? (
                          dataTable.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && 'selected'}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              Aucun résultats.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                </>
              )}
              {/* <div className="space-y-2.5">
              <DataTablePagination table={dataTable} />
              {floatingBarContent ? (
                <DataTableFloatingBar table={dataTable}>
                  {floatingBarContent}
                </DataTableFloatingBar>
              ) : null}
            </div> */}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
