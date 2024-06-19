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
  const [sortOrder, setSortOrder] = useState<'alpha' | 'reverse-alpha' | 'date-asc' | 'date-desc'>('alpha');

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
  }, [params.teamId, setParam, currentPath]);

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

  const sortedData = useMemo(() => {
    let sortedFolders = [...data.folders];
    let sortedFiles = [...data.files];

    switch (sortOrder) {
      case 'alpha':
        sortedFolders.sort((a, b) => a.name.localeCompare(b.name));
        sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'reverse-alpha':
        sortedFolders.sort((a, b) => b.name.localeCompare(a.name));
        sortedFiles.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-asc':
        sortedFolders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        sortedFiles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'date-desc':
        sortedFolders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        sortedFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    return { folders: sortedFolders, files: sortedFiles };
  }, [data, sortOrder]);

  console.log(sortedData);

  const { dataTable } = useDataTable<any, unknown>({
    data: [...sortedData.folders, ...sortedData.files],
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
          tree={tree}
          advancedFilter
          dataTable={dataTable}
          columns={columns}
          searchableColumns={searchableColumns}
          filterableColumns={filterableColumns}
          basePath={currentPath.id}
          data={sortedData}
          isLoading={isLoading}
          isFirstFetch={isFirstFetch}
          deleteRowsAction={() =>
            deleteSelectedRows(
              selectedItems,
              clearSelection,
              team.id,
              user?.id
            )
          }
          copyRowsAction={() => copySelectedRows(clearSelection, selectedItems)}
          pasteRowsAction={() => pasteSelectedRows(currentPath.id)}
          goBack={goBack}
          currentPath={setCurrentPath}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </Container.Div>
    </>
  );
}

export default DriveTable