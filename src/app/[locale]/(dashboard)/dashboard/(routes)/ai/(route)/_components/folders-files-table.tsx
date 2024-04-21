'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { getFoldersFiles } from '../_lib/queries';
import {
  fetchItemsTableColumnDefs, searchableColumns,
  filterableColumns,
} from './folders-files-table-column-def';
import { SearchParams } from '@/types';
import { useCurrentUser } from '@/hooks/use-current-user';
import { DataTable } from '@/components/data-table/data-table';
import { copySelectedRows, deleteSelectedRows, pasteSelectedRows } from './folders-files-table-actions';
import File from './interface-multi-files';
import { useSelection } from '../_context/select-item';

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

type Item = Folder | File;

export function FoldersFilesTable({ searchParams }: { searchParams: SearchParams }) {
  const user = useCurrentUser();
  const { selectedItems } = useSelection();

  const userId = user?.id;
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [folderFiles, setFolderFiles] = useState<{ folders: Folder[]; files: File[] }>({ folders: [], files: [] });
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const goBack = () => {
    const newPathHistory = [...pathHistory];
    newPathHistory.pop();
    setCurrentPath(newPathHistory[newPathHistory.length - 1] || '');
    setPathHistory(newPathHistory);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const response = await getFoldersFiles(userId, currentPath, searchParams);
          setFolderFiles({
            folders: response.folders.data,
            files: response.files.data,
          });
          setPageCount(response.folders.pageCount as number);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [userId, currentPath, searchParams]);

  const [isPending, startTransition] = React.useTransition();

  const columns = useMemo(() => {
    return fetchItemsTableColumnDefs(setCurrentPath, isPending, startTransition);
  }, [folderFiles, setCurrentPath, isPending]);


  useEffect(() => {
    if (currentPath && !pathHistory.includes(currentPath)) {
      setPathHistory(prev => [...prev, currentPath]);
    }
  }, [currentPath]);

  const { dataTable } = useDataTable<Item, unknown>({
    data: [...folderFiles.folders, ...folderFiles.files],
    columns,
    searchableColumns,
    filterableColumns,
  });

  return (
    <div className='space-y-4 overflow-hidden mb-10'>
      <File folderId={currentPath} />
      <DataTable
        dataTable={dataTable}
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        basePath={currentPath}
        data={folderFiles}
        // floatingBarContent={FoldersFilesTableFloatingBarContent(dataTable, userId!, currentPath)}
        deleteRowsAction={() => deleteSelectedRows(dataTable, userId!)}
        copyRowsAction={() => copySelectedRows(selectedItems, dataTable)}
        pasteRowsAction={() => pasteSelectedRows(userId!, currentPath)}
        goBack={() => goBack()}
        currentPath={setCurrentPath}
      />

    </div>
  );
}