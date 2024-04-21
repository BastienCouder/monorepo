"use client"
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import { ref as firebaseRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useCurrentUser } from '@/hooks/use-current-user';
import { File } from '@/schemas/db';
import { FcOpenedFolder } from 'react-icons/fc';

// Définition des variantes de style pour le dropzone
const variants = {
    base: 'bg-background relative rounded-md p-4 w-full max-w-[calc(100vw-1rem)] transition-all hover:bg-card flex justify-center items-center flex-col cursor-pointer border-primary dark:border-gray-300 transition-colors duration-200 ease-in-out',
    active: 'border-blue-500',
    disabled: 'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700 dark:border-gray-600',
    accept: 'border-green-500',
    reject: 'border-red-500',
};

// Définition des types pour les props et l'état des fichiers
type FileState = {
    file: File;
    key: string;
    progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
    downloadURL?: string;
};

type InputProps = {
    className?: string;
    value?: FileState[];
    onChange?: (files: FileState[]) => void;
    disabled?: boolean;
    folderId?: string;
    refreshData?: () => void;
    teamId: string
};

const MultiFileDropzone: React.FC<InputProps> = ({
    className,
    value = [],
    onChange,
    disabled,
    folderId,
    refreshData,
    teamId
}) => {
    const user = useCurrentUser();
    const userId = user?.id;
    const [customError, setCustomError] = useState<string>('');
    const [files, setFiles] = useState([]);
    useEffect(() => {
        const inputElement = document.querySelector('#folder-upload-input') as HTMLInputElement;
        if (inputElement) {
            inputElement.setAttribute('webkitdirectory', 'true');
            inputElement.setAttribute('directory', 'true');
            inputElement.setAttribute('multiple', 'true');
        }
    }, []);

    const onDrop = (acceptedFiles: File[]) => {
        setCustomError('');
        const filesWithProgress: FileState[] = acceptedFiles.map(file => ({
            file,
            key: Math.random().toString(36).substring(2),
            progress: 'PENDING'
        }));


        filesWithProgress.forEach(fileWithProgress => {
            if (userId) {
                uploadFile(fileWithProgress, userId, folderId);
            }
        });

        onChange?.([...value, ...filesWithProgress]);
    };

    const uploadFile = (fileState: FileState, userId: string, folderId: string | undefined) => {
        let filePath = fileState.file.path;

        if (filePath.startsWith('/')) {
            filePath = filePath.slice(1);
        }

        let relativefilePath = ''
        if (folderId !== '') {
            relativefilePath = `${teamId}/${folderId}/${filePath}`;
        } else {
            relativefilePath = `${teamId}/${filePath}`;
        }

        const storageRef = firebaseRef(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, fileState.file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                updateFileProgress(fileState.key, progress);
            },
            (error) => {
                console.error('Upload error: ', error);
                updateFileProgress(fileState.key, 'ERROR');
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                updateFileProgress(fileState.key, 'COMPLETE', downloadURL);
                console.log(`Chemin complet du fichier: ${relativefilePath}`);
                console.log(`team: ${teamId}`);

                saveFileMetadata({
                    userId,
                    downloadURL,
                    size: fileState.file.size,
                    type: fileState.file.type,
                    filePath: relativefilePath,
                    folderId,
                    teamId
                });
            }
        );
    };

    const updateFileProgress = (key: string, progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number, downloadURL?: string) => {
        onChange?.(
            value.map(f => f.key === key ? { ...f, progress, ...(downloadURL && { downloadURL }) } : f)
        );
    };

    const { getRootProps, getInputProps } = useDropzone({
        noClick: true,  // Disable automatic click binding
        noKeyboard: true,  // Disable keyboard interaction
        onDrop
    });


    const saveFileMetadata = async (fileData: any) => {
        try {
            const response = await fetch(`http://localhost:9000/api/uploads/${teamId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fileData),
            });
            if (!response.ok) throw new Error('Failed to save file info to the database');
            refreshData?.();
        } catch (error) {
            console.error('Error adding file to database:', error);
            setCustomError('Failed to save file info.');
        }
    };

    const deleteFile = (key: string) => {
        onChange?.(value.filter(f => f.key !== key));
    };

    const dropZoneClass = twMerge(variants.base, className, disabled && variants.disabled);

    return (
        <div>
            <div {...getRootProps({ className: dropZoneClass })}>
                <input {...getInputProps({ id: 'folder-upload-input' })} />
                <FcOpenedFolder size="44" />
                <p className="text-foreground/70 text-xs px-6 pt-2">
                    Drag 'n' drop some folders and files here
                </p>
            </div>
        </div>
    );
};

export { MultiFileDropzone };
