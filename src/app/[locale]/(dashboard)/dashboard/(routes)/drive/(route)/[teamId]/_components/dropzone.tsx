'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import DropzoneComponent from 'react-dropzone';
import { FcOpenedFolder } from 'react-icons/fc';
import { File } from '@/models/db';
import { uploadsTeam } from '@/server/drive/upload-team';
import Loading from '@/app/[locale]/loading';

interface DropzoneProps {
  folderId: string;
  teamId: string;
}
export default function Dropzone({ folderId, teamId }: DropzoneProps) {
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser();

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onabort = () => console.log('file reading was failed');
      reader.onload = async () => {
        await uploadPost(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadPost = async (selectedFile: File) => {
    if (loading) return;
    if (!user) return;
    setLoading(true);

    // const customToken = await authFirebase();$
    // const customToken = await authFirebase();
    // console.log(customToken);

    // const res = await signInWithCustomToken(auth, customToken as string);
    // console.log(res);

    let filePath = selectedFile.path.startsWith('/')
      ? selectedFile.path.slice(1)
      : selectedFile.path;
    const relativefilePath = folderId
      ? `${teamId}/${folderId}/${filePath}`
      : `${teamId}/${filePath}`;
    const docRef = await uploadsTeam(
      user.id,
      selectedFile.size,
      selectedFile.type,
      relativefilePath,
      folderId,
      teamId
    );

    if (!docRef) {
      return;
    }

    // const imageRef = ref(storage, `users/${teamId}/files/${docRef?.id}`);

    // uploadBytesResumable(imageRef, selectedFile).then(async (snapshot) => {
    //   const downloadURL = await getDownloadURL(imageRef);

    //   if (!docRef) {
    //     return;
    //   }

    //   await updateDoc(docRef.id, downloadURL);
    // });
  };

  // 20 mo
  const maxSize = 20971520;

  return (
    <DropzoneComponent minSize={0} maxSize={maxSize} onDrop={onDrop}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

        return (
          <section className="p-5">
            {loading && <Loading />}
            <div
              {...getRootProps()}
              className={cn(
                'bg-card border relative border-dashed rounded-md p-4 w-full max-w-[calc(100vw-1rem)] transition-all hover:bg-card flex justify-center items-center flex-col cursor-pointer border-primary dark:border-gray-300 transition-colors duration-200 ease-in-out',
                isDragActive ? 'bg-primary' : ''
              )}
            >
              <input {...getInputProps({ id: 'folder-upload-input' })} />
              <FcOpenedFolder size="44" />
              <p className="text-foreground/70 text-xs px-6 pt-2">
                {!isDragActive && " Drag 'n' drop or click some files here"}
                {isDragActive && !isDragReject && 'Drop to upload this file'}
                {isDragReject && 'File type not accepted, sorry!'}
              </p>
              {isFileTooLarge && (
                <div className="text-danger mt-2">File is too large</div>
              )}
            </div>
          </section>
        );
      }}
    </DropzoneComponent>
  );
}
