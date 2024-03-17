import DocumentsIcon from '@/assets/images/documents';
import DownloadIcon from '@/assets/images/download';
import OneDriveIcon from '@/assets/images/onedrive';
import OthersIcon from '@/assets/images/other';
import PicturesIcon from '@/assets/images/pictures';
import VideosIcon from '@/assets/images/video';
import { useTheme } from 'next-themes';

export const getFolderDetails = (folderName: string) => {
  const theme = useTheme();
  switch (folderName) {
    case 'Documents':
      return { color: '#2146B5', Icon: DocumentsIcon };
    case 'Pictures':
      return { color: '#BC8224', Icon: PicturesIcon };
    case 'Videos':
      return { color: '#9216BB', Icon: VideosIcon };
    case 'OneDrive':
      return { color: '#1E3CB3', Icon: OneDriveIcon };
    case 'Downloads':
      return { color: '#0E9606', Icon: DownloadIcon };
    case 'Others':
      return {
        color: theme.theme === 'dark' ? '#D6E6E6' : '#555C5C',
        Icon: OthersIcon,
      };
    default:
      return {
        color: theme.theme === 'dark' ? '#D6E6E6' : '#555C5C',
        Icon: OthersIcon,
      };
  }
};
