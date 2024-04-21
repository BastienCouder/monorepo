'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { getDrive } from '../_lib/queries';
import {
  fetchItemsTableColumnDefs, searchableColumns,
  filterableColumns,
} from './folders-files-table-column-def';
import { SearchParams } from '@/types';
import { useCurrentUser } from '@/hooks/use-current-user';
import { DataTable } from '@/components/data-table/data-table';
import { copySelectedRows, deleteSelectedRows, pasteSelectedRows } from './folders-files-table-actions';
import File from './interface-multi-files';
import { Team, User } from '@/schemas/db';
import { useSelection } from '../../../../ai/(route)/_context/select-item';
import TeamStorageInfo from '../_component/team-storage-progress';
import CreateModal from '@/components/modal/create-modal';
import { CreateInviteForm } from './create-invite-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

export function DriveTable({ searchParams, team, userTeam }: { searchParams: SearchParams, team: Team, userTeam: User }) {
  const user = useCurrentUser();
  const { selectedItems } = useSelection();

  const userId = user?.id;
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [folderFiles, setFolderFiles] = useState<{ folders: Folder[]; files: File[] }>({ folders: [], files: [] });

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
          const response = await getDrive(userId, currentPath, searchParams, team.id);
          setFolderFiles({
            folders: response.folders.data,
            files: response.files.data,
          });
        } catch (error) {
          console.error('Failed to fetch data:', error);
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
      <div className='flex items-center gap-4'>
        {/* <CreateModal
          title="Invite"
          Component={CreateInviteForm}
          variant={'outline'}
        /> */}
        <TeamStorageInfo team={team} />
        <Avatar>
          <AvatarImage src={userTeam.image} />
          <AvatarFallback>{userTeam.name}</AvatarFallback>
        </Avatar>

      </div>
      <File folderId={currentPath} teamId={team.id} />
      <DataTable
        advancedFilter
        dataTable={dataTable}
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        basePath={currentPath}
        data={folderFiles}
        // floatingBarContent={FoldersFilesTableFloatingBarContent(dataTable, userId!, currentPath)}
        deleteRowsAction={() => deleteSelectedRows(dataTable, team.id, user?.id!)}
        copyRowsAction={() => copySelectedRows(selectedItems, dataTable)}
        pasteRowsAction={() => pasteSelectedRows(userId!, currentPath)}
        goBack={() => goBack()}
        currentPath={setCurrentPath}
      />

    </div>
  );
}