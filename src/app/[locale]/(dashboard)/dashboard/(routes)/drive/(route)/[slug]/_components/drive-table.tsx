'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { getDrive } from '../_lib/queries';
import {
  fetchItemsTableColumnDefs,
  searchableColumns,
  filterableColumns,
} from './folders-files-table-column-def';
import { SearchParams } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Team } from '@/schemas/db';
import { useSelection } from '../../../../ai/(route)/_context/select-item';

import {
  copySelectedRows,
  deleteSelectedRows,
  operateSelectedRows,
  pasteSelectedRows,
} from './folders-files-table-actions';
import InterfaceMulfile from './interface-multi-files';
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
}: {
  searchParams: SearchParams;
  team: Team;
}) {
  const user = useCurrentUser();
  const { selectedItems, clearSelection } = useSelection();
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [folderFiles, setFolderFiles] = useState<{
    folders: Folder[];
    files: File[];
  }>({ folders: [], files: [] });
  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => {
    const newPathHistory = [...pathHistory];
    newPathHistory.pop();
    setCurrentPath(newPathHistory[newPathHistory.length - 1] || '');
    setPathHistory(newPathHistory);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDrive(currentPath, searchParams, team.id);
        setIsLoading(true);
        setFolderFiles({
          folders: response.folders.data,
          files: response.files.data,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
      }
    };
    fetchData();
  }, [currentPath, searchParams]);

  const [isPending, startTransition] = React.useTransition();

  const columns = useMemo(() => {
    return fetchItemsTableColumnDefs(
      setCurrentPath,
      isPending,
      startTransition
    );
  }, [folderFiles, setCurrentPath, isPending]);

  useEffect(() => {
    if (currentPath && !pathHistory.includes(currentPath)) {
      setPathHistory((prev) => [...prev, currentPath]);
    }
  }, [currentPath]);

  const { dataTable } = useDataTable<any, unknown>({
    data: [...folderFiles.folders, ...folderFiles.files],
    columns,
    searchableColumns,
    filterableColumns,
  });

  return (
    <div className="space-y-4 overflow-hidden mb-10">
      <div className="flex items-center gap-4">
        {/* <CreateModal
          title="Invite"
          Component={CreateInviteForm}
          variant={'outline'}
        /> */}
        {/* <TeamStorageInfo team={team} /> */}
      </div>
      <InterfaceMulfile folderId={currentPath} teamId={team.id} />

      <DataTable
        teamId={team.id}
        isLoading={isLoading}
        advancedFilter
        dataTable={dataTable}
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        basePath={currentPath}
        data={folderFiles}
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
  );
}
