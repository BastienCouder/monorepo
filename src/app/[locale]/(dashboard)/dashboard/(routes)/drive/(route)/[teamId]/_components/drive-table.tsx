'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { getDrive } from '../_lib/queries';
import fetchItemsTableColumnDefs, {
  searchableColumns,
  filterableColumns,
} from './drive-table-column-def';
import { SearchParams } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Team, User } from '@/models/db';
import { useRouteParam } from '@/providers/route-params-provider';
import {
  copySelectedRows,
  deleteSelectedRows,
  pasteSelectedRows,
} from './drive-table-actions';
import { useSelection } from '@/providers/select-item-provider';
import { useCurrentUser } from '@/hooks/use-current-user';
import DriveTableHeader from './drive-table-header';
import { Container } from '@/components/container';

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

const DriveTable = ({
  searchParams,
  team,
  params,
  teamMembers,
  tree
}: {
  searchParams: SearchParams;
  team: Team;
  params: { teamId: string };
  teamMembers: User[];
  tree: any
}) => {
  const user = useCurrentUser();
  const { selectedItems, clearSelection } = useSelection();
  const { setParam } = useRouteParam();
  const [pathHistory, setPathHistory] = useState<
    { id: string; name: string }[]
  >([]);
  const [currentPath, setCurrentPath] = useState<{ id: string; name: string }>({
    id: '',
    name: '',
  });
  const [data, setData] = useState<{ folders: Folder[]; files: File[] }>({
    folders: [],
    files: [],
  });
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstFetch, setIsFirstFetch] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDrive(currentPath.id, searchParams, team.id);
      setData({
        folders: response.folders.data,
        files: response.files.data,
      });
      if (isFirstFetch) {
        setIsFirstFetch(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [currentPath.id, searchParams, team.id, isFirstFetch]);

  useEffect(() => {
    setParam(params.teamId);
  }, [params.teamId, setParam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (
      currentPath.id &&
      !pathHistory.some((path) => path.id === currentPath.id)
    ) {
      setPathHistory((prev) => [...prev, currentPath]);
    }
  }, [currentPath, pathHistory]);

  const columns = useMemo(() => {
    return fetchItemsTableColumnDefs(
      setCurrentPath,
      isFirstFetch ? isPending : false,
      startTransition
    );
  }, [setCurrentPath, isFirstFetch, isPending, startTransition]);

  const { dataTable } = useDataTable<any, unknown>({
    data: [...data.folders, ...data.files],
    columns,
    searchableColumns,
    filterableColumns,
  });

  const goBack = useCallback(() => {
    if (pathHistory.length > 1) {
      const newPathHistory = [...pathHistory];
      newPathHistory.pop();
      const newCurrentPath = newPathHistory[newPathHistory.length - 1];
      setCurrentPath(newCurrentPath);
      setPathHistory(newPathHistory);
    } else {
      setPathHistory([]);
      setCurrentPath({ id: '', name: '' });
    }
  }, [pathHistory]);

  return (
    <>
      <DriveTableHeader
        team={team}
        user={user}
        pathHistory={pathHistory.map((path) => path.name)}
        teamMembers={teamMembers}
        data={tree}
      />
      {/* <Container.Div className="px-4 bg-card">
        <Separator />
      </Container.Div > */}
      <Container.Div className="space-y-4 overflow-hidden mb-10">
        <DataTable
          teamId={team.id}
          advancedFilter
          dataTable={dataTable}
          columns={columns}
          searchableColumns={searchableColumns}
          filterableColumns={filterableColumns}
          basePath={currentPath.id}
          data={data}
          isLoading={isLoading}
          isFirstFetch={isFirstFetch}
          deleteRowsAction={() =>
            deleteSelectedRows(
              selectedItems,
              dataTable,
              clearSelection,
              team.id,
              user?.id
            )
          }
          copyRowsAction={() => copySelectedRows(selectedItems, dataTable)}
          pasteRowsAction={() => pasteSelectedRows(currentPath.id)}
          goBack={goBack}
          currentPath={setCurrentPath}
        />
      </Container.Div>
    </>
  );
}

export default DriveTable