'use client';

import React, { useState, useEffect } from 'react';
import CreateFolderModal from './_components/create-folder';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import DirectoryCard from './_components/folder-card';
import { getFolderDetails } from './_lib/folder-details';
import { File, Folder as PrismaFolder } from '@prisma/client';
import { addFile } from '@/server-actions/uploads/add-file';
import { useCurrentUser } from '@/hooks/use-current-user';
import { userFolderFiles } from '@/server-actions/user/folder-files-user';
import { MultiFileDropzone } from './_components/dropzone';
import { deleteFolderRecursively } from '@/server-actions/user/delete-folder-user';

interface ExtendedPrismaFolder extends PrismaFolder {
    totalSize?: number;
    totalFiles?: number;
}

interface FolderData {
    folder?: ExtendedPrismaFolder;
    subfolders: ExtendedPrismaFolder[];
    files: File[];
}

interface ActionsFolderProps {
    initialData: FolderData;
}

export interface CurrentFolderPath {
    folderName: string;
    folderId: string;
}

export default function ActionsFolder() {
    const user = useCurrentUser();
    const userId = user?.id;
    const [currentPath, setCurrentPath] = useState<CurrentFolderPath>({
        folderName: '',
        folderId: '',
    });
    const [currentData, setCurrentData] = useState<FolderData>();
    const [isChecked, setIsChecked] = useState(false);
    const [pathStack, setPathStack] = useState<CurrentFolderPath[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (userId) {
                const newData = await userFolderFiles(currentPath.folderId);
                console.log(newData);

                setCurrentData(newData);
            }
        };
        loadData();
    }, [currentPath.folderId]);

    const refreshData = async () => {
        if (userId) {
            const newData = await userFolderFiles(currentPath.folderId);
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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };

    // console.log('currentData' + JSON.stringify(currentData));
    // console.log('currentPath' + JSON.stringify(currentPath));

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <section className="w-full space-y-6 lg:pr-4">
            <h1 className="font-bold text-2xl">My folders</h1>
            <div className="flex justify-between gap-4">
                <CreateFolderModal
                    basePath={currentPath.folderId}
                    refreshData={refreshData}
                />
                <div>{isChecked && <Button>Copier</Button>}</div>
                {pathStack.length > 0 && (
                    <Button
                        onClick={handleBackButtonClick}
                        className="flex items-center gap-4"
                    >
                        <AiOutlineArrowLeft /> Retour
                    </Button>
                )}
            </div>
            <MultiFileDropzone folderId={currentPath.folderId} />
            <ul className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 justify-center sm:justify-start">
                {currentData?.subfolders?.map((folder, index) => {
                    const { color, Icon } = getFolderDetails(folder.name);
                    return (
                        <DirectoryCard
                            key={index}
                            id={folder.id}
                            name={folder.name}
                            totalSize={folder.totalSize}
                            totalFiles={folder.totalFiles}
                            color={color}
                            Icon={Icon}
                            handleFolderClick={() =>
                                handleFolderClick(folder.name, folder.id)
                            }
                            isChecked={isChecked}
                            currentPath={currentPath}
                            handleCheckboxChange={handleCheckboxChange}
                            handleDeleteFolder={handleDeleteFolder}
                        />
                    );
                })}
            </ul>
        </section>
    );
}
