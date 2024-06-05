'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { getDrive } from '../_lib/queries';
import {
  fetchItemsTableColumnDefs,
  searchableColumns,
  filterableColumns,
} from './folders-files-table-column-def';
import { SearchParams } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Team } from '@/models/db';
import { useRouteParam } from '@/providers/route-params-provider';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { copySelectedRows, deleteSelectedRows, operateSelectedRows, pasteSelectedRows } from './folders-files-table-actions';
import { useSelection } from '../../../../ai/(route)/_context/select-item';
import { useCurrentUser } from '@/hooks/use-current-user';

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

interface File {
  id: string;
  name: string;
  size: number;
  createdAt: Date;
}

export function DriveTable({
  searchParams,
  team,
  params
}: {
  searchParams: SearchParams;
  team: Team;
  params: { teamId: string }
}) {
  const user = useCurrentUser();
  const { selectedItems, clearSelection } = useSelection();
  const { setParam } = useRouteParam();
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [data, setData] = useState<{ folders: Folder[]; files: File[]; }>({ folders: [], files: [] });
  const [isLoading, setIsLoading] = useState(false);
  console.log(currentPath, pathHistory);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDrive(currentPath, searchParams, team.id);
      setData({
        folders: response.folders.data,
        files: response.files.data,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPath, searchParams, team.id]);

  useEffect(() => {
    setParam(params.teamId);
  }, [params, setParam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (currentPath && !pathHistory.includes(currentPath)) {
      setPathHistory(prev => [...prev, currentPath]);
    }
  }, [currentPath, pathHistory]);
  const [isPending, startTransition] = React.useTransition();

  const columns = useMemo(() => {
    return fetchItemsTableColumnDefs(
      setCurrentPath,
      isPending,
      startTransition
    );
  }, [setCurrentPath, isPending, startTransition]);

  const { dataTable } = useDataTable<any, unknown>({
    data: [...data.folders, ...data.files],
    columns,
    searchableColumns,
    filterableColumns,
  });

  const goBack = useCallback(() => {
    if (pathHistory.length > 0) {
      const newPathHistory = [...pathHistory];
      newPathHistory.pop();
      const newCurrentPath = newPathHistory[newPathHistory.length - 1] || '';
      setCurrentPath(newCurrentPath);
      setPathHistory(newPathHistory);
    }
  }, [pathHistory, setCurrentPath, setPathHistory]);

  const renderBreadcrumb = () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Home</BreadcrumbPage>
        </BreadcrumbItem>
        {pathHistory.map((path, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{path}</BreadcrumbPage>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <>
      <div className="w-full flex justify-between">
        <h1 className="font-bold text-xl first-letter:uppercase">
          {team?.name}
        </h1>
        <div>
          {renderBreadcrumb()}
        </div>
        {/* <ActionsTeam role={role} user={user} team={team} /> */}
      </div>

      <div className="space-y-4 overflow-hidden mb-10">
        <div className="flex items-center gap-4">
          {/* <CreateModal
          title="Invite"
          Component={CreateInviteForm}
          variant={'outline'}
        /> */}
          {/* <TeamStorageInfo team={team} /> */}
        </div>
        {/* <InterfaceMulfile folderId={currentPath} teamId={team.id} /> */}
        <DataTable
          teamId={team.id}
          isLoading={isLoading}
          advancedFilter
          dataTable={dataTable}
          columns={columns}
          searchableColumns={searchableColumns}
          filterableColumns={filterableColumns}
          basePath={currentPath}
          data={data}
          // floatingBarContent={FoldersFilesTableFloatingBarContent(dataTable, userId!, currentPath)}
          deleteRowsAction={() =>
            deleteSelectedRows(
              selectedItems,
              dataTable,
              clearSelection,
              team.id,
              user?.id
            )
          }
          operateRowsAction={() => operateSelectedRows(selectedItems, dataTable)}
          copyRowsAction={() => copySelectedRows(selectedItems, dataTable)}
          pasteRowsAction={() => pasteSelectedRows(currentPath)}
          goBack={() => goBack()}
          currentPath={setCurrentPath}
        />
      </div>
    </>
  );
}
