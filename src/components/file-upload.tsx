/* eslint-disable no-unused-vars */
'use client';

import { ourFileRouter } from '@/lib/uploadthing';
import { toast } from './ui/use-toast';
import { UploadDropzone } from '@/lib/helpers/uploadthing';

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast({
          title: error?.message,
        });
      }}
    />
  );
};
