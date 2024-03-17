'use client';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import {
  UploadCloudIcon,
  FileIcon,
  Trash2Icon,
  CheckCircleIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { addFile } from '@/server-actions/uploads/add-file';
import { useCurrentUser } from '@/hooks/use-current-user';

const variants = {
  base: 'relative rounded-md p-4 w-full max-w-[calc(100vw-1rem)] flex justify-center items-center flex-col cursor-pointer border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out',
  active: 'border-blue-500',
  disabled:
    'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700 dark:border-gray-600',
  accept: 'border-green-500',
  reject: 'border-red-500',
};

export type FileState = {
  file: File;
  key: string;
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void;
  disabled?: boolean;
  folderId: string;
};

const MultiFileDropzone = ({
  className,
  value,
  onChange,
  disabled,
  folderId,
}: InputProps) => {
  const user = useCurrentUser();
  const userId = user?.id;
  const [customError, setCustomError] = useState<string>();

  const onDrop = (acceptedFiles: File[]) => {
    setCustomError('');
    const filesWithProgress: FileState[] = acceptedFiles.map(
      (file): FileState => ({
        file,
        key: Math.random().toString(36).substring(2),
        progress: 'PENDING',
      })
    );

    filesWithProgress.forEach((fileWithProgress) => {
      if (userId) {
        uploadFile(fileWithProgress, userId, folderId);
      }
    });

    if (onChange) {
      onChange([...(value || []), ...filesWithProgress]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled,
  });

  const uploadFile = async (
    fileState: FileState,
    userId: string,
    folderId: string | null
  ) => {
    // Définissez le chemin du fichier dans Firebase Storage
    const filePath = `files/${userId}/${folderId}/${fileState.file.name}`;

    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, fileState.file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Mise à jour de la progression ici
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onChange) {
          onChange(
            value?.map((f) =>
              f.key === fileState.key ? { ...f, progress } : f
            ) || []
          );
        }
      },
      (error) => {
        // Gérer l'erreur d'upload ici
        console.error('Upload error: ', error);
        if (onChange) {
          onChange(
            value?.map((f) =>
              f.key === fileState.key ? { ...f, progress: 'ERROR' } : f
            ) || []
          );
        }
      },
      async () => {
        // Assurez-vous que cette fonction callback est marquée comme `async`
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          console.log(fileState.file);
          console.log(filePath);
          console.log(folderId);

          try {
            const res = await addFile(
              userId,
              fileState.file,
              filePath,
              folderId
            );
            console.log('File added to database successfully', res);
          } catch (error: any) {
            console.error(
              'Error adding file to database:',
              error?.message || 'Unknown error'
            );
          }

          // Mise à jour de l'état pour indiquer que l'upload est complet
          if (onChange) {
            onChange(
              value?.map((f) =>
                f.key === fileState.key ? { ...f, progress: 'COMPLETE' } : f
              ) || []
            );
          }
        } catch (error) {
          console.error('Error adding file to database:', error);
          // Gérer l'erreur d'ajout à la base de données ici
          if (onChange) {
            onChange(
              value?.map((f) =>
                f.key === fileState.key ? { ...f, progress: 'ERROR' } : f
              ) || []
            );
          }
        }
      }
    );
  };

  const deleteFile = (key: string) => {
    if (onChange) {
      onChange(value?.filter((f) => f.key !== key) || []);
    }
  };

  const dropZoneClass = twMerge(
    variants.base,
    className,
    disabled && variants.disabled
  );

  return (
    <div>
      <div {...getRootProps({ className: dropZoneClass })}>
        <input {...getInputProps()} />
        <UploadCloudIcon size="24" />
        <p className="text-foreground/70 text-xs px-6">
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>
      {customError && (
        <p className="text-red-500 text-xs mt-2">{customError}</p>
      )}
      <ul className="mt-2 space-y-1">
        {value?.map(({ file, progress, key }) => (
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
