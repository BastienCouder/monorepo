import VideoIcon from '@/assets/images/video';
import MusicIcon from '@/assets/images/music';
import OtherIcon from '@/assets/images/other';
import PicturesIcon from '@/assets/images/pictures';
import DocumentsIcon from '@/assets/images/documents';
import { FC } from 'react';

interface FileTypeMappingProps {
  Icon: FC<any>;
}

const fileTypeMappings: { [key: string]: FileTypeMappingProps } = {
  'image/png': { Icon: PicturesIcon },
  'image/jpeg': { Icon: PicturesIcon },
  'image/svg+xml': { Icon: PicturesIcon },
  'image/svg': { Icon: PicturesIcon },
  'video/mp4': { Icon: VideoIcon },
  'audio/mpeg': { Icon: MusicIcon },
  'application/pdf': { Icon: DocumentsIcon },
};

export const getFileDetails = (mimeType: string): FileTypeMappingProps => {
  if (mimeType in fileTypeMappings) {
    return fileTypeMappings[mimeType];
  }

  return {
    Icon: OtherIcon,
  };
};
