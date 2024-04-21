"use client"
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import { UploadCloudIcon, FileIcon, Trash2Icon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { ref as firebaseRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useCurrentUser } from '@/hooks/use-current-user';
import { File } from '@/schemas/db';

// Définition des variantes de style pour le dropzone
const variants = {
  base: 'relative rounded-md p-4 w-full max-w-[calc(100vw-1rem)] transition-all hover:bg-card flex justify-center items-center flex-col cursor-pointer border border-dashed border-primary dark:border-gray-300 transition-colors duration-200 ease-in-out',
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
};

const MultiFileDropzone: React.FC<InputProps> = ({
  className,
  value = [],
  onChange,
  disabled,
  folderId,
  refreshData
}) => {
  const user = useCurrentUser();
  const userId = user?.id;
  const [customError, setCustomError] = useState<string>('');

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
    // Utilisation de webkitRelativePath pour maintenir la structure du dossier
    const relativePath = fileState.file.webkitRelativePath || fileState.file.name;
    console.log(relativePath);

    const filePath = `${userId}/${folderId}/${relativePath}`;
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
        saveFileMetadata({
          userId,
          downloadURL,
          size: fileState.file.size,
          type: fileState.file.type,
          filePath,
          folderId // Peut-être ajuster pour gérer les identifiants de dossier logique
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
    onDrop,
    disabled,
    multiple: true
  });


  const saveFileMetadata = async (fileData: any) => {
    try {
      const response = await fetch('http://localhost:9000/api/uploads', {
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
        <UploadCloudIcon size="24" />
        <p className="text-foreground/70 text-xs px-6">
          Drag 'n' drop some folders and files here
        </p>
      </div>
      {customError && (
        <p className="text-red-500 text-xs mt-2">{customError}</p>
      )}
      <ul className="mt-2 space-y-1">
        {value.map(({ file, progress, key, downloadURL }) => (
          <li
            key={key}
            className="flex justify-between items-center p-2 rounded border"
          >
            <FileIcon size="24" />
            <span className="flex-1 ml-2 truncate">{file.name}</span>
            <span>
              {progress === 'PENDING' && <p>Waiting...</p>}
              {typeof progress === 'number' && <p>{progress}%</p>}
              {progress === 'COMPLETE' && (
                <CheckCircleIcon className="text-green-500" size="24" />
              )}
              {progress === 'ERROR' && (
                <AlertCircleIcon className="text-red-500" size="24" />
              )}
            </span>
            <button onClick={() => deleteFile(key)}>
              <Trash2Icon size="24" className="hover:text-red-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { MultiFileDropzone };
