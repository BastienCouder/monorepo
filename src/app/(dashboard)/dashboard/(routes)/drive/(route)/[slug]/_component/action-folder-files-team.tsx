'use client';

import React, { useState, useEffect } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import { File, Folder as PrismaFolder, Team } from '@prisma/client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { MultiFileDropzone } from './multi-dropzone';
import { deleteFolderRecursively } from '@/server-actions/user/delete-folder-user';
import { Copy, FilePlus2, Trash } from 'lucide-react';
import { copyItems, pasteItems } from '@/server-actions/uploads/copy-paste';
import { getFolderDetails } from '../../../../files/_lib/folder-custom-details';
import DirectoryCard from '../../../../files/_components/folder-files-card';
import { getUserFolderFilesTeam } from '@/server-actions/drive/team/get-folders-files-team';
import CreateFolderModal from './create-modal-folder-team';
import CreateModal from '@/components/modal/create-modal';
import { CreateJoinTeamForm } from '../../../_components/join-team-form';
import { CreateInviteForm } from './create-invite-form';

export interface ExtendedPrismaFolder extends PrismaFolder {
  totalSize?: number;
  totalFiles?: number;
}

interface FolderData {
  folder?: ExtendedPrismaFolder;
  subfolders: ExtendedPrismaFolder[];
  files: File[];
}

export interface CurrentFolderPath {
  folderName: string;
  folderId: string;
}

interface ActionsFolderFilesTeamProps {
  team: Team
}

export default function ActionsFolderFilesTeam({ team }: ActionsFolderFilesTeamProps) {
  const user = useCurrentUser();
  const userId = user?.id;
  const [currentPath, setCurrentPath] = useState<CurrentFolderPath>({
    folderName: '',
    folderId: '',
  });
  const [currentData, setCurrentData] = useState<FolderData>();
  const [isChecked, setIsChecked] = useState(false);
  const [pathStack, setPathStack] = useState<CurrentFolderPath[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        const newData = await getUserFolderFilesTeam(currentPath.folderId, team.id);
        setCurrentData(newData);
      }
    };
    loadData();
  }, [currentPath.folderId]);


  const refreshData = async () => {
    if (userId) {
      const newData = await getUserFolderFilesTeam(currentPath.folderId, team.id);
      setCurrentData(newData);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      if (userId) {
        await deleteFolderRecursively(folderId, userId);
        refreshData();
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleCheckboxChange = (folderId: string) => {
    setSelectedFolders((prevSelectedFolders) => {
      if (prevSelectedFolders.includes(folderId)) {
        return prevSelectedFolders.filter((id) => id !== folderId);
      } else {
        return [...prevSelectedFolders, folderId];
      }
    });
  };

  const handleFolderClick = (folderName: string, folderId: string) => {
    setCurrentPath({ folderName, folderId });
    setPathStack((prevStack) => [...prevStack, currentPath]);
  };



  const handleBackButtonClick = () => {
    if (pathStack.length > 0) {
      const newPathStack = [...pathStack];
      const previousPath = newPathStack.pop() || {
        folderName: '',
        folderId: '',
      };
      setCurrentPath(previousPath);
      setPathStack(newPathStack);
    }
  };
  const handleCopy = async () => {
    try {
      await copyItems(selectedFolders)
      setSelectedFolders([])
    } catch (error) {
      console.error("error")
    }
  };

  const handlePaste = async () => {
    try {
      if (userId) {
        await pasteItems(userId, currentPath.folderId)
      }
      setSelectedFolders([])
      refreshData()
    } catch (error) {
      console.error("error")
    }
  };

  const handleDelete = async () => {
    try {
      if (userId) {
        // await pasteItems(userId, currentPath.folderId)
      }
      setSelectedFolders([])
    } catch (error) {
      console.error("error")
    }
  };

  return (
    <>
      <div className="flex justify-between gap-4">
        <div className='flex gap-4 '>
          <CreateFolderModal
            basePath={currentPath.folderId}
            teamId={team.id}
            refreshData={refreshData}
          />
          <CreateModal
            title="Invite"
            Component={CreateInviteForm}
            variant={'outline'}
          />
        </div>
        <div>{isChecked && <Button>Copier</Button>}</div>
        <div className="flex gap-4 items-center">
          <Button
            variant={'ghost'}
            className="p-0"
            disabled={selectedFolders.length < 1}
            onClick={handleCopy}
          >
            <Copy size={20} />
          </Button>
          <Button
            variant={'ghost'}
            className="p-0"

            onClick={handlePaste}
          >
            <FilePlus2 size={20} />
          </Button>
          <Button
            variant={'ghost'}
            className="p-0"
            disabled={selectedFolders.length < 1}
            onClick={handleBackButtonClick}
          >
            <Trash size={20} />
          </Button>
          {pathStack.length > 0 && (
            <Button
              onClick={handleBackButtonClick}
              className="flex items-center gap-4"
            >
              <AiOutlineArrowLeft /> Retour
            </Button>
          )}
        </div>
      </div>
      <MultiFileDropzone folderId={currentPath.folderId} />
      <ul className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 justify-center sm:justify-start">
        {currentData?.subfolders?.map((folder, index) => {
          const { color, Icon } = getFolderDetails(folder.name);
          const isChecked = selectedFolders.includes(folder.id);
          return (
            <DirectoryCard
              key={index}
              folder={folder}
              color={color}
              Icon={Icon}
              handleFolderClick={() =>
                handleFolderClick(folder.name, folder.id)
              }
              currentPath={currentPath}
              isChecked={selectedFolders.includes(folder.id)}
              handleCheckboxChange={() => handleCheckboxChange(folder.id)}
              handleDeleteFolder={handleDeleteFolder}
            />
          );
        })}
      </ul>
    </>
  );
}
