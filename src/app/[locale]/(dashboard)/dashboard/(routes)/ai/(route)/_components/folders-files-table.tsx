'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { getFoldersFiles } from '../_lib/queries';
import {
  fetchItemsTableColumnDefs,
  searchableColumns,
  filterableColumns,
} from './folders-files-table-column-def';
import { SearchParams } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import {
  copySelectedRows,
  deleteSelectedRows,
  operateSelectedRows,
  pasteSelectedRows,
} from './folders-files-table-actions';
import InterfaceMultiDropzone from './interface-multi-dropzone';
import { useSelection } from '../_context/select-item';
import { Folder, File, User } from '@/models/db';

export function FoldersFilesTable({
  searchParams,
  user,
}: {
  searchParams: SearchParams;
  user: User;
}) {
  const { selectedItems, clearSelection } = useSelection();

  const userId = user?.id;
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
      if (userId) {
        try {
          const response = await getFoldersFiles(
            userId,
            currentPath,
            searchParams
          );
          setIsLoading(true);
          setFolderFiles({
            folders: response.folders.data,
            files: response.files.data,
          });
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
        }
      }
    };
    fetchData();
  }, [userId, currentPath, searchParams]);

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

  const { dataTable } = useDataTable<Folder | File, unknown>({
    data: [...folderFiles.folders, ...folderFiles.files],
    columns,
    searchableColumns,
    filterableColumns,
  });

  return (
    <div className="space-y-4 overflow-hidden mb-10">
      <InterfaceMultiDropzone folderId={currentPath} user={user} />
      <DataTable
        isLoading={isLoading}
        dataTable={dataTable}
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        basePath={currentPath}
        data={folderFiles}
        // floatingBarContent={FoldersFilesTableFloatingBarContent(dataTable, userId!, currentPath)}
        deleteRowsAction={() =>
          deleteSelectedRows(selectedItems, dataTable, clearSelection)
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
